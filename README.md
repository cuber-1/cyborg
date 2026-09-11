# Team CYBORG

The website for Team CYBORG, University of Maryland Gemstone Honors Program, Class of 2029.

**Website:** https://cuber-1.github.io/cyborg/

## Local preview

```sh
cd website
npm start
```

Open http://127.0.0.1:4173. There is no package installation or build step. See [website/README.md](website/README.md) for the page structure and editing notes.

## Publish an update

The source lives on `codex/website`. GitHub Pages serves the contents of `website/` from the root of the `codex/pages` deployment branch. The `.nojekyll` file keeps the site as plain HTML, CSS, and JavaScript.

After committing a website change, run these commands from the repository root:

```sh
git push origin codex/website
git subtree push --prefix=website origin codex/pages
```

GitHub Pages then publishes the updated deployment branch. The repository tracks the website and its documentation; local research documents and previews are excluded by `.gitignore`.

## Contact

[draicha@umd.edu](mailto:draicha@umd.edu)
