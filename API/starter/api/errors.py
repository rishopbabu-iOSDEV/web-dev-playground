"""One error format for every kind of error (Module 8).

    {"error": {"status": 422, "code": "invalid_input", "message": "...", "fields": {...}}}

code is for programs (stable words), message is for people, fields only for validation.
"""
import logging

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("api")

CODES = {
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    405: "method_not_allowed",
    409: "conflict",
    422: "invalid_input",
    500: "server_error",
    502: "upstream_error",
}

# FastAPI's own routing errors carry these generic words; swap them for friendlier sentences.
DEFAULT_MESSAGES = {
    404: "Nothing here: check the URL.",
    405: "This URL doesn't support that method.",
}


def error_response(status, message, fields=None, headers=None):
    error = {"status": status, "code": CODES.get(status, "error"), "message": message}
    if fields:
        error["fields"] = fields
    return JSONResponse({"error": error}, status_code=status, headers=headers)


def http_error(request, exc):
    """Ours (404, 409, 401, 403...) and FastAPI's (unknown path, wrong method)."""
    if exc.detail in ("Not Found", "Method Not Allowed"):
        message = DEFAULT_MESSAGES[exc.status_code]
    else:
        message = str(exc.detail)
    return error_response(exc.status_code, message, headers=exc.headers)  # a 405 keeps its Allow header


def validation_error(request, exc):
    """Pydantic's list of problems becomes one field -> message object."""
    fields = {}
    for problem in exc.errors():
        # loc is a path: ["query", "category"] -> category, ["body", "email"] -> email
        name = ".".join(str(part) for part in problem["loc"][1:]) or str(problem["loc"][0])
        fields[name] = problem["msg"]
    return error_response(422, "Some fields are not valid.", fields)


def unexpected_error(request, exc):
    """The last line of defence: one calm sentence for the client, the full traceback for the developer."""
    logger.exception("Unexpected error on %s %s", request.method, request.url.path)
    return error_response(500, "Something went wrong on our side. Please try again later.")


def add_error_handlers(app: FastAPI):
    app.add_exception_handler(StarletteHTTPException, http_error)
    app.add_exception_handler(RequestValidationError, validation_error)
    app.add_exception_handler(Exception, unexpected_error)
