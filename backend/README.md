# LUMEN AI Backend API

FastAPI backend system built for LUMEN AI, an AI-powered interactive awareness and education platform.

## Features

- **FastAPI Framework** with Python 3.12.
- **SQLAlchemy ORM** mapping with PostgreSQL database.
- **JWT Authentication** and password hashing.
- **Pydantic Validation** schemas.
- **OpenAPI/Swagger Documentation** auto-generated.
- **Unified AI Service** with OpenAI GPT and Google Gemini API support.
- **Dockerized Setup** with PostgreSQL.

---

## Local Setup

### Prerequisites

- Python 3.12+
- PostgreSQL database (or run via Docker)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in your database credentials and `OPENAI_API_KEY` or `GEMINI_API_KEY`.*

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

6. Open the API documentation in your browser:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Run with Docker

Build and start the web application and PostgreSQL database with one command:

```bash
docker-compose up --build
```
