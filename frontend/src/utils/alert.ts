import { showNotification } from "./notify";

export const canAlert = (last: number, cooldown: number) => {
  return Date.now() - last > cooldown;
};
const playAlert = (level: "WARNING" | "CRITICAL" | "DANGER") => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.type = "sine";

  if (level === "WARNING") {
    // 1 beep pendek nada rendah
    oscillator.frequency.value = 520;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } else if (level === "CRITICAL") {
    // 3 beep nada tinggi
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.55);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.9);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1);
  } else {
    // DANGER = nada sangat tinggi, 5 beep cepat 
    oscillator.frequency.value = 1200;
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.6, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.6, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.6, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.6, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.9);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1);
  }
};
export const triggerAlert = (
  level: "WARNING" | "CRITICAL" | "DANGER",
  value: number,
) => {
  playAlert(level);

  if (level === "WARNING") {
    console.log("WARNING:", value);
    showNotification("Warning", "User mulai kehilangan fokus");
    return;
  }

  if (level === "CRITICAL") {
    console.log("CRITICAL:", value);
    showNotification(
      "Critical Alert",
      `Tidak fokus terlalu lama (${value.toFixed(2)})`,
    );
    return;
  }

  if (level === "DANGER") {
    console.log("DANGER:", value);
    showNotification(
      "⚠️ DANGER!",
      `Tidak fokus lebih dari 1 menit! (${value.toFixed(0)}s)`,
    );
  }
};
