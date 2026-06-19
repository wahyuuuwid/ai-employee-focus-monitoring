# 🧠 AI Employee Focus Monitoring

![Version](https://img.shields.io/badge/versi-1.0.0-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-black)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Lisensi](https://img.shields.io/badge/lisensi-MIT-green)

> Sistem monitoring fokus karyawan real-time menggunakan AI & Computer Vision

<!-- ## 📊 Tampilan Dashboard
![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview) -->

## ✨ Fitur
- 🎯 Monitoring skor fokus secara real-time
- 📈 Visualisasi data historis
- 👁️ Analisis kontak mata & postur tubuh
- 📊 Statistik performa & tren karyawan

## 🛠️ Teknologi yang Digunakan
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Flask + Python
- **Database:** MySQL

## 🚀 Cara Menjalankan

### Prasyarat
- Python 3.9+
- Node.js 18+
- MySQL 8.0+ (running locally or remote)

### Instalasi

#### 1. Setup Database (MySQL)

```bash
# Copy .env template and fill with your database credentials
cd backend/instance
cp .env.example .env

# Edit .env and update:
# DB_HOST=localhost (or your MySQL host)
# DB_USER=root (or your MySQL user)
# DB_PASSWORD= (your password, leave empty if none)
# DB_NAME=ai_monitoring
# DB_PORT=3306

# Go back to backend and run initialization
cd ..
pip install -r instance/requirements.txt
python init_db.py

# If successful, you'll see:
# ✅ Database initialized successfully!
# 🔑 Test User Credentials:
#    Email: test@example.com
#    Password: test123
```

#### 2. Setup Backend

```bash
cd backend
pip install -r instance/requirements.txt
python app.py
# Backend should run on http://localhost:5000
```

#### 3. Setup Frontend (terminal baru)

```bash
cd frontend
npm install
npm run dev
# Frontend should run on http://localhost:5173
```

#### 4. Login

- Open http://localhost:5173 in browser
- Login dengan:
  - Email: `test@example.com`
  - Password: `test123`

# Akses Aplikasi
Frontend: http://localhost:5173
Backend API: http://localhost:5000