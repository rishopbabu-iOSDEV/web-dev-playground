"""One command regenerates data/resume.json from the database (Module 5 lab).

    python scripts/db_to_json.py

Module 6 imports build_resume() from this file, which is why main() only runs
when the file is run directly (see the last two lines).
"""
import json
from datetime import date
from pathlib import Path

from db import connect, fetch_all, to_json_value

OUTPUT = Path(__file__).resolve().parent.parent / "data" / "resume.json"


def build_resume(conn):
    """Return one dictionary with exactly the shape of the contract (version 2)."""
    projects = fetch_all(conn, "SELECT * FROM v_api_projects ORDER BY project_id")
    for project in projects:
        project["skills"] = json.loads(project["skills"])  # JSON text -> a real list
    return {
        "generated_at": date.today().isoformat(),
        "profile": fetch_all(conn, "SELECT * FROM v_api_profile")[0],
        "summary": fetch_all(conn, "SELECT * FROM v_api_summary")[0],
        "experience": fetch_all(conn, "SELECT * FROM v_api_experience ORDER BY start_date DESC"),
        "projects": projects,
        # The slide shortens these two ORDER BY clauses. These are the full versions:
        "skills": fetch_all(conn, "SELECT * FROM v_api_skills ORDER BY category, skill"),
        "education": fetch_all(conn, "SELECT * FROM v_api_education ORDER BY start_year DESC"),
        "awards": fetch_all(conn, "SELECT * FROM v_api_awards ORDER BY year DESC, id"),
    }


def main():
    with connect() as conn:
        resume = build_resume(conn)
    OUTPUT.parent.mkdir(exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as file:
        json.dump(resume, file, indent=2, ensure_ascii=False, default=to_json_value)
    for key in ("experience", "projects", "skills", "education", "awards"):
        print(f"{key:<12} {len(resume[key])}")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
