from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import mysql.connector
import datetime
import time
import jwt
import bcrypt
from functools import wraps

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

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

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
# AUTHENTICATION DECORATOR
# =====================================

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"error": "Missing authorization token"}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]

            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            request.user_id = payload['user_id']
            request.user_email = payload['email']
            request.role = payload.get('role', 'user')
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"error": "Missing authorization token"}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]

            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            request.user_id = payload['user_id']
            request.user_email = payload['email']
            request.role = payload.get('role', 'user')

            if request.role != 'admin':
                return jsonify({"error": "Admin access required"}), 403

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

# =====================================
# HOME ROUTE
# =====================================

@app.route('/')
def home():
    return jsonify({
        "message": "Backend AI Monitoring Running"
    })

# =====================================
# LOGIN
# =====================================

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email dan password wajib diisi"}), 400

    try:
        mycursor.execute(
            "SELECT id, email, password, role FROM users WHERE email = %s",
            (email,)
        )
        user = mycursor.fetchone()

        if user is None:
            return jsonify({"error": "Invalid credentials"}), 401

        user_id = user[0]
        stored_pw = user[2]
        role = user[3]

        # Verify password with bcrypt
        if not bcrypt.checkpw(password.encode(), stored_pw.encode()):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT token
        payload = {
            'user_id': user_id,
            'email': email,
            'role': role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

        return jsonify({
            "message": "Login berhasil",
            "token": token,
            "user_id": user_id,
            "role": role
        }), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# LOGOUT
# =====================================

@app.route('/logout', methods=['POST'])
@require_auth
def logout():
    # JWT is stateless, so logout just clears client-side token
    return jsonify({
        "message": "Logout berhasil"
    }), 200

# =====================================
# POST MONITORING
# =====================================

# buffer for monitoring log
buffer = []
last_flush = time.time()
MAX_BUFFER = 60
MAX_INTERVAL = 20

@app.route('/monitoring', methods=['POST'])
@require_auth
def save_monitoring():
    global buffer, last_flush

    try:
        data = request.get_json()

        focus_score = data.get('focus_score')
        user_id = request.user_id  # Get from JWT token
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
        print(f"ERROR: {e}")
        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# GET HISTORY
# =====================================

@app.route('/history', methods=['GET'])
@require_auth
def get_history():
    # user session from JWT token
    user_id = request.user_id

    # buffer
    result = []

    try:
        mycursor.execute(
            "SELECT * FROM monitoring_logs WHERE user_id = %s ORDER BY created_at DESC",
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
        print(f"ERROR: {e}")
        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# GET STATISTICS
# =====================================

@app.route('/statistics', methods=['GET'])
@require_auth
def statistics():
    # user session from JWT token
    user_id = request.user_id

    try:
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
        print(f"ERROR: {e}")
        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# ADMIN ENDPOINTS
# =====================================

# GET all users
@app.route('/admin/users', methods=['GET'])
@require_admin
def get_all_users():
    try:
        mycursor.execute(
            "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
        )
        users = mycursor.fetchall()

        result = []
        for user in users:
            result.append({
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "role": user[3],
                "created_at": user[4].strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify(result), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500

# CREATE new user
@app.route('/admin/users', methods=['POST'])
@require_admin
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password', 'DefaultPassword123')
    role = data.get('role', 'user')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

        mycursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            (name, email, hashed_password.decode(), role)
        )
        conn.commit()

        user_id = mycursor.lastrowid

        return jsonify({
            "message": "User created successfully",
            "user_id": user_id,
            "email": email
        }), 201

    except mysql.connector.Error as err:
        if err.errno == 1062:  # Duplicate entry
            return jsonify({"error": "Email already exists"}), 400
        print(f"ERROR: {err}")
        return jsonify({"error": str(err)}), 500

# UPDATE user
@app.route('/admin/users/<int:user_id>', methods=['PUT'])
@require_admin
def update_user(user_id):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # Prevent admin from removing their own admin role
    if user_id == request.user_id and role and role != 'admin':
        return jsonify({"error": "Cannot remove your own admin role"}), 400

    try:
        if password:
            hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
            mycursor.execute(
                "UPDATE users SET name = %s, email = %s, password = %s, role = %s WHERE id = %s",
                (name, email, hashed_password.decode(), role, user_id)
            )
        else:
            mycursor.execute(
                "UPDATE users SET name = %s, email = %s, role = %s WHERE id = %s",
                (name, email, role, user_id)
            )
        conn.commit()

        return jsonify({"message": "User updated successfully"}), 200

    except mysql.connector.Error as err:
        if err.errno == 1062:  # Duplicate entry
            return jsonify({"error": "Email already exists"}), 400
        print(f"ERROR: {err}")
        return jsonify({"error": str(err)}), 500

# DELETE user
@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
@require_admin
def delete_user(user_id):
    # Prevent admin from deleting themselves
    if user_id == request.user_id:
        return jsonify({"error": "Cannot delete your own account"}), 400

    try:
        mycursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500

# GET analytics for all users
@app.route('/admin/analytics', methods=['GET'])
@require_admin
def get_analytics():
    try:
        # Total users (exclude admins)
        mycursor.execute("SELECT COUNT(*) FROM users WHERE role != 'admin'")
        total_users = mycursor.fetchone()[0]

        # Total monitoring sessions
        mycursor.execute("SELECT COUNT(*) FROM monitoring_logs")
        total_sessions = mycursor.fetchone()[0]

        # Average focus score
        mycursor.execute("SELECT AVG(focus_score) FROM monitoring_logs")
        avg_focus = mycursor.fetchone()[0] or 0

        # Focus vs Not Focus
        mycursor.execute(
            "SELECT status, COUNT(*) FROM monitoring_logs GROUP BY status"
        )
        status_counts = mycursor.fetchall()

        status_breakdown = {}
        for row in status_counts:
            status_breakdown[row[0]] = row[1]

        # Top performing users (by avg focus score)
        mycursor.execute("""
            SELECT users.id, users.name, AVG(monitoring_logs.focus_score) as avg_score, COUNT(*) as count
            FROM monitoring_logs
            JOIN users ON monitoring_logs.user_id = users.id
            GROUP BY monitoring_logs.user_id
            ORDER BY avg_score DESC
            LIMIT 10
        """)
        top_users = mycursor.fetchall()

        top_users_list = []
        for row in top_users:
            top_users_list.append({
                "user_id": row[0],
                "name": row[1],
                "avg_focus_score": round(row[2], 2),
                "session_count": row[3]
            })

        return jsonify({
            "total_users": total_users,
            "total_sessions": total_sessions,
            "average_focus_score": round(avg_focus, 2),
            "status_breakdown": status_breakdown,
            "top_users": top_users_list
        }), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500

# GET single user details with stats
@app.route('/admin/users/<int:user_id>/details', methods=['GET'])
@require_admin
def get_user_details(user_id):
    try:
        # Get user info
        mycursor.execute(
            "SELECT id, name, email, role, created_at FROM users WHERE id = %s",
            (user_id,)
        )
        user = mycursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get user stats
        mycursor.execute(
            "SELECT COUNT(*), AVG(focus_score) FROM monitoring_logs WHERE user_id = %s",
            (user_id,)
        )
        stats = mycursor.fetchone()

        total_sessions = stats[0] if stats[0] else 0
        avg_focus = stats[1] if stats[1] else 0

        return jsonify({
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "role": user[3],
            "created_at": user[4].strftime("%Y-%m-%d %H:%M:%S"),
            "total_sessions": total_sessions,
            "average_focus_score": round(avg_focus, 2)
        }), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500

# GET all monitoring logs (admin only)
@app.route('/admin/monitoring', methods=['GET'])
@require_admin
def get_all_monitoring():
    try:
        user_id = request.args.get('user_id')
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)

        if user_id:
            mycursor.execute(
                "SELECT * FROM monitoring_logs WHERE user_id = %s ORDER BY created_at DESC LIMIT %s OFFSET %s",
                (user_id, limit, offset)
            )
        else:
            mycursor.execute(
                "SELECT * FROM monitoring_logs ORDER BY created_at DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )

        logs = mycursor.fetchall()

        result = []
        for log in logs:
            result.append({
                "id": log[0],
                "user_id": log[1],
                "focus_score": log[2],
                "status": log[3],
                "alert_status": log[4],
                "created_at": log[5].strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify(result), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500

# =====================================
# RUN SERVER
# =====================================

if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )
