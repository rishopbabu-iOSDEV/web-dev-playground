"""Shared database helpers. Every script imports from this file (Module 5, slide 14)."""
import os
from datetime import date, datetime
from decimal import Decimal

import mysql.connector
from dotenv import load_dotenv

load_dotenv()  # reads .env into the environment


def connect():
    """Open a connection as the read-only user from Course 4 Module 9."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "future_portfolio_db"),
    )


def fetch_all(conn, sql, params=()):
    """Run a SELECT and return a list of dictionaries (one per row)."""
    with conn.cursor(dictionary=True) as cursor:
        cursor.execute(sql, params)
        return cursor.fetchall()


def to_json_value(value):
    """Tell json.dumps how to write the two types JSON cannot hold (slide 12)."""
    if isinstance(value, (date, datetime)):
        return value.isoformat()  # "2021-06-01"
    if isinstance(value, Decimal):
        return float(value)  # 40.0
    raise TypeError(type(value).__name__)
