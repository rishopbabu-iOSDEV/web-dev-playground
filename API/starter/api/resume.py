"""build_resume(conn): the same function as scripts/db_to_json.py (Module 5), copied here for the API (Module 6, slide 17)."""
import json
from datetime import date

from db import fetch_all


def build_resume(conn):
    projects = fetch_all(conn, "SELECT * FROM v_api_projects ORDER BY project_id")
    for project in projects:
        project["skills"] = json.loads(project["skills"])
    return {
        "generated_at": date.today().isoformat(),
        "profile": fetch_all(conn, "SELECT * FROM v_api_profile")[0],
        "summary": fetch_all(conn, "SELECT * FROM v_api_summary")[0],
        "experience": fetch_all(conn, "SELECT * FROM v_api_experience ORDER BY start_date DESC"),
        "projects": projects,
        "skills": fetch_all(conn, "SELECT * FROM v_api_skills ORDER BY category, skill"),
        "education": fetch_all(conn, "SELECT * FROM v_api_education ORDER BY start_year DESC"),
        "awards": fetch_all(conn, "SELECT * FROM v_api_awards ORDER BY year DESC, id"),
    }
