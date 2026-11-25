"""Shared database helpers for the API (copy of scripts/db.py, plus Module 7's write support)."""
import os

import mysql.connector
from dotenv import load_dotenv

load_dotenv()  # searches upward from this file, so one .env serves the scripts and the API


def connect(write=False):
    """Reads use portfolio_web (views only). Only write endpoints call connect(write=True)."""
    prefix = "DB_WRITE_" if write else "DB_"
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv(prefix + "USER"),
        password=os.getenv(prefix + "PASSWORD"),
        database=os.getenv("DB_NAME", "future_portfolio_db"),
    )


def fetch_all(conn, sql, params=()):
    """Run a SELECT and return a list of dictionaries (one per row)."""
    with conn.cursor(dictionary=True) as cursor:
        cursor.execute(sql, params)
        return cursor.fetchall()


def execute(conn, sql, params=()):
    """Run an INSERT / UPDATE / DELETE. Returns (rows affected, new id)."""
    with conn.cursor() as cursor:
        cursor.execute(sql, params)
        return cursor.rowcount, cursor.lastrowid
