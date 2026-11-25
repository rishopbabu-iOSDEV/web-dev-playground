# Web Development Playground

A collection of hands-on learning playgrounds for web development, built alongside my SIU coursework. Each playground lets you experiment with a topic directly in the browser: change a value, see the result, and learn by doing.

Most playgrounds are standalone single-file HTML pages with no build step and no dependencies. Open the file in a browser and it works. The exceptions are the API starter (runs on your own machine) and the Python course (loads Pyodide from a CDN).

## Repository structure

```
web-dev-playground/
├── HTML-CSS/            Layout and markup playgrounds
├── JavaScript/          JavaScript practice playground
├── MySQL/               Database and SQL playground
├── API/                 API fundamentals playground + runnable starter project
└── python-zero-to-oop/  Browser-based Python course
```

## Contents

### HTML-CSS
| File | What it covers |
|---|---|
| `CSS Grid Playground.html` | Experiment with CSS Grid properties |
| `Flexbox Playground.html` | Experiment with Flexbox properties |
| `Flex vs Grid — Side-by-Side Playground.html` | Compare both layout models |
| `html-tags-attributes.html` | HTML tags and attributes reference |

### JavaScript
| File | What it covers |
|---|---|
| `Chai Corner JS Playground.html` | JavaScript practice playground |

### MySQL
| File | What it covers |
|---|---|
| `Structured Database Playground (MySQL).html` | Structured databases and SQL practice |

### API
| Item | What it covers |
|---|---|
| `API Fundamentals Playground.html` | APIs and web data. Python runs in the browser against a practice database |
| `starter/` | The real, runnable version for your own machine: FastAPI + MySQL, `.http` request files, and resume/contact pages. See [API/starter/README.md](API/starter/README.md) |

### python-zero-to-oop
A browser-based Python course: 15 lessons from `print()` to classes, with animations, a step-through viewer and 48 auto-checked practice problems. Python runs in the browser (Pyodide), so no server is needed, but an internet connection is. See [python-zero-to-oop/README.md](python-zero-to-oop/README.md).

## Getting started

```bash
git clone <repo-url>
cd web-dev-playground
open "HTML-CSS/Flexbox Playground.html"
```

To run the API starter (Python 3.12 or 3.13 and MySQL required; 3.15 is not supported by `mysql-connector-python`):

```bash
cd API/starter
python3.13 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in your values
cd api && fastapi dev main.py
```

## Secrets

`.env` files are git-ignored. Only the `.env.example` templates are committed. Never commit real credentials or API keys.
