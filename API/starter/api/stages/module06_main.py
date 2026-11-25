"""Module 6: the read-only API. Run from the api/ folder:  fastapi dev main.py"""
import json
from typing import Literal

from fastapi import FastAPI, HTTPException, Query, Response

from db import connect, fetch_all
from resume import build_resume

app = FastAPI(title="Future Portfolio API", version="2.0")

Category = Literal["Company", "Industry", "Community"]


# ---------- practice endpoints (delete /api/echo before you commit) ----------
@app.get("/api/hello", tags=["Practice"])
def hello():
    return {"message": "Hello from the Future Portfolio API"}


@app.get("/api/echo/{item_id}", tags=["Practice"])
def echo(item_id: int, q: str | None = None, limit: int = 10):
    return {"item_id": item_id, "q": q, "limit": limit}


# ---------- the one helper every list uses (slide 12) ----------
def list_from_view(response, view, where, params, order, page, limit):
    where_sql = f" WHERE {' AND '.join(where)}" if where else ""
    with connect() as conn:
        total = fetch_all(
            conn,
            f"SELECT COUNT(*) AS total FROM {view}{where_sql}",
            params,
        )[0]["total"]
        rows = fetch_all(
            conn,
            f"SELECT * FROM {view}{where_sql} "
            f"ORDER BY {order} LIMIT %s OFFSET %s",
            [*params, limit, (page - 1) * limit],
        )
    response.headers["X-Total-Count"] = str(total)
    return rows


# ---------- awards ----------
@app.get("/api/awards", tags=["Awards"])
def list_awards(
    response: Response,
    category: Category | None = None,
    year_from: int | None = Query(None, ge=1980, le=2100),
    year_to: int | None = Query(None, ge=1980, le=2100),
    sort: Literal["year", "-year"] = "-year",
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=50),
):
    """Awards, filtered, sorted and paged."""
    where, params = [], []
    if category is not None:
        where.append("category = %s")
        params.append(category)
    if year_from is not None:
        where.append("year >= %s")
        params.append(year_from)
    if year_to is not None:
        where.append("year <= %s")
        params.append(year_to)
    order = {"year": "year, id", "-year": "year DESC, id"}[sort]
    return list_from_view(response, "v_api_awards", where, params, order, page, limit)


@app.get("/api/awards/{award_id}", tags=["Awards"])
def get_award(award_id: int):
    """One award by its id."""
    with connect() as conn:
        rows = fetch_all(conn, "SELECT * FROM v_api_awards WHERE id = %s", (award_id,))
    if not rows:
        raise HTTPException(status_code=404, detail=f"No award with id {award_id}.")
    return rows[0]


# ---------- education ----------
@app.get("/api/education", tags=["Education"])
def list_education(
    response: Response,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=50),
):
    """All education entries, newest first."""
    return list_from_view(response, "v_api_education", [], [], "start_year DESC, id", page, limit)


@app.get("/api/education/{education_id}", tags=["Education"])
def get_education(education_id: int):
    """One education entry."""
    with connect() as conn:
        rows = fetch_all(conn, "SELECT * FROM v_api_education WHERE id = %s", (education_id,))
    if not rows:
        raise HTTPException(status_code=404, detail=f"No education entry with id {education_id}.")
    return rows[0]


# ---------- single objects ----------
@app.get("/api/profile", tags=["Resume"])
def get_profile():
    """The public profile (no email)."""
    with connect() as conn:
        return fetch_all(conn, "SELECT * FROM v_api_profile")[0]


@app.get("/api/summary", tags=["Resume"])
def get_summary():
    """Headline numbers."""
    with connect() as conn:
        return fetch_all(conn, "SELECT * FROM v_api_summary")[0]


@app.get("/api/resume", tags=["Resume"])
def get_resume():
    """The whole resume.json document, built from the views on every request."""
    with connect() as conn:
        return build_resume(conn)


# ---------- experience, projects, skills ----------
@app.get("/api/experience", tags=["Experience"])
def list_experience(
    response: Response,
    company: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=50),
):
    """Roles, newest first. ?company=CloudHarbor Software gives 4."""
    where, params = [], []
    if company is not None:
        where.append("company = %s")
        params.append(company)
    return list_from_view(response, "v_api_experience", where, params, "start_date DESC, id", page, limit)


@app.get("/api/projects", tags=["Projects"])
def list_projects(
    response: Response,
    skill: str | None = None,
    company: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=50),
):
    """Projects. ?skill=Platform migration gives 8 rows."""
    where, params = [], []
    if skill is not None:
        where.append("JSON_CONTAINS(skills, JSON_QUOTE(%s))")
        params.append(skill)
    if company is not None:
        where.append("company = %s")
        params.append(company)
    rows = list_from_view(response, "v_api_projects", where, params, "project_id, role", page, limit)
    for row in rows:
        row["skills"] = json.loads(row["skills"])  # without this, skills is a string: a contract break
    return rows


@app.get("/api/skills", tags=["Skills"])
def list_skills(
    response: Response,
    evidenced: bool | None = None,
    category: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=50),
):
    """Skills. evidenced=true means used in at least one project; false gives 2 (skills 2 and 17)."""
    where, params = [], []
    if evidenced is not None:
        where.append("project_count > 0" if evidenced else "project_count = 0")
    if category is not None:
        where.append("category = %s")
        params.append(category)
    return list_from_view(response, "v_api_skills", where, params, "category, skill", page, limit)
