# LUMEN AI Backend - DevOps Setup & Execution Workflow

This guide provides complete, production-grade instructions for setting up, configuring, running, and testing the **LUMEN AI** backend system locally or in Docker.

---

## 1. Project Structure Analysis

The backend uses a standard modular FastAPI package layout:

```
backend/
├── app/
│   ├── main.py                    # Entry point & app initialisation
│   ├── core/
│   │   ├── config.py              # Configuration schemas & settings
│   │   └── security.py            # Password cryptography & JWT
│   ├── database/
│   │   ├── base.py                # SQLAlchemy Base model definition
│   │   └── connection.py          # Connection session & engine factories
│   ├── models/                    # Database tables definition mapping
│   ├── schemas/                   # Pydantic validation schemas
│   ├── api/
│   │   ├── deps.py                # Route dependency injection
│   │   └── routes/                # Endpoint routers mapping
│   ├── ai_engine/
│   │   ├── gemini_service.py      # Main Gemini service interface coordinator
│   │   ├── prompt_builder.py      # LLM prompts compiler
│   │   ├── safety_filter.py       # Input/Output validation & vocabulary check
│   │   └── response_parser.py     # Clean JSON extractor
```

- **Main Application File:** [backend/app/main.py](file:///e:/LUMEN-AI/backend/app/main.py)
- **Correct Uvicorn Command:** `uvicorn app.main:app --reload` (executed from the `backend/` root directory).
- **Required Startup Sequence:**
  1. Configure environment variables (`.env`).
  2. Start database (local PostgreSQL, Docker PG container, or local SQLite).
  3. Start the FastAPI Uvicorn server (automatically runs table creation schema).
  4. Start the frontend React dev server.

---

## 2. Python Environment Setup

### Required Python Version
- **Python 3.12+** is recommended (tested and validated on Python 3.13 as well).

### Virtual Environment Creation
From the `backend/` root directory:
```bash
python -m venv venv
```

### Activation Commands
- **Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **Windows (CMD):**
  ```cmd
  .\venv\Scripts\activate.bat
  ```
- **Linux / macOS:**
  ```bash
  source venv/bin/activate
  ```

### Dependency Installation & Verification
Install all Python dependencies:
```bash
pip install -r requirements.txt
pip install email-validator   # Required for Pydantic email validation
```
To verify correct installation:
```bash
pip list
```

---

## 3. Environment Variables (`.env.example`)

Copy the example template to create your active configuration:
```bash
cp .env.example .env
```

### `.env` Structure & Explanations:
```ini
# App parameters
PROJECT_NAME="LUMEN AI API"
SECRET_KEY="generate-a-long-random-secret-key-here"
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT="development"  # Options: development, staging, production

# Database configuration
# PostgreSQL: postgresql://<user>:<password>@<host>:<port>/<db_name>
# SQLite: sqlite:///./lumen_ai.db
DATABASE_URL="sqlite:///./lumen_ai.db"

# AI Model Integration API Keys
GEMINI_API_KEY="your-gemini-api-key-here"
OPENAI_API_KEY="your-openai-api-key-here-optional"

# CORS configuration (allowed frontend urls, comma separated)
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
```

- **`SECRET_KEY`**: A cryptographic key used to sign JWT access tokens.
- **`DATABASE_URL`**: DB connection URI. Using SQLite (`sqlite:///./lumen_ai.db`) allows lightweight, serverless local runs.
- **`GEMINI_API_KEY`**: Google Gemini API credential (used as the primary intelligence layer).
- **`CORS_ORIGINS`**: Defines which domains can communicate with the backend.

---

## 4. Database Setup

### PostgreSQL Local Installation (If used)
1. Download and install PostgreSQL from the official site.
2. Open PostgreSQL client shell or pgAdmin.
3. Run SQL to create database:
   ```sql
   CREATE DATABASE lumen_ai;
   ```
4. Update `DATABASE_URL` in `.env`:
   ```ini
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lumen_ai"
   ```

### Table Creation Process
LUMEN AI executes automated table initialization during FastAPI application startup:
```python
# app/main.py
Base.metadata.create_all(bind=engine)
```
Simply starting the server automatically creates all 10 tables on the configured database engine (PostgreSQL or SQLite).

---

## 5. Backend Start Command

Start the Uvicorn local development server from the `backend/` directory:
```bash
uvicorn app.main:app --reload
```

### Why `app.main:app` instead of `main:app`?
FastAPI expects the path import syntax. Because the root directory of our backend package is `backend/` and our entry file is located inside the `app/` folder, importing the FastAPI instance (`app`) requires referencing the module `app.main`. Using `main:app` would result in a `ModuleNotFoundError`.

Expected Server Output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

---

## 6. API Testing

### 1. Swagger UI Interactive Documentation
Open your browser and navigate to:
- **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### 2. Standard Endpoint Testing

#### A. Health Verification (`GET /`)
- **Request:**
  ```bash
  curl -X GET http://localhost:8000/
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "message": "Welcome to the LUMEN AI Backend API",
      "docs": "/docs"
    }
  }
  ```

#### B. Auth Register (`POST /api/auth/register`)
- **Request:**
  ```bash
  curl -X POST http://localhost:8000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name": "Alice", "email": "alice@example.com", "password": "securepassword"}'
  ```

#### C. Auth Login & Token retrieval (`POST /api/auth/login`)
- **Request:**
  ```bash
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "alice@example.com", "password": "securepassword"}'
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "access_token": "eyJhbG...",
      "token_type": "bearer"
    }
  }
  ```
*(Save this token and include it in headers as `"Authorization: Bearer <token>"` for subsequent secured calls)*

---

### 3. AI Endpoint Testing

#### A. Interactive Story Generation (`GET /api/stories`)
- **Request:**
  ```bash
  curl -X GET http://localhost:8000/api/stories -H "Authorization: Bearer <token>"
  ```

#### B. Decision Explanation (`POST /api/ai/explain-choice`)
- **Request:**
  ```bash
  curl -X POST http://localhost:8000/api/ai/explain-choice \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"user_id": 1, "scene_id": 1, "selected_choice": "A"}'
  ```

#### C. Reflection Analysis (`POST /api/ai/reflection`)
- **Request:**
  ```bash
  curl -X POST http://localhost:8000/api/ai/reflection \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"user_id": 1, "story_id": 1, "what_you_learned": "To recognize indicators of control", "signs_noticed": "Avoidance of eye contact", "action_taken": "Notify supervisor"}'
  ```

#### D. Quiz Question Generation (`POST /api/ai/generate-quiz`)
- **Request:**
  ```bash
  curl -X POST http://localhost:8000/api/ai/generate-quiz \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"story_id": 1}'
  ```

---

## 7. Frontend Connection

To link the React Base44 frontend with the FastAPI backend, set the base API url parameter in the frontend:
1. Create/edit the `.env.local` file inside the `frontend/` root folder:
   ```ini
   VITE_BASE44_APP_BASE_URL="http://localhost:8000"
   ```
2. When the Vite frontend runs local AJAX/fetch requests (e.g. `/api/...`), the Vite dev server proxy routes those requests to the FastAPI server running on port `8000`.

---

## 8. CORS Configuration

CORS headers are configured inside [backend/app/main.py](file:///e:/LUMEN-AI/backend/app/main.py):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configured to allow all origins during local dev setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
For production deployments, change `allow_origins=["*"]` to read from the `.env` value `CORS_ORIGINS` to allow only the production frontend domains.

---

## 9. Gemini AI Configuration

- **Key Addition:** Set `GEMINI_API_KEY` in `backend/.env`.
- **Loading:** The config is initialized inside `app/core/config.py` and instantiated inside `app/ai_engine/gemini_service.py` under the `GeminiService` class constructor.
- **Connection check endpoint (`GET /api/ai/status`):**
  - **Request:**
    ```bash
    curl -X GET http://localhost:8000/api/ai/status -H "Authorization: Bearer <token>"
    ```
  - **Response:**
    ```json
    {
      "provider": "Google Gemini",
      "status": "connected"
    }
    ```

---

## 10. Docker Setup

### Building and Launching Services
Run the following from the `backend/` directory:
- **Build & Run containers:**
  ```bash
  docker-compose up --build
  ```
- **Stop containers & clean volumes:**
  ```bash
  docker-compose down -v
  ```

---

## 11. Production Ready Checklist & Troubleshooting

### Checklist:
- [x] Environment Configured (`.env` file created and checked)
- [x] Database connected & tables generated
- [x] Gemini API key active
- [x] Uvicorn server running
- [x] Swagger documentation reachable
- [x] Frontend connected via `VITE_BASE44_APP_BASE_URL`
- [x] Token auth tested
- [x] Dynamic AI endpoint validations verified

### Troubleshooting & Common Errors

#### 1. `ModuleNotFoundError: No module named 'psycopg2'`
- **Reason:** Psycopg2 attempts to compile from source on Windows, requiring PostgreSQL system installations.
- **Solution:** Edit `requirements.txt` to replace `psycopg2-binary==2.9.9` with `psycopg2-binary` without version pinning so pip downloads the precompiled platform wheel. Alternatively, switch to local SQLite by updating the `.env` configuration to `DATABASE_URL="sqlite:///./lumen_ai.db"`.

#### 2. `ValueError: password cannot be longer than 72 bytes`
- **Reason:** Outdated `passlib` context checking has a known bug on Python 3.12/3.13 when hashing bcrypt payloads.
- **Solution:** Do not use `passlib`. Use the native Python `bcrypt` library directly to hash and verify passwords.
