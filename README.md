# ecr-duplicates-app

Databricks Occurrence Management App

A web application built with Flask, Bootstrap Table, and Databricks, allowing users to manage occurrences, exclude records, and track changes via an audit log.

1.  Setup & Installation
    


Step 1: Create a Virtual Environment

On macOS/Linux:python3 -m venv venvsource venv/bin/activate

On Windows:python -m venv venvvenv\\Scripts\\activate

Step 2: Install Dependenciespip install -r requirements.txt

------

1.  Running the App
    

The application supports two modes:

*   Databricks Mode → Fetches data directly from Databricks SQL
    
*   Local Mode → Loads data from local JSON files for development
    

Run in Databricks Mode:

flask --app app.py run

Loads data from Databricks SQL.

Run in Local Mode (Development):flask --app app_local.py run

Loads data from local JSON files.

1.  API Endpoints
    

Endpoints:

*   / (GET) - Loads the web UI
    
*   /get_occurrences (GET) - Fetch occurrences (from Databricks or local JSON)
    
*   /get_audit_records (GET) - Fetch audit logs
    
*   /get_excluded_ids (GET) - Fetch excluded records
    
*   /submit_transactions (POST) - Add records to excluded list & log audit
    
*   /remove_excluded_ids (POST) - Remove records from excluded list & log audit
    
