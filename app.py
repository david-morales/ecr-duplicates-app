from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
import json
from databricks import sql
from databricks.sdk.core import Config
from functools import lru_cache
from time import time

flask_app = Flask(__name__)

# Ensure the environment variable is set
assert os.getenv('DATABRICKS_WAREHOUSE_ID'), "DATABRICKS_WAREHOUSE_ID must be set in app.yaml."

# Cache setup for audit logs and excluded records
cache = {
    "audit_logs": {"data": None, "timestamp": 0},
    "excluded_records": {"data": None, "timestamp": 0}
}
CACHE_TIMEOUT = 300  # 5 minutes


# --------------------------------------
# DATABASE CONNECTION FUNCTIONS
# --------------------------------------

def get_connection():
    """Establish connection to Databricks."""
    cfg = Config()
    return sql.connect(
        server_hostname=cfg.host,
        http_path=f"/sql/1.0/warehouses/{os.getenv('DATABRICKS_WAREHOUSE_ID')}",
        credentials_provider=lambda: cfg.authenticate
    )


def execute_query(query: str, values: tuple = (), fetch: bool = False):
    """Execute a SQL query. Fetch results if needed."""
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, values)
                return cursor.fetchall_arrow().to_pandas() if fetch else None
    except Exception as e:
        print(f"❌ Database Error: {e}")
        return None


# --------------------------------------
# CACHING FUNCTIONS
# --------------------------------------

def cache_is_valid(key):
    """Check if cache for a specific key is still valid."""
    return (time() - cache[key]["timestamp"]) < CACHE_TIMEOUT


def invalidate_cache(keys):
    """Invalidate cache for specific keys."""
    for key in keys:
        cache[key]["data"] = None
        cache[key]["timestamp"] = 0


@lru_cache(maxsize=1)
def fetch_occurrences():
    """Retrieve all occurrences from Databricks (cached indefinitely)."""
    return execute_query("SELECT * FROM workspace.default.ecr_key_stats", fetch=True)


def fetch_excluded_records():
    """Retrieve full records of excluded occurrences using JOIN with ecr_key_stats (cached with expiration)."""
    if cache_is_valid("excluded_records") and cache["excluded_records"]["data"] is not None:
        return cache["excluded_records"]["data"]

    query = """
    SELECT ks.*
    FROM workspace.default.ecr_key_stats ks
    INNER JOIN workspace.default.ecr_excluded_ids ex ON ks.E2_Occurrence_ID = ex.E2_Occurrence_ID
    """
    excluded_data = execute_query(query, fetch=True)
    cache["excluded_records"]["data"] = excluded_data
    cache["excluded_records"]["timestamp"] = time()
    return excluded_data


def fetch_audit_logs():
    """Retrieve the latest audit logs (cached with expiration)."""
    if cache_is_valid("audit_logs") and cache["audit_logs"]["data"] is not None:
        return cache["audit_logs"]["data"]

    audit_data = execute_query("SELECT * FROM workspace.default.audit ORDER BY time DESC", fetch=True)
    cache["audit_logs"]["data"] = audit_data
    cache["audit_logs"]["timestamp"] = time()
    return audit_data


# --------------------------------------
# HELPER FUNCTIONS
# --------------------------------------

def merge_occurrences(occurrences_ids):
    """Use MERGE to insert only new occurrences IDs in Databricks."""
    if not occurrences_ids:
        return

    ids_values = ", ".join([f"('{tid}')" for tid in occurrences_ids])

    merge_query = f"""
    MERGE INTO workspace.default.ecr_excluded_ids AS target
    USING (SELECT * FROM (VALUES {ids_values}) AS temp(E2_Occurrence_ID)) AS source
    ON target.E2_Occurrence_ID = source.E2_Occurrence_ID
    WHEN NOT MATCHED THEN
    INSERT (E2_Occurrence_ID) VALUES (source.E2_Occurrence_ID)
    """
    
    execute_query(merge_query)


