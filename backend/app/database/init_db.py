import logging
from sqlalchemy import text
from app.database.connection import engine, SessionLocal
from app.database.base import Base
from app.models.user import Role
from app.models.extra import Settings # Ensure all models are imported so metadata tracks them

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    logger.info("Starting schema initialization...")
    try:
        # Create all schemas
        Base.metadata.create_all(bind=engine)
        logger.info("Database schemas created successfully.")
        
        # Seed all default database entities
        db = SessionLocal()
        try:
            from app.database.seeds import seed_all_defaults
            seed_all_defaults(db)
            logger.info("Successfully seeded database entities.")
        finally:
            db.close()
            
        logger.info("Database initialization completed successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        raise e

if __name__ == "__main__":
    init_db()
