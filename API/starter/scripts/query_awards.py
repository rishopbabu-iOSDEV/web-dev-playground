"""Exercise 3: print the awards in one category, newest first.

    python scripts/query_awards.py              (Industry by default)
    python scripts/query_awards.py Company
    python scripts/query_awards.py "x' OR '1'='1"   (the attack: must print 0 awards)
"""
import sys

from db import connect, fetch_all

category = sys.argv[1] if len(sys.argv) > 1 else "Industry"

with connect() as conn:
    rows = fetch_all(
        conn,
        "SELECT * FROM v_api_awards WHERE category = %s ORDER BY year DESC, id",
        (category,),  # the comma makes this a tuple
    )

for row in rows:
    print(f"{row['year']}  {row['award']}  ({row['category']})")
print(f"{len(rows)} awards")
