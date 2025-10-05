#!/usr/bin/env python3
"""
Simple database initialization script for ExoPlanet AI
This script creates a basic SQLite database without complex dependencies
"""

import sqlite3
import os
import json
from datetime import datetime

def create_database():
    """Create and initialize the database"""
    db_path = 'exoplanet_ai.db'
    
    # Remove existing database
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"🗑️  Removed existing database: {db_path}")
    
    # Create new database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    print(f"📁 Created new database: {db_path}")
    
    # Create exoplanets table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS exoplanets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        host_star TEXT,
        discovery_method TEXT,
        discovery_year INTEGER,
        orbital_period REAL,
        transit_duration REAL,
        planetary_radius REAL,
        transit_depth REAL,
        stellar_magnitude REAL,
        equilibrium_temperature REAL,
        distance_ly REAL,
        disposition TEXT DEFAULT 'Confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    print("✅ Created exoplanets table")
    
    # Create predictions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS predictions (
        id TEXT PRIMARY KEY,
        input_data TEXT NOT NULL,
        classification TEXT NOT NULL,
        confidence REAL NOT NULL,
        probability_data TEXT,
        processing_time REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    print("✅ Created predictions table")
    
    # Create users table (for future authentication)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        full_name TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    print("✅ Created users table")
    
    # Insert sample exoplanet data
    sample_exoplanets = [
        ('Kepler-452b', 'Kepler-452', 'Transit', 2015, 384.84, 13.0, 1.63, 0.2, 13.4, 265, 1402, 'Confirmed'),
        ('TRAPPIST-1e', 'TRAPPIST-1', 'Transit', 2017, 6.1, 0.73, 0.92, 0.35, 18.8, 251, 39.5, 'Confirmed'),
        ('Proxima Centauri b', 'Proxima Centauri', 'Radial Velocity', 2016, 11.2, 1.5, 1.17, None, 11.1, 234, 4.24, 'Confirmed'),
        ('TOI-715 b', 'TOI-715', 'Transit', 2024, 19.3, 3.14, 1.55, 0.15, 16.0, 280, 137, 'Confirmed'),
        ('K2-18 b', 'K2-18', 'Transit', 2015, 33.0, 2.3, 2.3, 0.08, 13.2, 255, 124, 'Confirmed'),
        ('55 Cancri e', '55 Cancri A', 'Transit', 2004, 0.74, 0.74, 2.17, 0.05, 5.95, 2573, 41, 'Confirmed'),
        ('HD 209458 b', 'HD 209458', 'Transit', 1999, 3.52, 3.1, 1.38, 1.5, 7.65, 1449, 159, 'Confirmed'),
        ('WASP-121b', 'WASP-121', 'Transit', 2015, 1.27, 1.27, 1.81, 0.7, 10.4, 2358, 850, 'Confirmed'),
        ('Kepler-186f', 'Kepler-186', 'Transit', 2014, 129.9, 4.0, 1.11, 0.04, 14.8, 188, 582, 'Confirmed'),
        ('Gliese 581g', 'Gliese 581', 'Radial Velocity', 2010, 36.6, None, 1.5, None, 10.6, 228, 20.4, 'Candidate')
    ]
    
    cursor.executemany('''
    INSERT INTO exoplanets (
        name, host_star, discovery_method, discovery_year, orbital_period, 
        transit_duration, planetary_radius, transit_depth, stellar_magnitude, 
        equilibrium_temperature, distance_ly, disposition
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_exoplanets)
    
    print(f"✅ Inserted {len(sample_exoplanets)} sample exoplanets")
    
    # Insert sample predictions
    sample_predictions = [
        ('pred_001', '{"orbital_period": 365.25, "transit_duration": 4.2, "planetary_radius": 1.0}', 'Confirmed', 94.7, '{"confirmed": 0.947, "candidate": 0.041, "false_positive": 0.012}', 0.23),
        ('pred_002', '{"orbital_period": 88.0, "transit_duration": 2.1, "planetary_radius": 0.8}', 'Candidate', 76.3, '{"confirmed": 0.234, "candidate": 0.763, "false_positive": 0.003}', 0.18),
        ('pred_003', '{"orbital_period": 1.2, "transit_duration": 0.5, "planetary_radius": 2.1}', 'False Positive', 89.1, '{"confirmed": 0.045, "candidate": 0.064, "false_positive": 0.891}', 0.15)
    ]
    
    cursor.executemany('''
    INSERT INTO predictions (id, input_data, classification, confidence, probability_data, processing_time)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', sample_predictions)
    
    print(f"✅ Inserted {len(sample_predictions)} sample predictions")
    
    # Commit changes and close
    conn.commit()
    conn.close()
    
    print(f"\n🎉 Database initialization complete!")
    print(f"📊 Database file: {os.path.abspath(db_path)}")
    print(f"📈 Total exoplanets: {len(sample_exoplanets)}")
    print(f"🔮 Total predictions: {len(sample_predictions)}")

def verify_database():
    """Verify the database was created correctly"""
    db_path = 'exoplanet_ai.db'
    
    if not os.path.exists(db_path):
        print("❌ Database file not found!")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check exoplanets table
        cursor.execute("SELECT COUNT(*) FROM exoplanets")
        exoplanet_count = cursor.fetchone()[0]
        
        # Check predictions table
        cursor.execute("SELECT COUNT(*) FROM predictions")
        prediction_count = cursor.fetchone()[0]
        
        conn.close()
        
        print(f"\n🔍 Database verification:")
        print(f"   📊 Exoplanets: {exoplanet_count}")
        print(f"   🔮 Predictions: {prediction_count}")
        print(f"   ✅ Database is ready!")
        
        return True
        
    except Exception as e:
        print(f"❌ Database verification failed: {e}")
        return False

if __name__ == "__main__":
    print("🌌 ExoPlanet AI - Database Initialization")
    print("=" * 50)
    
    try:
        create_database()
        verify_database()
        
        print("\n🚀 Ready to start the server!")
        print("   Run: python run.py")
        print("   Then visit: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"❌ Initialization failed: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure you're in the backend directory")
        print("2. Ensure Python 3.8+ is installed")
        print("3. Try running: pip install sqlite3")