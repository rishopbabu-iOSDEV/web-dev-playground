"""Module 7: the API learns to write. Run from the api/ folder:  fastapi dev main.py"""
import json
from typing import Literal

import mysql.connector
from fastapi import FastAPI, HTTPException, Query, Response

from db import connect, execute, fetch_all
from db_errors import raise_for_db_error
from models import AppointmentIn, MessageIn, MessageOut, MessagePatch, ProjectPatch
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
def list_from_view(response, view, where, params, order, page, limit, write=False):
    where_sql = f" WHERE {' AND '.join(where)}" if where else ""
    with connect(write=write) as conn:  # write=True only for the owner-only message view
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


# =====================================================================
# Module 7: writing data
# =====================================================================

# ---------- messages: POST is public, the rest become owner-only in Module 8 ----------
@app.post("/api/messages", status_code=201, tags=["Messages"])
def create_message(body: MessageIn, response: Response):
    """Send a message from the contact form."""
    with connect(write=True) as conn:
        _, new_id = execute(
            conn,
            "INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s)",
            (body.name, body.email, body.message),
        )
        conn.commit()  # autocommit is OFF in the Python connector: no commit, no row
        sent_at = fetch_all(
            conn, "SELECT sent_at FROM v_owner_messages WHERE id = %s", (new_id,)
        )[0]["sent_at"]
    response.headers["Location"] = f"/api/messages/{new_id}"
    return {"id": new_id, "sent_at": sent_at}  # never echo the visitor's email back


@app.get("/api/messages", response_model=list[MessageOut], tags=["Messages"])
def list_messages(
    response: Response,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=50),
):
    """Owner only (Module 8): newest first."""
    return list_from_view(response, "v_owner_messages", [], [], "sent_at DESC, id DESC", page, limit, write=True)


@app.patch("/api/messages/{message_id}", response_model=MessageOut, tags=["Messages"])
def mark_message(message_id: int, body: MessagePatch):
    """Mark a message read or unread."""
    with connect(write=True) as conn:
        execute(
            conn,
            "UPDATE contact_messages SET is_read = %s WHERE message_id = %s",
            (body.is_read, message_id),
        )
        conn.commit()
        # Look it up instead of trusting rowcount: UPDATE counts rows CHANGED, not rows FOUND.
        rows = fetch_all(conn, "SELECT * FROM v_owner_messages WHERE id = %s", (message_id,))
    if not rows:
        raise HTTPException(status_code=404, detail=f"No message with id {message_id}.")
    return rows[0]


@app.delete("/api/messages/{message_id}", status_code=204, tags=["Messages"])
def delete_message(message_id: int):
    """Delete a message."""
    with connect(write=True) as conn:
        deleted, _ = execute(conn, "DELETE FROM contact_messages WHERE message_id = %s", (message_id,))
        conn.commit()
    if deleted == 0:
        raise HTTPException(status_code=404, detail=f"No message with id {message_id}.")
    return Response(status_code=204)


# ---------- PATCH a project: only the fields that were sent ----------
@app.patch("/api/projects/{project_id}", tags=["Projects"])
def update_project(project_id: int, body: ProjectPatch):
    """Change a project's name and/or description."""
    changes = body.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=422, detail="Send at least one field to change.")
    # Column names come only from the model's own two fields (extra="forbid"): structure from code.
    set_sql = ", ".join(f"{column} = %s" for column in changes)
    with connect(write=True) as conn:
        if not fetch_all(conn, "SELECT project_id FROM projects WHERE project_id = %s", (project_id,)):
            raise HTTPException(status_code=404, detail=f"No project with id {project_id}.")
        try:
            execute(conn, f"UPDATE projects SET {set_sql} WHERE project_id = %s", [*changes.values(), project_id])
            conn.commit()
        except mysql.connector.Error as error:
            conn.rollback()
            raise_for_db_error(error)
        return fetch_all(
            conn,
            "SELECT project_id, project_name, description FROM projects WHERE project_id = %s",
            (project_id,),
        )[0]


# ---------- one request, one transaction ----------
@app.post("/api/appointments", status_code=201, tags=["Appointments"])
def create_appointment(body: AppointmentIn):
    """A board appointment: company, period, role, project and skills, all or nothing."""
    with connect(write=True) as conn:
        try:
            conn.start_transaction()
            _, company_id = execute(conn, "INSERT INTO companies (company_name) VALUES (%s)", (body.company_name,))
            _, employment_id = execute(
                conn,
                "INSERT INTO employment (company_id, start_date, end_date) VALUES (%s, %s, %s)",
                (company_id, body.start_date, body.end_date),
            )
            _, role_id = execute(
                conn,
                "INSERT INTO roles (employment_id, role_title, role_start, role_end) VALUES (%s, %s, %s, %s)",
                (employment_id, body.role_title, body.start_date, body.end_date),
            )
            _, project_id = execute(conn, "INSERT INTO projects (project_name) VALUES (%s)", (body.project_name,))
            execute(conn, "INSERT INTO role_projects (role_id, project_id) VALUES (%s, %s)", (role_id, project_id))
            for skill_id in body.skill_ids:
                execute(conn, "INSERT INTO project_skills (project_id, skill_id) VALUES (%s, %s)", (project_id, skill_id))
            if body.headline is not None:
                execute(conn, "UPDATE people SET headline = %s WHERE person_id = 1", (body.headline,))
            conn.commit()  # once, at the end
        except mysql.connector.Error as error:
            conn.rollback()  # every time: MySQL does not undo the earlier statements by itself
            raise_for_db_error(error)
    return {
        "company_id": company_id,
        "employment_id": employment_id,
        "role_id": role_id,
        "project_id": project_id,
    }
