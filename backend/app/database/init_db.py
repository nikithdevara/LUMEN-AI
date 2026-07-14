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
        
        # Seed default roles
        db = SessionLocal()
        try:
            default_roles = ["Student", "Parent", "Hotel Staff", "Volunteer"]
            roles_seeded = 0
            
            for r_name in default_roles:
                existing = db.query(Role).filter(Role.role_name == r_name).first()
                if not existing:
                    db.add(Role(role_name=r_name))
                    roles_seeded += 1
            
            if roles_seeded > 0:
                db.commit()
                logger.info(f"Successfully seeded {roles_seeded} default roles.")
            else:
                logger.info("Default roles already seeded.")
        finally:
            db.close()
            
        logger.info("Database initialization completed successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        raise e

if __name__ == "__main__":
    init_db()
