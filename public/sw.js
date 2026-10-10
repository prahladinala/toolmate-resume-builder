if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, t) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let n = {};
    const r = (e) => a(e, i),
      d = { module: { uri: i }, exports: n, require: r };
    s[i] = Promise.all(c.map((e) => d[e] || r(e))).then((e) => (t(...e), n));
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
          revision: "9ccd8b4331e33e411d27e7aeaa42f830",
        },
        {
          url: "/_next/static/chunks/112-bedd88c35a6d974f.js",
          revision: "bedd88c35a6d974f",
        },
        {
          url: "/_next/static/chunks/139.8d54880d25bc452f.js",
          revision: "8d54880d25bc452f",
        },
        {
          url: "/_next/static/chunks/164f4fb6-8f49e251b96a53d3.js",
          revision: "8f49e251b96a53d3",
        },
        {
          url: "/_next/static/chunks/199.829cec104a19a84e.js",
          revision: "829cec104a19a84e",
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
          url: "/_next/static/chunks/291-360a94dbdc3171da.js",
          revision: "360a94dbdc3171da",
        },
        {
          url: "/_next/static/chunks/2f0b94e8-015daada98eb83e2.js",
          revision: "015daada98eb83e2",
        },
        {
          url: "/_next/static/chunks/4bd1b696-409494caf8c83275.js",
          revision: "409494caf8c83275",
        },
        {
          url: "/_next/static/chunks/4e0084c3-e0b99db629e28504.js",
          revision: "e0b99db629e28504",
        },
        {
          url: "/_next/static/chunks/529-de58ff762815a74d.js",
          revision: "de58ff762815a74d",
        },
        {
          url: "/_next/static/chunks/555-9097e0d9ca34068a.js",
          revision: "9097e0d9ca34068a",
        },
        {
          url: "/_next/static/chunks/580-4174b8d88fe381dd.js",
          revision: "4174b8d88fe381dd",
        },
        {
          url: "/_next/static/chunks/635-541666005b2042b6.js",
          revision: "541666005b2042b6",
        },
        {
          url: "/_next/static/chunks/64-da52ed59ccc1301e.js",
          revision: "da52ed59ccc1301e",
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
          url: "/_next/static/chunks/915-843b5d770dbdf120.js",
          revision: "843b5d770dbdf120",
        },
        {
          url: "/_next/static/chunks/931.e9104dcb0f23cc3c.js",
          revision: "e9104dcb0f23cc3c",
        },
        {
          url: "/_next/static/chunks/9b0008ae.ef3d9990155e2226.js",
          revision: "ef3d9990155e2226",
        },
        {
          url: "/_next/static/chunks/ad2866b8-635304a38afc0b68.js",
          revision: "635304a38afc0b68",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-6a80c9e7f0815e9e.js",
          revision: "6a80c9e7f0815e9e",
        },
        {
          url: "/_next/static/chunks/app/builder/layout-6a80c9e7f0815e9e.js",
          revision: "6a80c9e7f0815e9e",
        },
        {
          url: "/_next/static/chunks/app/builder/page-37dbc335b3afcd16.js",
          revision: "37dbc335b3afcd16",
        },
        {
          url: "/_next/static/chunks/app/error-2813a774e6a1d57a.js",
          revision: "2813a774e6a1d57a",
        },
        {
          url: "/_next/static/chunks/app/interview-prep/layout-6a80c9e7f0815e9e.js",
          revision: "6a80c9e7f0815e9e",
        },
        {
          url: "/_next/static/chunks/app/interview-prep/page-0ac616794d3d16f7.js",
          revision: "0ac616794d3d16f7",
        },
        {
          url: "/_next/static/chunks/app/layout-ed30eb825d0adaf7.js",
          revision: "ed30eb825d0adaf7",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-6a80c9e7f0815e9e.js",
          revision: "6a80c9e7f0815e9e",
        },
        {
          url: "/_next/static/chunks/app/not-found-a4af9478aec7bcd0.js",
          revision: "a4af9478aec7bcd0",
        },
        {
          url: "/_next/static/chunks/app/page-e1624b1bb79b09e9.js",
          revision: "e1624b1bb79b09e9",
        },
        {
          url: "/_next/static/chunks/app/robots.txt/route-6a80c9e7f0815e9e.js",
          revision: "6a80c9e7f0815e9e",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-6a80c9e7f0815e9e.js",
          revision: "6a80c9e7f0815e9e",
        },
        {
          url: "/_next/static/chunks/app/templates/layout-6a80c9e7f0815e9e.js",
          revision: "6a80c9e7f0815e9e",
        },
        {
          url: "/_next/static/chunks/app/templates/page-c22a434ac4b8dc6c.js",
          revision: "c22a434ac4b8dc6c",
        },
        {
          url: "/_next/static/chunks/bc98253f.d6fc8a0138855acd.js",
          revision: "d6fc8a0138855acd",
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
          url: "/_next/static/chunks/webpack-8ea3775e161e9df1.js",
          revision: "8ea3775e161e9df1",
        },
        {
          url: "/_next/static/css/2651684a858482eb.css",
          revision: "2651684a858482eb",
        },
        {
          url: "/_next/static/css/8a776fbff608e230.css",
          revision: "8a776fbff608e230",
        },
        {
          url: "/_next/static/kTxeBz25CG2XUorEh0Cuw/_buildManifest.js",
          revision: "1f4876b332994a555e81d20dcae6bb96",
        },
        {
          url: "/_next/static/kTxeBz25CG2XUorEh0Cuw/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
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
        { url: "/llms.txt", revision: "376a727fd5b88947d904e41174ce78b0" },
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
              event: a,
              state: c,
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