def remove_excluded_occurrences(occurrences_ids):
    """Remove given occurrences IDs from ecr_excluded_ids."""
    if not occurrences_ids:
        return

    ids_values = ", ".join([f"'{tid}'" for tid in occurrences_ids])

    delete_query = f"""
    DELETE FROM workspace.default.ecr_excluded_ids
    WHERE E2_Occurrence_ID IN ({ids_values})
    """

    execute_query(delete_query)


def log_audit_action(user_email, requested_action, occurrences_ids):
    """Log user actions in the audit table."""
    if not occurrences_ids:
        return

    selected_ids_str = json.dumps(occurrences_ids)

    audit_query = """
    INSERT INTO workspace.default.audit (user, time, action, selected_ids)
    VALUES (?, current_timestamp(), ?, ?)
    """
    execute_query(audit_query, (user_email, requested_action, selected_ids_str))


# --------------------------------------
# ROUTES
# --------------------------------------

@flask_app.route('/')
def home():
    """Render the home page with occurrences data and audit logs."""
    user_email = request.headers.get("X-Forwarded-Email", "guest@guest.com")
    user_name = request.headers.get("X-Forwarded-User", "Guest")
    occurrences = fetch_occurrences()
    audit_logs = fetch_audit_logs()
    excluded = fetch_excluded_records()

    return render_template("index.html", 
                           user_email=user_email, 
                           user_name=user_name,
                           data=occurrences.to_dict(orient="records"),
                           audit_data=audit_logs.to_dict(orient="records"),
                           excluded_records=excluded.to_dict(orient="records"),)


@flask_app.route('/get_occurrences', methods=['GET'])
def get_occurrences():
    """Retrieve the ecr occurrences."""
    try:
        occurrences = fetch_occurrences()
        return jsonify({"data": occurrences.to_dict(orient="records")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flask_app.route('/get_audit_records', methods=['GET'])
def get_audit_records():
    """Retrieve the latest audit records."""
    try:
        audit_logs = fetch_audit_logs()
        return jsonify({"data": audit_logs.to_dict(orient="records")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flask_app.route('/get_excluded_ids', methods=['GET'])
def get_excluded_ids():
    """Retrieve the full records of excluded occurrences."""
    try:
        excluded_records = fetch_excluded_records()
        return jsonify({"data": excluded_records.to_dict(orient="records")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flask_app.route('/submit_occurrences', methods=['POST'])
def submit_occurrences():
    """Handle submission of selected occurrences."""
    try:
        req_data = request.get_json()
        occurrences_ids = req_data.get("occurrencesIDs", [])
        user_email = request.headers.get("X-Forwarded-Email", "unknown@example.com")

        if not occurrences_ids:
            return jsonify({"message": "No occurrences selected!"}), 400

        merge_occurrences(occurrences_ids)
        log_audit_action(user_email, "EXCLUDE", occurrences_ids)

        # Invalidate audit and excluded records cache
        invalidate_cache(["audit_logs", "excluded_records"])

        return jsonify({"message": f"✅ Successfully recorded {len(occurrences_ids)} occurrences and added audit record."})

    except Exception as e:
        return jsonify({"message": f"❌ Error: {str(e)}"}), 500


@flask_app.route('/remove_excluded_ids', methods=['POST'])
def remove_excluded_ids():
    """Remove a set of IDs from ecr_excluded_ids and log the action."""
    try:
        req_data = request.get_json()
        occurrences_ids = req_data.get("occurrencesIDs", [])
        user_email = request.headers.get("X-Forwarded-Email", "unknown@example.com")

        if not occurrences_ids:
            return jsonify({"message": "No occurrences selected for removal!"}), 400

        remove_excluded_occurrences(occurrences_ids)
        log_audit_action(user_email, "INCLUDE", occurrences_ids)

        # Invalidate audit and excluded records cache
        invalidate_cache(["audit_logs", "excluded_records"])

        return jsonify({"message": f"✅ Successfully removed {len(occurrences_ids)} occurrences and added audit record."})

    except Exception as e:
        return jsonify({"message": f"❌ Error: {str(e)}"}), 500


# --------------------------------------
# RUN APP
# --------------------------------------

if __name__ == '__main__':
    flask_app.run(debug=True)
