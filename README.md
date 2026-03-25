# Matt Rattley website scaffold

This is a lightweight single-page website scaffold with client-side routing.

## Key behaviour

- Persistent left sidebar navigation on desktop.
- Mobile top bar + hamburger menu on narrow screens.
- Internal page navigation does not fully reload the app shell.
- Internal routes included:
  - `/`
  - `/about`
  - `/services`
  - `/speaking`

## Preview options

### Option A (recommended): run a local static server

You can serve the folder with any static server. Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

### Option B: open `index.html` directly (file mode)

If you open `index.html` directly from your file system, the app automatically switches to hash routing (e.g. `#/services`) so links still work without pointing to `C:/services.html`.

## Swap images later

1. Put your replacement image files in `assets/`.
2. Open `app.js`.
3. Update the paths in `SITE_CONFIG`:

```js
const SITE_CONFIG = {
  homeImage: "./assets/your-home-image.jpg",
  aboutImage: "./assets/your-about-image.jpg",
};
```

No other code changes are required.

## Note about direct URL routing on web servers

When served over `http(s)`, this scaffold uses clean paths with `history.pushState`.
If your production web server does not already rewrite unknown paths to `index.html`, configure that rewrite so `/about`, `/services`, etc. load correctly on hard refresh.
