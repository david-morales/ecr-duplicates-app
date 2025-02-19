from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
import json


flask_app = Flask(__name__)

app = Flask(__name__)


# --------------------------------------
# LOCAL JSON FILES FOR DEV
# --------------------------------------

def gather_local_json_file(json_file_name):
    """Fetch transactions from JSON (dev mode) or Databricks (prod mode)."""
    json_path = os.path.join(app.root_path, 'templates', json_file_name)
    try:
        with open(json_path, 'r') as json_file:
            return json.load(json_file)
    except Exception as e:
        return {"error": str(e)}
    

# --------------------------------------
# HELPER FUNCTIONS
# --------------------------------------

def fetch_occurrences():
    return gather_local_json_file("occurrences.json")


def fetch_excluded_records():
    return gather_local_json_file("excluded_occurrences.json")

def fetch_audit_logs():
    return gather_local_json_file("audit_logs.json")

def merge_occurrences(occurrences_ids):
    return


def remove_excluded_occurrences(occurrences_ids):
    return

def log_audit_action(user_email, requested_action, occurrences_ids):
    return


# --------------------------------------
# ROUTES
# --------------------------------------

@app.route('/')
def home():
    """Render the home page with occurrences data and audit logs."""
    user_email = request.headers.get("X-Forwarded-Email", "Guest")

    return render_template("index_local.html", 
                           user_email=user_email)


@app.route('/get_occurrences', methods=['GET'])
def get_occurrences():
    """Retrieve the ecr occurrences."""
    return fetch_occurrences()        

@app.route('/get_audit_records', methods=['GET'])
def get_audit_records():
    """Retrieve the latest audit records."""
    return fetch_audit_logs()
        
@app.route('/get_excluded_ids', methods=['GET'])
def get_excluded_ids():
    """Retrieve the full records of excluded occurrences."""
    return fetch_excluded_records()       

@app.route('/submit_occurrences', methods=['POST'])
def submit_occurrences():
    return jsonify({"message": f"✅ Successfully recorded the occurrences and added audit record."})



@app.route('/remove_excluded_ids', methods=['POST'])
def remove_excluded_ids():
    return jsonify({"message": f"✅ Successfully removed the occurrences and added audit record."})



# --------------------------------------
# RUN APP
# --------------------------------------

if __name__ == '__main__':
    flask_app.run(debug=True)
