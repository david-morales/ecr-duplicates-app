from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
import json
from databricks import sql
from databricks.sdk.core import Config

flask_app = Flask(__name__)

# Ensure the environment variable is set
assert os.getenv('DATABRICKS_WAREHOUSE_ID'), "DATABRICKS_WAREHOUSE_ID must be set in app.yaml."

app = Flask(__name__)

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
# HELPER FUNCTIONS
# --------------------------------------

def fetch_occurrences():
    """Retrieve all occurrences from Databricks."""
    return execute_query("SELECT * FROM workspace.default.ecr_key_stats", fetch=True)


def fetch_excluded_records():
    """Retrieve full records of excluded occurrences using JOIN with ecr_key_stats."""
    query = """
    SELECT ks.*
    FROM workspace.default.ecr_key_stats ks
    INNER JOIN workspace.default.ecr_excluded_ids ex ON ks.E2_Occurrence_ID = ex.E2_Occurrence_ID
    """
    return execute_query(query, fetch=True)

def fetch_audit_logs():
    """Retrieve the latest audit logs."""
    return execute_query("SELECT * FROM workspace.default.audit ORDER BY time DESC", fetch=True)

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

    selected_ids_str = json.dumps(occurrences_ids)  # Convert list to JSON format

    audit_query = """
    INSERT INTO workspace.default.audit (user, time, action, selected_ids)
    VALUES (?, current_timestamp(), ?, ?)
    """
    execute_query(audit_query, (user_email, requested_action, selected_ids_str))


# --------------------------------------
# ROUTES
# --------------------------------------

@app.route('/')
def home():
    """Render the home page with occurrences data and audit logs."""
    user_email = request.headers.get("X-Forwarded-Email", "Guest")
    occurrences = fetch_occurrences()
    audit_logs = fetch_audit_logs()
    excluded = fetch_excluded_records()

    return render_template("index.html", 
                           user_email=user_email, 
                           data=occurrences.to_dict(orient="records"),
                           audit_data=audit_logs.to_dict(orient="records"),
                           excluded_records=excluded.to_dict(orient="records"),)


@app.route('/get_occurrences', methods=['GET'])
def get_occurrences():
    """Retrieve the ecr occurrences."""
    try:
        occurrences = fetch_occurrences()
        return jsonify(occurrences.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_audit_records', methods=['GET'])
def get_audit_records():
    """Retrieve the latest audit records."""
    try:
        audit_logs = fetch_audit_logs()
        return jsonify(audit_logs.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_excluded_ids', methods=['GET'])
def get_excluded_ids():
    """Retrieve the full records of excluded occurrences."""
    try:
        excluded_records = fetch_excluded_records()
        return jsonify(excluded_records.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/submit_occurrences', methods=['POST'])
def submit_occurrences():
    """Handle submission of selected occurrences."""
    try:
        req_data = request.get_json()
        occurrences_ids = req_data.get("occurrencesIDs", [])
        user_email = request.headers.get("X-Forwarded-Email", "unknown@example.com")

        if not occurrences_ids:
            return jsonify({"message": "No occurrences selected!"}), 400

        # Insert occurrences IDs using MERGE
        merge_occurrences(occurrences_ids)

        # Convert occurrences IDs list to a string format like "[1, 2, 3]"
        selected_ids_str = json.dumps(occurrences_ids)

         # Log action in audit table
        log_audit_action(user_email, "EXCLUDE", occurrences_ids)

        return jsonify({"message": f"✅ Successfully recorded {len(occurrences_ids)} occurrences and added audit record."})

    except Exception as e:
        return jsonify({"message": f"❌ Error: {str(e)}"}), 500


@app.route('/remove_excluded_ids', methods=['POST'])
def remove_excluded_ids():
    """Remove a set of IDs from ecr_excluded_ids and log the action."""
    try:

        req_data = request.get_json()
        occurrences_ids = req_data.get("occurrencesIDs", [])
        user_email = request.headers.get("X-Forwarded-Email", "unknown@example.com")


        if not occurrences_ids:
            return jsonify({"message": "No occurrences selected for removal!"}), 400


        # Remove occurrences IDs from excluded_ids
        remove_excluded_occurrences(occurrences_ids)


        # Log action in audit table
        log_audit_action(user_email, "INCLUDE", occurrences_ids)

        return jsonify({"message": f"✅ Successfully removed {len(occurrences_ids)} occurrences and added audit record."})

    except Exception as e:
        return jsonify({"message": f"❌ Error: {str(e)}"}), 500


# --------------------------------------
# RUN APP
# --------------------------------------

if __name__ == '__main__':
    flask_app.run(debug=True)
