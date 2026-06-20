# THENUX Jarvis — Website

Static site for THENUX Jarvis (no build step, no dependencies to install).

## Files
- `index.html` — landing page (hero, pipeline, features, model suite, tool suite, changelog, download)
- `admin.html` — password-protected changelog editor
- `css/style.css` — site styles
- `css/admin.css` — admin panel styles
- `js/main.js` — scroll reveal, radar animation, tool tabs, changelog renderer
- `js/admin.js` — admin login + changelog editor logic

## Running it
Just open `index.html` in a browser, or serve the folder with any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a plain `nginx`/`python -m http.server`).

No npm install, no bundler — it's plain HTML/CSS/JS plus the `marked.js` CDN script for
rendering changelog markdown.

## Admin panel
Go to `/admin.html`, enter the admin password, paste your `UPDATES.md` changelog
content into the editor, and click **Save changelog**. It writes to the browser's
`localStorage`, which `index.html` reads from on load — so the changelog updates
on the live site immediately without redeploying.

> Note: this is a client-side password gate suitable for a single-operator site.
> It is not a secure backend — anyone with the password, or anyone who opens dev
> tools, can edit the stored changelog. Don't rely on it to protect sensitive data.

## Updating the download link
The download buttons point to:
`https://github.com/thenuxofc/T.H.E.N.U.X-JARVIS-V2/releases/download/v2.0/THENUX_Jarvis_Setup.exe`

Update this in `index.html` whenever you cut a new release.
