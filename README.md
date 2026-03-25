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

## Run locally

You can serve the folder with any static server. Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

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

## Note about direct URL routing

This scaffold uses `history.pushState` for clean URLs.
If your production web server does not already rewrite unknown paths to `index.html`, configure that rewrite so `/about`, `/services`, etc. load correctly on hard refresh.
