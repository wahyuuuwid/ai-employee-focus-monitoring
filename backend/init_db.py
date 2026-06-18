#!/usr/bin/env python3
"""
Database initialization script
Creates tables and seeds test user with hashed password
"""

import mysql.connector
from mysql.connector import errorcode
import bcrypt
import os
from dotenv import load_dotenv
import sys

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "instance", ".env")
if not os.path.exists(env_path):
    print("❌ Error: .env file not found!")
    print(f"📋 Please copy .env.example to .env and fill in your database credentials")
    print(f"   Expected location: {env_path}")
    sys.exit(1)

load_dotenv(env_path)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "ai_monitoring")
DB_PORT = int(os.getenv("DB_PORT", 3306))

print("🔧 Initializing database...")
print(f"📍 Connecting to {DB_HOST}:{DB_PORT}")

try:
    # Connect to MySQL server (without database)
    cnx = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )

    cursor = cnx.cursor()

    # Read schema file
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    with open(schema_path, 'r') as f:
        schema_content = f.read()

    # Execute schema
    for statement in schema_content.split(';'):
        statement = statement.strip()
        if statement:
            print(f"📝 Executing: {statement[:50]}...")
            cursor.execute(statement)

    # Hash passwords for test users
    test_password = "test123"
    admin_password = "admin123"

    test_hashed = bcrypt.hashpw(test_password.encode(), bcrypt.gensalt())
    admin_hashed = bcrypt.hashpw(admin_password.encode(), bcrypt.gensalt())

    # Update test users with hashed passwords
    update_query = f"UPDATE {DB_NAME}.users SET password = %s WHERE email = %s"
    cursor.execute(update_query, (test_hashed.decode(), 'test@example.com'))
    cursor.execute(update_query, (admin_hashed.decode(), 'admin@example.com'))

    cnx.commit()
    cursor.close()
    cnx.close()

    print("✅ Database initialized successfully!")
    print()
    print("🔑 Test User Credentials:")
    print("   Email: test@example.com")
    print("   Password: test123")
    print()
    print("🔑 Admin User Credentials:")
    print("   Email: admin@example.com")
    print("   Password: admin123")
    print()
    print("🚀 You can now start the backend with: python app.py")

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print(f"❌ Error: Invalid username or password for {DB_USER}@{DB_HOST}")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print(f"❌ Error: Database {DB_NAME} doesn't exist")
    else:
        print(f"❌ Error: {err}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
