from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

# =====================================
# INIT APP
# =====================================

app = Flask(__name__)
CORS(app)

# =====================================
# DATABASE CONFIG
# =====================================

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# =====================================
# DATABASE MODEL
# =====================================

class MonitoringLog(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    status = db.Column(
        db.String(50),
        nullable=False
    )

    focus_score = db.Column(
        db.Float,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

# =====================================
# CREATE DATABASE
# =====================================

with app.app_context():
    db.create_all()

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

@app.route('/monitoring', methods=['POST'])
def save_monitoring():

    try:

        data = request.get_json()

        status = data.get('status')
        focus_score = data.get('focus_score')

        # validasi sederhana
        if status is None or focus_score is None:

            return jsonify({
                "error": "Missing data"
            }), 400

        # simpan ke database
        new_log = MonitoringLog(
            status=status,
            focus_score=focus_score
        )

        db.session.add(new_log)
        db.session.commit()

        return jsonify({
            "message": "Monitoring saved successfully"
        }), 201

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =====================================
# GET HISTORY
# =====================================

@app.route('/history', methods=['GET'])
def get_history():

    try:

        logs = MonitoringLog.query.order_by(
            MonitoringLog.created_at.desc()
        ).all()

        result = []

        for log in logs:

            result.append({
                "id": log.id,
                "status": log.status,
                "focus_score": log.focus_score,
                "created_at": log.created_at.strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
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

    logs = MonitoringLog.query.all()

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
        if log.status == "FOCUS"
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
        sum(log.focus_score for log in logs) / total,
        2
    )

    return jsonify({
        "total_data": total,
        "focus_percentage": focus_percentage,
        "not_focus_percentage": not_focus_percentage,
        "average_focus_score": average_focus_score
    })


# =====================================
# RUN SERVER
# =====================================

if __name__ == '__main__':

    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )