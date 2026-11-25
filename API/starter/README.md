# Course 5 starter: Fundamentals of APIs and Web Data

Everything in the **API Fundamentals Playground** has a real, runnable version here. The playground runs Python in your browser against a practice database; this folder is the same code for your own laptop and a real MySQL.

## Setup

**Use Python 3.12 or 3.13.** Python 3.15 breaks `mysql-connector-python` (`AttributeError: module 'ssl' has no attribute 'PROTOCOL_TLSv1'`), so create the venv with an older interpreter, e.g. `python3.13 -m venv .venv`.

```
python3.13 -m venv .venv      # or python3.12; avoid 3.15
.venv\Scripts\activate        # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env        # macOS/Linux: cp .env.example .env   then fill in the values
```

`.env` is ignored by Git. **Never commit it.**

## Run

| Module | Command / file |
|---|---|
| 5 | `python exercise2.py` · `python scripts/query_awards.py` · `python scripts/db_to_json.py` |
| 6–8 | `cd api` then `fastapi dev main.py` → http://127.0.0.1:8000/docs (earlier stages: `api/stages/`) |
| 4, 7, 8 | Open `api/requests/*.http` with the REST Client extension (copy `.env.example` to `.env` there) |
| 9 | Open `resume.html` and `contact.html` with VS Code Live Server (port 5500) |

SQL for the course views, `contact_messages` and the withdraw procedure is in `sql/`; run the files in order in MySQL Workbench.

## Layout

```
scripts/   Module 5 Python (db.py, query_awards.py, db_to_json.py)
api/       FastAPI app: main.py (final), db.py, resume.py, models.py, db_errors.py,
           security.py, errors.py, github.py · stages/ · docs/ · requests/
sql/       11_api_views · 12_contact_messages · 13_withdraw_appointment
js/        config.js, api.js, resume.js, contact.js, github.js (Module 9)
data/      resume.json (the public snapshot; regenerate with scripts/db_to_json.py)
```

## Where the course slides defer to files

Some slides say "see the MD file". These pieces were written for this starter and may differ from your own copies: `sql/` files, the `.http` files, `ORDER BY` choices for skills and education, the Chai Corner example, and the test definitions (`api/docs/test-matrix.md`). Replace them with the course versions where they differ.
