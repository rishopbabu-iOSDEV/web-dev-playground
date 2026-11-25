"""GET /api/github: a proxy that keeps the GitHub token on the server (Module 8).

The slide compresses some lines with semicolons and ellipses; this is the full version. The token appears in
exactly ONE place: a request header sent to GitHub. It is never in a response body.
"""
import logging
import os
import time

import httpx
from fastapi import APIRouter, HTTPException, Response

logger = logging.getLogger("api")
router = APIRouter()

CACHE = {"data": None, "fetched_at": 0.0}  # shared by every visitor; empties when the server restarts
MAX_AGE = 10 * 60


def github_get(path, params=None):
    response = httpx.get(
        f"https://api.github.com{path}",
        params=params,
        headers={
            "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}",
            "Accept": "application/vnd.github+json",
        },
        timeout=5.0,
    )
    response.raise_for_status()
    return response.json()


@router.get("/api/github", tags=["GitHub"])
def github_summary(response: Response):
    """A trimmed GitHub summary (six repos), cached for 10 minutes."""
    if CACHE["data"] and time.time() - CACHE["fetched_at"] < MAX_AGE:
        response.headers["X-Cache"] = "HIT"
        return CACHE["data"]
    user = os.getenv("GITHUB_USER")
    try:
        profile = github_get(f"/users/{user}")
        repos = github_get(f"/users/{user}/repos", {"sort": "pushed", "per_page": 6})
    except httpx.HTTPError as error:
        logger.warning("GitHub request failed: %s", error)
        if CACHE["data"]:  # stale cache beats an error page
            response.headers["X-Cache"] = "STALE"
            return CACHE["data"]
        raise HTTPException(
            status_code=502,
            detail="GitHub can't be reached right now. Please try again later.",
        )
    data = {  # 30+ fields come in; only these go out. Nothing is published that you did not choose.
        "login": profile["login"],
        "name": profile["name"],
        "public_repos": profile["public_repos"],
        "url": profile["html_url"],
        "repos": [
            {"name": r["name"], "html_url": r["html_url"], "pushed_at": r["pushed_at"]}
            for r in repos[:6]
        ],
    }
    CACHE.update(data=data, fetched_at=time.time())
    response.headers["X-Cache"] = "MISS"
    return data
