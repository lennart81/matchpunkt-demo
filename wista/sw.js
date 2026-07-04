/* Moonballer Service Worker — bewusst NUR für Web-Push.
   Kein fetch-Handler, kein Caching: die App lädt weiterhin ganz normal aus dem Netz,
   damit niemand auf einer veralteten Version festhängen kann. */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    /* kein JSON-Payload */
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Moonballer", {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: data.tag || undefined, // gleiche Kategorie ersetzt sich, statt zu stapeln
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      return clients.openWindow(event.notification.data?.url || "/");
    })
  );
});
