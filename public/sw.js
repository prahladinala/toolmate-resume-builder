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
          revision: "79fef89b2c231bce73995fcea71f0e32",
        },
        {
          url: "/_next/static/chunks/1255-b8cf77ab14370e57.js",
          revision: "b8cf77ab14370e57",
        },
        {
          url: "/_next/static/chunks/1482-c87be2e9c175af56.js",
          revision: "c87be2e9c175af56",
        },
        {
          url: "/_next/static/chunks/1502.aab8b397bcec636c.js",
          revision: "aab8b397bcec636c",
        },
        {
          url: "/_next/static/chunks/1548.6463d13ced700323.js",
          revision: "6463d13ced700323",
        },
        {
          url: "/_next/static/chunks/1646.a93085a0445ba909.js",
          revision: "a93085a0445ba909",
        },
        {
          url: "/_next/static/chunks/164f4fb6.90b34bfdfbc194b5.js",
          revision: "90b34bfdfbc194b5",
        },
        {
          url: "/_next/static/chunks/1993.7b27060f69ac1b5a.js",
          revision: "7b27060f69ac1b5a",
        },
        {
          url: "/_next/static/chunks/2175.6282b7ac626beb53.js",
          revision: "6282b7ac626beb53",
        },
        {
          url: "/_next/static/chunks/254-bde27a04769f40ff.js",
          revision: "bde27a04769f40ff",
        },
        {
          url: "/_next/static/chunks/2619-04bc32f026a0d946.js",
          revision: "04bc32f026a0d946",
        },
        {
          url: "/_next/static/chunks/2931.379acb5f2f07dff1.js",
          revision: "379acb5f2f07dff1",
        },
        {
          url: "/_next/static/chunks/2f0b94e8.3186a98eb4c9012b.js",
          revision: "3186a98eb4c9012b",
        },
        {
          url: "/_next/static/chunks/3273.7049f3002f3cea06.js",
          revision: "7049f3002f3cea06",
        },
        {
          url: "/_next/static/chunks/3736-6c9da38afc5059cb.js",
          revision: "6c9da38afc5059cb",
        },
        {
          url: "/_next/static/chunks/4199.48d9467fae1d78f7.js",
          revision: "48d9467fae1d78f7",
        },
        {
          url: "/_next/static/chunks/4737-d4e54090c411e947.js",
          revision: "d4e54090c411e947",
        },
        {
          url: "/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js",
          revision: "100b9d70ed4e49c1",
        },
        {
          url: "/_next/static/chunks/4e0084c3.052c7c434a79d2e5.js",
          revision: "052c7c434a79d2e5",
        },
        {
          url: "/_next/static/chunks/5139.e4ff9cc3669129ed.js",
          revision: "e4ff9cc3669129ed",
        },
        {
          url: "/_next/static/chunks/5269.e16afd649431443e.js",
          revision: "e16afd649431443e",
        },
        {
          url: "/_next/static/chunks/5376.04a3d57f5f04927f.js",
          revision: "04a3d57f5f04927f",
        },
        {
          url: "/_next/static/chunks/6241.6c62f1d1123f6016.js",
          revision: "6c62f1d1123f6016",
        },
        {
          url: "/_next/static/chunks/6479.4beb5279ab7b053f.js",
          revision: "4beb5279ab7b053f",
        },
        {
          url: "/_next/static/chunks/7014.6a3282887be20cd8.js",
          revision: "6a3282887be20cd8",
        },
        {
          url: "/_next/static/chunks/7090.f06fc540f3da2110.js",
          revision: "f06fc540f3da2110",
        },
        {
          url: "/_next/static/chunks/7148-04e5d987010bb702.js",
          revision: "04e5d987010bb702",
        },
        {
          url: "/_next/static/chunks/7487-0b5bb8f9c2edfcdd.js",
          revision: "0b5bb8f9c2edfcdd",
        },
        {
          url: "/_next/static/chunks/7529-e9ca6eabf7111494.js",
          revision: "e9ca6eabf7111494",
        },
        {
          url: "/_next/static/chunks/8187f03c.b7747eda36c44c7e.js",
          revision: "b7747eda36c44c7e",
        },
        {
          url: "/_next/static/chunks/8720-0ea6dfb0b10cd39c.js",
          revision: "0ea6dfb0b10cd39c",
        },
        {
          url: "/_next/static/chunks/9074.ec4f162583f3aca6.js",
          revision: "ec4f162583f3aca6",
        },
        {
          url: "/_next/static/chunks/9442.a5233fe700e35556.js",
          revision: "a5233fe700e35556",
        },
        {
          url: "/_next/static/chunks/9635-5cad93b8f4aff687.js",
          revision: "5cad93b8f4aff687",
        },
        {
          url: "/_next/static/chunks/9b0008ae.5313cf9347fd9d1f.js",
          revision: "5313cf9347fd9d1f",
        },
        {
          url: "/_next/static/chunks/ad2866b8.e13a3cf75ccf0eb8.js",
          revision: "e13a3cf75ccf0eb8",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/builder/layout-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/builder/page-e853a0acb9324bb9.js",
          revision: "e853a0acb9324bb9",
        },
        {
          url: "/_next/static/chunks/app/error-ef5c547f3b23f275.js",
          revision: "ef5c547f3b23f275",
        },
        {
          url: "/_next/static/chunks/app/interview-prep/layout-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/interview-prep/page-24fa5b538545c8c6.js",
          revision: "24fa5b538545c8c6",
        },
        {
          url: "/_next/static/chunks/app/layout-27f75f73b8c59fd4.js",
          revision: "27f75f73b8c59fd4",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/not-found-9fd556874b2e83a3.js",
          revision: "9fd556874b2e83a3",
        },
        {
          url: "/_next/static/chunks/app/opengraph-image/route-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/page-16441f33775557d1.js",
          revision: "16441f33775557d1",
        },
        {
          url: "/_next/static/chunks/app/robots.txt/route-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/templates/layout-b082066e10797041.js",
          revision: "b082066e10797041",
        },
        {
          url: "/_next/static/chunks/app/templates/page-cc72c91d8aff8715.js",
          revision: "cc72c91d8aff8715",
        },
        {
          url: "/_next/static/chunks/bc98253f.d6fc8a0138855acd.js",
          revision: "d6fc8a0138855acd",
        },
        {
          url: "/_next/static/chunks/framework-32492dd9c4fc5870.js",
          revision: "32492dd9c4fc5870",
        },
        {
          url: "/_next/static/chunks/main-959d04bc3ed08c0d.js",
          revision: "959d04bc3ed08c0d",
        },
        {
          url: "/_next/static/chunks/main-app-7080fccbbcaee605.js",
          revision: "7080fccbbcaee605",
        },
        {
          url: "/_next/static/chunks/pages/_app-e8b861c87f6f033c.js",
          revision: "e8b861c87f6f033c",
        },
        {
          url: "/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js",
          revision: "c8f84f7bd11d43d4",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-74448cc994a18c7d.js",
          revision: "74448cc994a18c7d",
        },
        {
          url: "/_next/static/css/34a95bad4afe0ef6.css",
          revision: "34a95bad4afe0ef6",
        },
        {
          url: "/_next/static/css/bd3d1b982e918aaf.css",
          revision: "bd3d1b982e918aaf",
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
        {
          url: "/_next/static/nLF5JTvOgk8MLbnrNWXGR/_buildManifest.js",
          revision: "62afe58274397459d158c970a7a34d35",
        },
        {
          url: "/_next/static/nLF5JTvOgk8MLbnrNWXGR/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
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
