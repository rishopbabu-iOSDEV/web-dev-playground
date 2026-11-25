# Web Development Playground

Hands-on learning playgrounds for web fundamentals: HTML/CSS, JavaScript, MySQL, APIs and Python. Most are standalone single-file HTML pages with no build step or dependencies: open one in a browser. The API starter and the Python course have a few extra notes below.

## Contents

### HTML-CSS
- `CSS Grid Playground.html`: experiment with CSS Grid properties
- `Flexbox Playground.html`: experiment with Flexbox properties
- `Flex vs Grid — Side-by-Side Playground.html`: compare both layout models
- `html-tags-attributes.html`: HTML tags and attributes reference

### JavaScript
- `Chai Corner JS Playground.html`: JavaScript practice playground

### MySQL
- `Structured Database Playground (MySQL).html`: practice structured databases and SQL

### API
- `API Fundamentals Playground.html`: APIs and web data (Python runs in the browser against a practice database)
- `starter/`: the real, runnable version for your own machine (FastAPI + MySQL, `.http` request files, resume and contact pages). See [API/starter/README.md](API/starter/README.md).

### python-zero-to-oop
- A browser-based Python course: 15 lessons from `print()` to classes, with 48 auto-checked practice problems. Python runs in the browser (Pyodide). Needs an internet connection. See [python-zero-to-oop/README.md](python-zero-to-oop/README.md).

## Usage

```bash
git clone <repo-url>
open "HTML-CSS/Flexbox Playground.html"
```

For the API starter (Python 3, MySQL):

```bash
cd API/starter
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your values
```

## Secrets

`.env` files are git-ignored. Only the `.env.example` templates are committed; never commit real credentials or API keys.
