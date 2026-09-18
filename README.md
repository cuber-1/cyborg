# Team CYBORG website

A five-page static website for Team CYBORG, University of Maryland Gemstone Honors Program, Class of 2029.

## Preview

Run `npm start` from this directory, then open http://127.0.0.1:4173. No installation or build step is required. Use `PORT=4187 npm start` if the default port is occupied.

The HTML pages can also be opened directly. A local HTTP server provides the most consistent browser behavior.

## Pages and shared code

- `index.html`: concise project introduction and links into the site.
- `research.html`: research question, planned measures, and candidate study design.
- `team.html`: the 11-person roster and faculty mentor.
- `reading.html`: selected literature with search, topic filters, and annotations.
- `contact.html`: official email and copy-email control.
- `styles.css`: shared responsive layout, fixed light palette, and subtle transitions.
- `site.js`: mobile navigation, clipboard feedback, page reveals, and compatibility for old homepage anchors.
- `reading.js`: reading-page search, filtering, and rendering.
- `research-data.js`: paper metadata, short annotations, and original roster records. The displayed roster is static HTML in `team.html`.
- `assets/`: team portraits, the University of Maryland footer logo, the original concept image, and the CYBORG mark. See `assets/image-provenance.md` for the concept artwork's generation details.

Edit page content directly in its HTML file. The navigation and footer are repeated in the five files so every page has functional links without JavaScript. Apply changes to those shared elements consistently across the pages.

## Appearance and accessibility

The site uses a fixed light appearance across all pages. Mobile navigation supports Escape and focus restoration; navigation controls, reading-result announcements, and clipboard feedback are accessible to assistive technology. Team portraits identify the people on the roster, and the footer includes the University of Maryland logo.

Motion is limited to brief hover transitions and small reveals on entering the viewport. Reduced-motion preferences disable these effects. Content stays visible if JavaScript is unavailable, except the dynamically rendered reading list, which includes a fallback source link.

## Research framing

The study is in development. The site does not claim completed experiments, a validated adaptive controller, or clinical effectiveness. The research page keeps the EEG-validation and retained-learning distinctions clear. The existing hand artwork is a concept illustration, not a confirmed study device.

## Validation

Run `npm run check` for JavaScript syntax checks. For browser validation, review all five pages at mobile, tablet, and desktop widths. Check mobile navigation and Escape, legacy homepage anchors, search and combined filters, empty results, annotations, email copying, team portraits, and footer logos.

## Hosting

Upload this directory to a static host. Serve `index.html` and the other HTML pages with their relative scripts, stylesheet, and assets. There is no backend, database, API key, or build dependency. `server.mjs` is only a local preview server. DM Sans loads optionally from Google Fonts, with local system-font fallbacks.
