"""Turn MySQL errors into HTTP errors written for the client (Module 7, slide 16).

Never send MySQL's own text to a client: it names tables and constraints.
"""
from fastapi import HTTPException

# MySQL error number -> (HTTP status, message for the client)
KNOWN = {
    1062: (409, "That already exists."),                                  # UNIQUE (Course 4 Module 3)
    1048: (422, "A required value is missing."),                          # NOT NULL
    1452: (422, "That refers to something that does not exist."),         # FOREIGN KEY (Course 4 Module 2)
    3819: (422, "Those values break a rule, for example an end date before the start."),  # CHECK
}


def raise_for_db_error(error):
    """Always raises. Anything not in KNOWN is the server's problem: 500."""
    status, message = KNOWN.get(error.errno, (500, "The server could not complete that."))
    if status == 500:
        raise error  # lets the server log the real error; the client sees only a generic 500
    raise HTTPException(status_code=status, detail=message)
