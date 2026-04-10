
from __future__ import annotations
from flask import send_from_directory

import os
import sqlite3
import time
from typing import Dict, List

from flask import Flask, jsonify, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "contacts.db")

RATE_LIMIT_MAX = int(os.getenv("RATE_LIMIT_MAX", "5"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "600"))
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",") if origin.strip()]

RATE_BUCKET: Dict[str, List[float]] = {}

app = Flask(__name__)

@app.route("/")
def serve_index():
    return send_from_directory(os.path.abspath(os.path.join(BASE_DIR, "..")), "index.html")

@app.route("/<path:filename>")
def serve_static_files(filename):
    print("serve_static_files called with:", repr(filename))
    allowed = [
        "about.html",
        "contact.html",
        "footer.html",
        "navbar.html",
        "projects.html",
        "quality.html",
        "services.html",
        "components.js",
        "script.js",
        "styles.css",
        "favicon.ico",
    ]

    root_dir = os.path.abspath(os.path.join(BASE_DIR, ".."))

    # Serve images from the images/ folder
    if filename.startswith("images/"):
        return send_from_directory(root_dir, filename)

    # Serve whitelisted top-level static files (HTML, CSS, JS, favicon)
    if filename in allowed:
        return send_from_directory(root_dir, filename)
    return ("Not Found", 404)


def init_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS contacts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              company TEXT,
              email TEXT NOT NULL,
              phone TEXT,
              message TEXT NOT NULL,
              ip TEXT,
              user_agent TEXT,
              created_at INTEGER NOT NULL
            )
            """
        )


def get_client_ip() -> str:
    forwarded = request.headers.get("X-Forwarded-For", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.remote_addr or "unknown"


def allow_request(ip: str) -> bool:
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    timestamps = RATE_BUCKET.get(ip, [])
    timestamps = [ts for ts in timestamps if ts >= window_start]

    if len(timestamps) >= RATE_LIMIT_MAX:
        RATE_BUCKET[ip] = timestamps
        return False

    timestamps.append(now)
    RATE_BUCKET[ip] = timestamps
    return True


def cors_origin_allowed(origin: str | None) -> str | None:
    if not origin:
        return None
    if "*" in ALLOWED_ORIGINS:
        return "*"
    if origin in ALLOWED_ORIGINS:
        return origin
    return None


@app.after_request
def apply_cors_headers(response):
    origin = request.headers.get("Origin")
    allowed = cors_origin_allowed(origin)
    if allowed:
        response.headers["Access-Control-Allow-Origin"] = allowed
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS, GET"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})


@app.route("/api/contact", methods=["POST", "OPTIONS"])
def contact():
    if request.method == "OPTIONS":
        return ("", 204)

    ip = get_client_ip()
    if not allow_request(ip):
        return jsonify({"ok": False, "message": "Rate limit exceeded"}), 429

    payload = request.get_json(silent=True) or {}

    # Honeypot field to reduce bots.
    if payload.get("website"):
        return jsonify({"ok": True}), 200

    name = (payload.get("name") or "").strip()
    company = (payload.get("company") or "").strip()
    email = (payload.get("email") or "").strip()
    phone = (payload.get("phone") or "").strip()
    message = (payload.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"ok": False, "message": "Missing required fields"}), 400

    if len(name) > 120 or len(company) > 120 or len(email) > 160 or len(phone) > 60 or len(message) > 2000:
        return jsonify({"ok": False, "message": "Field too long"}), 400

    user_agent = request.headers.get("User-Agent", "")
    created_at = int(time.time())

    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            INSERT INTO contacts (name, company, email, phone, message, ip, user_agent, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (name, company, email, phone, message, ip, user_agent, created_at),
        )

    return jsonify({"ok": True})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
