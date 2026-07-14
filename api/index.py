import sys
import os

# Append backend directory to sys.path to resolve internal app imports
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_path)

from app.main import app
