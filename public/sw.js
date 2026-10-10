if (!self.define) {
  let e,
    s = {};
  const c = (c, a) => (
    (c = new URL(c + ".js", a).href),
    s[c] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = c), (e.onload = s), document.head.appendChild(e));
        } else ((e = c), importScripts(c), s());
      }).then(() => {
        let e = s[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, t) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let n = {};
    const f = (e) => c(e, i),
      r = { module: { uri: i }, exports: n, require: f };
    s[i] = Promise.all(a.map((e) => r[e] || f(e))).then((e) => (t(...e), n));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "ecc4307a935e3f9bf091e23d474bf021",
        },
        {
          url: "/_next/static/FS2m1XMJrZiq6m-MvKvoZ/_buildManifest.js",
          revision: "1f4876b332994a555e81d20dcae6bb96",
        },
        {
          url: "/_next/static/FS2m1XMJrZiq6m-MvKvoZ/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/139.8d54880d25bc452f.js",
          revision: "8d54880d25bc452f",
        },
        {
          url: "/_next/static/chunks/199-779bb5e3b6ce457f.js",
          revision: "779bb5e3b6ce457f",
        },
        {
          url: "/_next/static/chunks/236-d6c0d62c1b8b9bef.js",
          revision: "d6c0d62c1b8b9bef",
        },
        {
          url: "/_next/static/chunks/254-bde27a04769f40ff.js",
          revision: "bde27a04769f40ff",
        },
        {
          url: "/_next/static/chunks/255-69a4a78fac9becef.js",
          revision: "69a4a78fac9becef",
        },
        {
          url: "/_next/static/chunks/274-3e6852d7c1150747.js",
          revision: "3e6852d7c1150747",
        },
        {
          url: "/_next/static/chunks/389-ce51126cc0d0f05f.js",
          revision: "ce51126cc0d0f05f",
        },
        {
          url: "/_next/static/chunks/411-29cf127a2b91a572.js",
          revision: "29cf127a2b91a572",
        },
        {
          url: "/_next/static/chunks/422-511a85e3bb7024a1.js",
          revision: "511a85e3bb7024a1",
        },
        {
          url: "/_next/static/chunks/4bd1b696-409494caf8c83275.js",
          revision: "409494caf8c83275",
        },
        {
          url: "/_next/static/chunks/4e0084c3.e0b99db629e28504.js",
          revision: "e0b99db629e28504",
        },
        {
          url: "/_next/static/chunks/529-043d9e0bf197e189.js",
          revision: "043d9e0bf197e189",
        },
        {
          url: "/_next/static/chunks/600.f599858aa90d6758.js",
          revision: "f599858aa90d6758",
        },
        {
          url: "/_next/static/chunks/619-f072ac750404f9da.js",
          revision: "f072ac750404f9da",
        },
        {
          url: "/_next/static/chunks/646.c2c67a3e35c59670.js",
          revision: "c2c67a3e35c59670",
        },
        {
          url: "/_next/static/chunks/720-bfdb25b9848c4d26.js",
          revision: "bfdb25b9848c4d26",
        },
        {
          url: "/_next/static/chunks/8187f03c-d6c851d1fffd5a05.js",
          revision: "d6c851d1fffd5a05",
        },
        {
          url: "/_next/static/chunks/881-5332ac890b27b9c1.js",
          revision: "5332ac890b27b9c1",
        },
        {
          url: "/_next/static/chunks/896-b42022932fb2d7ac.js",
          revision: "b42022932fb2d7ac",
        },
        {
          url: "/_next/static/chunks/9b0008ae.ef3d9990155e2226.js",
          revision: "ef3d9990155e2226",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-b05f28c964559e78.js",
          revision: "b05f28c964559e78",
        },
        {
          url: "/_next/static/chunks/app/builder/layout-b05f28c964559e78.js",
          revision: "b05f28c964559e78",
        },
        {
          url: "/_next/static/chunks/app/builder/page-c4f63d338c5f6fe2.js",
          revision: "c4f63d338c5f6fe2",
        },
        {
          url: "/_next/static/chunks/app/error-1ffaa215cae8678d.js",
          revision: "1ffaa215cae8678d",
        },
        {
          url: "/_next/static/chunks/app/interview-prep/page-c21f6e5e0f625581.js",
          revision: "c21f6e5e0f625581",
        },
        {
          url: "/_next/static/chunks/app/layout-ed30eb825d0adaf7.js",
          revision: "ed30eb825d0adaf7",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-b05f28c964559e78.js",
          revision: "b05f28c964559e78",
        },
        {
          url: "/_next/static/chunks/app/not-found-489804907719a852.js",
          revision: "489804907719a852",
        },
        {
          url: "/_next/static/chunks/app/page-709dabfa5ff7049f.js",
          revision: "709dabfa5ff7049f",
        },
        {
          url: "/_next/static/chunks/app/robots.txt/route-b05f28c964559e78.js",
          revision: "b05f28c964559e78",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-b05f28c964559e78.js",
          revision: "b05f28c964559e78",
        },
        {
          url: "/_next/static/chunks/app/templates/layout-b05f28c964559e78.js",
          revision: "b05f28c964559e78",
        },
        {
          url: "/_next/static/chunks/app/templates/page-d6f091c8068b64f5.js",
          revision: "d6f091c8068b64f5",
        },
        {
          url: "/_next/static/chunks/framework-e2c84bf8dbc6c531.js",
          revision: "e2c84bf8dbc6c531",
        },
        {
          url: "/_next/static/chunks/main-037056212c184126.js",
          revision: "037056212c184126",
        },
        {
          url: "/_next/static/chunks/main-app-6b900dbe19266bba.js",
          revision: "6b900dbe19266bba",
        },
        {
          url: "/_next/static/chunks/pages/_app-0d6ce27712411be2.js",
          revision: "0d6ce27712411be2",
        },
        {
          url: "/_next/static/chunks/pages/_error-a8479a8c7bc399cf.js",
          revision: "a8479a8c7bc399cf",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-2231fc76cb0749d0.js",
          revision: "2231fc76cb0749d0",
        },
        {
          url: "/_next/static/css/2651684a858482eb.css",
          revision: "2651684a858482eb",
        },
        {
          url: "/_next/static/css/80d8c53fce1dcf43.css",
          revision: "80d8c53fce1dcf43",
        },
        {
          url: "/_next/static/media/013b72fa676f92e0-s.woff2",
          revision: "bc06a1ea50382b6956e53aeb91c889c1",
        },
        {
          url: "/_next/static/media/19cfc7226ec3afaa-s.woff2",
          revision: "9dda5cfc9a46f256d0e131bb535e46f8",
        },
        {
          url: "/_next/static/media/21350d82a1f187e9-s.woff2",
          revision: "4e2553027f1d60eff32898367dd4d541",
        },
        {
          url: "/_next/static/media/2b5b02fc7e511755-s.woff2",
          revision: "a27466d069120e75e25b4fd06edd5be2",
        },
        {
          url: "/_next/static/media/65f03d54ccadf4a8-s.woff2",
          revision: "58bcf4f276e0844890901b91c411447c",
        },
        {
          url: "/_next/static/media/7d4881bb7e1bf84d-s.p.woff2",
          revision: "cd5b25781181c5c03d99ac2cbf88016a",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/b9408752a0c24fb9-s.woff2",
          revision: "c10faa6c8fbd7a47d8f00e75e82935cb",
        },
        {
          url: "/_next/static/media/ba9851c3c22cd980-s.woff2",
          revision: "9e494903d6b0ffec1a1e14d34427d44d",
        },
        {
          url: "/_next/static/media/c5fe6dc8356a8c31-s.woff2",
          revision: "027a89e9ab733a145db70f09b8a18b42",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e038a29029a234f2-s.woff2",
          revision: "42a21c981b367f31bd04683072dae1c1",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/pdf.worker.min.mjs",
          revision: "e2d083f286802d840b503b8c2e81868d",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: c,
              state: a,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
