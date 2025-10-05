#!/bin/bash
# Render startup script for FastAPI with Uvicorn

echo "Starting ExoPlanet AI Backend..."
echo "Python version: $(python --version)"
echo "Uvicorn version: $(uvicorn --version)"

# Run uvicorn with the correct module path
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000} --workers 1
