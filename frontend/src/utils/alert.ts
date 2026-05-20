import { showNotification } from "./notify";

export const canAlert = (last: number, cooldown: number) => {
  return Date.now() - last > cooldown;
};

export const triggerAlert = (
  level: "WARNING" | "CRITICAL",
  value: number
) => {
  if (level === "WARNING") {
    console.log("WARNING:", value);

    showNotification(
      "Warning",
      "User mulai kehilangan fokus"
    );
    return;
  }

  console.log("CRITICAL:", value);

  showNotification(
    "Critical Alert",
    `Tidak fokus terlalu lama (${value.toFixed(2)})`
  );
};