// BigBackWise — Service Worker
// Handles background push notifications

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "BigBackWise", body: event.data.text() };
  }

  const title   = payload.title || "BigBackWise";
  const options = {
    body:    payload.body  || "Something changed.",
    icon:    payload.icon  || "/icon-192.png",
    badge:   payload.badge || "/icon-192.png",
    tag:     payload.tag   || "bbw-notification",   // replaces previous notification of same type
    renotify: true,
    data:    payload.data  || {},
    actions: payload.actions || [],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If the app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

self.addEventListener("install",  () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));
