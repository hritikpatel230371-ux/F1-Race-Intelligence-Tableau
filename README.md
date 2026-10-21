# F1 Race Intelligence | 2010–2026

A responsive, static motorsport data-journalism portfolio for an academic Formula 1 analytics project. It uses semantic HTML, CSS, vanilla JavaScript, and Chart.js from a CDN. There is no backend, database, build process, API key, or paid API dependency.

> This is an independent academic project and is not an official Formula 1 product. The interactive chart values are illustrative sample data only; they must not be cited as Formula 1 findings.

This repository also includes the Tableau workbook, `F1-Race-Intelligence-Tableau.twb`, for the project dashboard work.

## Project structure

```text
f1-race-intelligence/
├── F1-Race-Intelligence-Tableau.twb
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

1. Download or clone this project folder.
2. Open `index.html` directly in a modern browser, or serve the folder with any simple static file server.
3. For example, in Visual Studio Code, use the Live Server extension if installed. No build or install step is required.

The fonts and Chart.js are loaded from CDNs, so the interactive charts and web fonts require an internet connection. If Chart.js is unavailable, the site displays a readable fallback instead of a broken canvas.

## Configure published links

At the top of `script.js`, update these constants when the URLs are available:

```js
const TABLEAU_DASHBOARD_URL = "";
const GITHUB_REPOSITORY_URL = "https://github.com/hritikpatel230371-ux/F1-Race-Intelligence-Tableau";
```

- Set `TABLEAU_DASHBOARD_URL` to the published Tableau Public view URL. The page validates that it uses HTTPS and the `public.tableau.com` host, then shows the embed and a new-tab fallback link.
- `GITHUB_REPOSITORY_URL` is configured for this project repository. The footer link is enabled after validating the HTTPS `github.com` host.
- Leave the Tableau constant empty until the real public dashboard URL exists. The dashboard placeholder remains visible when no valid Tableau URL is configured.

## Deploy to GitHub Pages

1. Create a GitHub repository and add the four files at the repository root.
2. Push the files to the branch you intend to publish.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the publishing branch and the `/ (root)` folder, then save.
6. Wait for the Pages deployment and open the URL shown in the Pages settings.

Because this is a static site and all local references are relative, it can also be hosted from a project subpath on GitHub Pages.

## Data and interpretation

The associated Tableau workbook describes five source tables: `race_results`, `championship_standings`, `circuits`, `lap_intelligence`, and `qualifying_results`. The workbook schema is useful for understanding intended fields, but it does not establish that source records are complete, accurate, or validated. Confirm the dataset’s provenance, season coverage, definitions, and quality before publishing measured results.

The demo charts use fictional labels (Driver 01 and Team A, for example) and illustrative values generated in `script.js`. They exist only to demonstrate filtering and chart behavior. Replace them with reproducible results from validated prepared data before presenting any real-world conclusion.

## Accessibility and compatibility

- Keyboard-accessible section navigation, skip link, visible focus states, and mobile-menu escape behavior.
- Reduced-motion preferences are respected.
- Responsive layouts support small screens through desktop widths.
- Uses system fallbacks if the external fonts do not load.
- Chart placeholders and the unconfigured Tableau dashboard fail gracefully.
