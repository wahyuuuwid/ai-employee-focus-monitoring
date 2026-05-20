export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const showNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/warning.png",
  });
};