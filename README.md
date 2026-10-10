# Ariao https://ariao.pxxlspace.cv

Ariao is an independent digital studio website for identities, digital products,
and visual stories.

## Project structure

- `index.html` - homepage
- `work.html` - selected work
- `approach.html` - studio approach
- `studio.html` - studio information
- `contact.html` - project contact page
- `styles.css` - shared styles and responsive layouts
- `script.js` - scroll, reveal, and count-up interactions
- `hero-character.jpg` and `visual-study.jpg` - local visual assets

## Run locally

This is a static website, so no build step or package installation is required.
Open `index.html` in a browser, or serve the folder with any static file server.

For example, with Python installed:

```text
python -m http.server
```

Then visit `http://localhost:8000`.

## Deployment

The site is suitable for Vercel, Netlify, GitHub Pages, or any static hosting
provider. When the repository is connected to Vercel, pushes to the production
branch can be configured to deploy automatically.
