# personal-site

Simple static portfolio site for Michael Heyer (MSE CSE @ Michigan). No build step needed—open `index.html` in a browser or host from any static site provider (GitHub Pages, Netlify, Vercel static export).

## Structure
- `index.html` — page layout and content
- `style.css` — styling with a bold dark theme and highlight colors
- `script.js` — small helpers (smooth scroll trigger)

## Customizing
- **Projects**: Duplicate a card inside the `#projects` section and edit the title, headline, list, and tags.
- **Skills/About**: Update text in `#skills` and `#about`.
- **Contact links**: Replace placeholder LinkedIn/GitHub URLs in `#contact`.
- **Talking resume embed**: Inside `#talking-resume`, replace the placeholder block with your iframe or script. Example:

```html
<div class="talking-resume">
  <div class="embed-wrapper">
    <iframe src="https://your-hosted-chat.example.com" title="Talking Resume" allow="clipboard-write" loading="lazy"></iframe>
  </div>
</div>
```

Add any required scripts/styles from your chatbot provider above the closing `</body>` tag.

## Local preview
Open `index.html` directly in your browser, or serve with Python for clean relative paths:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deployment
Any static hosting works. For GitHub Pages, push to a repo and enable Pages on the `main` branch (root). For Netlify/Vercel, set the build command to "None" and the publish directory to the repo root.
# maddy-website
