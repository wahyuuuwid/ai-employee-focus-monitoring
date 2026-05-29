from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import mysql.connector
import datetime
import time

# =====================================
# INIT APP
# =====================================

app = Flask(__name__)
CORS(app)

# =====================================
# DATABASE CONFIG
# =====================================

load_dotenv(os.path.join(os.path.dirname(__file__), "instance", ".env"))
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_pass = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")
db_port = int(os.getenv("DB_PORT"))

# =====================================
# DATABASE CONNECT
# =====================================

conn = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_pass,
    database=db_name,
    port=db_port
)

mycursor = conn.cursor()

# =====================================
# HOME ROUTE
# =====================================

@app.route('/')
def home():

    return jsonify({
        "message": "Backend AI Monitoring Running"
    })

# =====================================
# POST MONITORING
# =====================================

# buffer for monitoring log
buffer = []
last_flush = time.time()
MAX_BUFFER = 60
MAX_INTERVAL = 20

@app.route('/monitoring', methods=['POST'])
def save_monitoring():
    global buffer, last_flush
    
    try:

        data = request.get_json()

        focus_score = data.get('focus_score')
        user_id = 1
        status = data.get('status')
        # validasi sederhana
        if status is None or focus_score is None:

            return jsonify({
                "error": "Missing data"
            }), 400
        alert_status = 1 if focus_score < 60 else 0
        x = datetime.datetime.now()
        created_at = x.strftime("%Y-%m-%d %H:%M:%S")

        # insert buffer first
        buffer.append((
            focus_score,
            user_id,
            status,
            alert_status,
            created_at
        ))

        # simpan ke database
        now = time.time()
        if len(buffer) >= MAX_BUFFER or (now - last_flush) >= MAX_INTERVAL:
            sql = "INSERT INTO monitoring_logs (focus_score, user_id, status, alert_status, created_at) VALUES (%s, %s, %s, %s, %s)"

            mycursor.executemany(sql, buffer)
            conn.commit()
            buffer = []
            last_flush = now

        return jsonify({
            "message": "Monitoring saved successfully"
        }), 201

    except Exception as e:

        print(f"ERROR: {e}")  # print to terminal
        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# GET HISTORY
# =====================================

@app.route('/history', methods=['GET'])
def get_history():

    # user session right now
    user_id = 1

    # buffer
    result = []

    try:

        mycursor.execute(
            "SELECT * FROM monitoring_logs WHERE user_id = %s",
            (user_id,)
        )
        logs = mycursor.fetchall()

        for log in logs:
            result.append({
                "id": log[0],
                "focus_score": log[2],
                "status": log[3],
                "created_at": log[5].strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# GET STATISTICS
# =====================================

@app.route('/statistics', methods=['GET'])
def statistics():

    # user session right now
    user_id = 1

    mycursor.execute(
        "SELECT * FROM monitoring_logs WHERE user_id = %s",
        (user_id,)
    )
    logs = mycursor.fetchall()

    total = len(logs)

    if total == 0:
        return jsonify({
            "total_data": 0,
            "focus_percentage": 0,
            "not_focus_percentage": 0,
            "average_focus_score": 0
        })

    try:
        focus_count = len([
            log for log in logs
            if log[3] == "FOCUS"
        ])

        not_focus_count = total - focus_count

        focus_percentage = round(
            (focus_count / total) * 100,
            2
        )

        not_focus_percentage = round(
            (not_focus_count / total) * 100,
            2
        )

        average_focus_score = round(
            sum(log[2] for log in logs) / total,
            2
        )

        return jsonify({
            "total_data": total,
            "focus_percentage": focus_percentage,
            "not_focus_percentage": not_focus_percentage,
            "average_focus_score": average_focus_score
        })
    
    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# LOGIN
# =====================================

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try: 
        mycursor.execute(
            "SELECT id, email, password FROM users WHERE email = %s",
            (email,)
        )
        user = mycursor.fetchone()

        if user is None:
            return jsonify({"error": "Invalid credentials"}), 401

        stored_pw = user[2]
        if password == stored_pw:
            return jsonify({
                "message": "Login berhasil",
                "user_id": user[0]
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
        
    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# RUN SERVER
# =====================================

if __name__ == '__main__':

    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )