"""The owner's API key check (Module 8). One owner, one key, no logins."""
import os
import secrets

from fastapi import Header, HTTPException


def require_owner(x_api_key: str | None = Header(default=None)):
    """Allow the request only with the owner's API key.

    401 = no credentials (who are you?).  403 = credentials not accepted (you can't do this).
    """
    expected = os.getenv("OWNER_API_KEY")
    if not x_api_key:
        raise HTTPException(
            status_code=401,
            detail="This endpoint needs an API key in the X-API-Key header.",
        )
    # Fail closed: no key in .env means every request is refused (never open by accident).
    # compare_digest takes the same time whether the guess fails early or late.
    if not expected or not secrets.compare_digest(x_api_key, expected):
        raise HTTPException(status_code=403, detail="That API key is not accepted.")
