# Python Zero to OOP

A browser-based Python course: 15 lessons from `print()` to classes, with animations, a step-through viewer and 48 auto-checked practice problems. Python runs in the browser (Pyodide), so there is no server.

## Publish on GitHub Pages
1. Create a repository (for example `python-zero-to-oop`) and upload every file in this folder to the root.
2. Repository Settings > Pages > Build and deployment > Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

Students need an internet connection (Python and fonts load from CDNs).

## Files
- `index.html`: page shell
- `lessons.js`: all lesson text, examples and practice problems (edit this to change content)
- `harness.js`: Python helper code for running, tracing and checking
- `core.js`, `widgets.js`, `app.js`, `style.css`: interface and animations
