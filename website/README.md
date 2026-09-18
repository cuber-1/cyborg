# Team CYBORG website

A five-page static website for Team CYBORG, University of Maryland Gemstone Honors Program, Class of 2029.

## Preview

Run `npm start` from this directory, then open http://127.0.0.1:4173. No installation or build step is required. Use `PORT=4187 npm start` if the default port is occupied.

The HTML pages can also be opened directly. A local HTTP server provides the most consistent browser behavior.

## Pages and shared code

- `index.html`: project introduction with a brain/arm illustration beside the headline, an expanding research panel, and links into the site.
- `research.html`: research question, planned measures, and candidate study design.
- `team.html`: the 10-person portrait gallery and faculty mentor, without personal name labels.
- `reading.html`: selected literature with search, topic filters, and annotations.
- `contact.html`: official email and copy-email control.
- `styles.css`: shared responsive layout, fixed light palette, and subtle transitions.
- `site.js`: mobile navigation, clipboard feedback, page reveals, refresh-to-top behavior, and compatibility for old homepage anchors.
- `home-intro.js`: types the homepage headline while the surrounding content fades in, preserving the heading's layout and accessible text.
- `reading.js`: reading-page search, filtering, and rendering.
- `feature-scroll.js`: expands the black research panel from 72% viewport width (80% on mobile) to the screen edges; the contents scale gently without reflowing.
- `brain-arm.js` / `brain-arm.css`: homepage-only SVG scroll animation; native scrolling controls signal paths, elbow movement, and feedback.
- `research-data.js`: paper metadata and short annotations. The team gallery is static HTML in `team.html`.
- `assets/`: team portraits, University of Maryland and Gemstone logos, and the CYBORG mark. See `assets/image-provenance.md` for image sources.

Edit page content directly in its HTML file. The navigation and footer are repeated in the five files so every page has functional links without JavaScript. Apply changes to those shared elements consistently across the pages.

## Appearance and accessibility

The site uses a fixed light appearance across all pages. Mobile navigation supports Escape and focus restoration; navigation controls, reading-result announcements, and clipboard feedback are accessible to assistive technology. Team portraits use generic descriptions without personal names, and the footer includes the University of Maryland logo.

Motion includes a single typing pass for the homepage headline with a concurrent page fade, brief hover transitions, small reveals, an expanding black research panel, and a hero illustration driven by scroll position. The typing effect reserves the complete headline's space and exposes its full text to assistive technology. The brain/arm illustration uses native scrolling and schedules frames only when the page scrolls or resizes. Reduced-motion preferences show the complete headline and a static illustration and disable other motion. Content stays visible if JavaScript is unavailable, except the dynamically rendered reading list, which includes a fallback source link.

## Research framing

The study is in development. The site does not claim completed experiments, a validated adaptive controller, or clinical effectiveness. The research page keeps the EEG-validation and retained-learning distinctions clear. The animated brain–arm diagram is a concept illustration, not a confirmed study device.

## Validation

Run `npm run check` for JavaScript syntax checks. For browser validation, review all five pages at mobile, tablet, and desktop widths. Check mobile navigation and Escape, legacy homepage anchors, search and combined filters, empty results, annotations, email copying, team portraits, and footer logos.

## Hosting

Upload this directory to a static host. Serve `index.html` and the other HTML pages with their relative scripts, stylesheet, and assets. There is no backend, database, API key, or build dependency. `server.mjs` is only a local preview server. DM Sans loads optionally from Google Fonts, with local system-font fallbacks.
