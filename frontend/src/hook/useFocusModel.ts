import { useEffect, useRef, useState } from "react";

import * as tmImage from "@teachablemachine/image";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { requestNotificationPermission } from "../utils/notify";
import type { Prediction } from "../types/prediction";
import { ema } from "../utils/smoothing";
import { canAlert, triggerAlert } from "../utils/alert";
// OPTIONAL:
// import "@tensorflow/tfjs-backend-wasm";

type State = "FOCUS" | "NOT_FOCUS" | "UNKNOWN";

export const useFocusAI = () => {
  // =========================
  // REFS
  // =========================
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);

  const animationRef = useRef<number | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const isPredicting = useRef(false);

  const lastPredict = useRef<number>(0);

  const focusEMA = useRef(0);

  const notFocusEMA = useRef(0);

  const stateRef = useRef<State>("UNKNOWN");

  const notFocusStart = useRef<number | null>(null);

  const lastAlert = useRef(0);

  const warningTriggered = useRef(false);

  const criticalTriggered = useRef(false);

  const uiCounter = useRef(0);

  const [status, setStatus] = useState("Loading...");

  const [focusScore, setFocusScore] = useState(0);

  const [notFocusScore, setNotFocusScore] = useState(0);

  const [duration, setDuration] = useState(0);

  const PREDICT_INTERVAL = 1000;

  const UI_UPDATE_INTERVAL = 5;

  const ALERT_COOLDOWN = 15000;

  const ALPHA = 0.75;

  const MIN_CONF = 0.5;

  useEffect(() => {
    init();

    requestNotificationPermission();

    return () => {
      stopLoop();

      stopCamera();
    };
  }, []);

  const init = async () => {
    try {
      setStatus("Loading AI...");

      await tf.setBackend("webgl");

      await tf.ready();

      const model = await tmImage.load(
        "/model/model.json",
        "/model/metadata.json",
      );

      modelRef.current = model;

      await setupCamera();

      startLoop();

      setStatus("Running");
    } catch (err) {
      console.error(err);

      setStatus("Error");
    }
  };

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 640,
          },
          height: {
            ideal: 480,
          },
          frameRate: {
            ideal: 30,
            max: 30,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await new Promise<void>((resolve) => {
          videoRef.current!.onloadeddata = () => resolve();
        });
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err) {
      console.error(err);

      setStatus("Camera Error");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const loop = async () => {
    const now = Date.now();

    if (
      now - lastPredict.current >= PREDICT_INTERVAL &&
      !isPredicting.current &&
      modelRef.current
    ) {
      try {
        isPredicting.current = true;

        lastPredict.current = now;

        await predict(modelRef.current);
      } catch (err) {
        console.error("Prediction Error:", err);
      } finally {
        isPredicting.current = false;
      }
    }

    animationRef.current = requestAnimationFrame(loop);
  };

  const startLoop = () => {
    stopLoop();

    loop();
  };

  const stopLoop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);

      animationRef.current = null;
    }
  };

  const normalize = (s: string) => s.toLowerCase().replace(/\s|_/g, "");

  const predict = async (model: tmImage.CustomMobileNet) => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 160, 160);

    let prediction: Prediction[] = [];

    tf.engine().startScope();

    try {
      prediction = await model.predict(canvasRef.current);
    } finally {
      tf.engine().endScope();
    }

    let focus = 0;

    let notFocus = 0;

    prediction.forEach((p: Prediction) => {
      const label = normalize(p.className);

      if (label.includes("fokus") && !label.includes("tidak")) {
        focus = p.probability;
      }

      if (label.includes("tidakfokus") || label.includes("not")) {
        notFocus = p.probability;
      }
    });

    if (focus < MIN_CONF && notFocus < MIN_CONF) {
      setStatus("Detecting");

      return;
    }

    const sum = focus + notFocus;

    if (sum > 0) {
      focus /= sum;

      notFocus /= sum;
    }

    focusEMA.current = ema(focusEMA.current, focus, ALPHA);

    notFocusEMA.current = ema(notFocusEMA.current, notFocus, ALPHA);

    const f = focusEMA.current;

    const nf = notFocusEMA.current;

    uiCounter.current++;

    if (uiCounter.current % UI_UPDATE_INTERVAL === 0) {
      setFocusScore(Number((f * 100).toFixed(1)));

      setNotFocusScore(Number((nf * 100).toFixed(1)));
    }

    if (nf > 0.75) {
      if (!notFocusStart.current) {
        notFocusStart.current = Date.now();
      }

      const dur = (Date.now() - notFocusStart.current) / 1000;

      setDuration(Math.floor(dur));

      const intensity = nf * dur;

      if (dur >= 5 && dur < 10 && !warningTriggered.current) {
        warningTriggered.current = true;

        triggerAlert("WARNING", dur);
      }

      if (
        dur >= 10 &&
        intensity > 6 &&
        !criticalTriggered.current &&
        canAlert(lastAlert.current, ALERT_COOLDOWN)
      ) {
        criticalTriggered.current = true;

        lastAlert.current = Date.now();

        triggerAlert("CRITICAL", intensity);
      }

      stateRef.current = "NOT_FOCUS";

      setStatus("NOT FOCUS");

      return;
    }

    if (f > 0.6 && f > nf) {
      stateRef.current = "FOCUS";

      setStatus("FOCUS");

      notFocusStart.current = null;

      setDuration(0);

      warningTriggered.current = false;

      criticalTriggered.current = false;

      return;
    }

    setStatus("Detecting");
  };
  const [cameraReady, setCameraReady] = useState(false);
  return {
    videoRef,
    canvasRef,
    status,
    focusScore,
    notFocusScore,
    duration,
    cameraReady,
  };
};
