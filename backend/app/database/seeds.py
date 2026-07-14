import logging
from sqlalchemy.orm import Session
from app.models.user import Role, User
from app.models.story import Story, StoryScene
from app.models.interaction import Resource
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

def seed_all_defaults(db: Session):
    # 1. Seed Roles
    roles = ["Student", "Parent", "Hotel Staff", "Volunteer"]
    role_map = {}
    for r_name in roles:
        db_role = db.query(Role).filter(Role.role_name == r_name).first()
        if not db_role:
            db_role = Role(role_name=r_name)
            db.add(db_role)
            db.commit()
            db.refresh(db_role)
            logger.info(f"Seeded role: {r_name}")
        role_map[r_name] = db_role.id

    # 2. Seed Demo Users
    demo_users = [
        {"email": "student@lumen.ai", "name": "Sam Student", "role": "Student"},
        {"email": "parent@lumen.ai", "name": "Patricia Parent", "role": "Parent"},
        {"email": "staff@lumen.ai", "name": "Harry Hotel Staff", "role": "Hotel Staff"},
        {"email": "volunteer@lumen.ai", "name": "Valerie Volunteer", "role": "Volunteer"},
    ]
    for u in demo_users:
        db_user = db.query(User).filter(User.email == u["email"]).first()
        if not db_user:
            db_user = User(
                email=u["email"],
                name=u["name"],
                password_hash=get_password_hash("password123"),
                role_id=role_map[u["role"]]
            )
            db.add(db_user)
            db.commit()
            logger.info(f"Seeded demo user: {u['email']}")

    # 3. Seed Default Stories (Recommended Learning)
    default_stories = [
        {
            "title": "Empowered Choices: Student Awareness",
            "description": "Understand the warning signs of online exploitation and how to protect yourself and peers.",
            "target_role": "Student",
            "difficulty": "Beginner",
            "scenes": [
                {
                    "scene_number": 0,
                    "scenario_text": "Your classmate Casey begins skipping classes and mentions a new online 'mentor' who bought them an expensive phone and is asking for private video chats.",
                    "character_information": "Casey, your peer in high school.",
                    "learning_objective": "Spot online coercion and manipulation signs",
                    "choices": [
                        {
                            "id": "s1_c1",
                            "label": "Document details safely and advise Casey to tell a trusted counselor.",
                            "outcome": "Casey talks to the school counselor and safety checks are initiated.",
                            "is_recommended": True
                        },
                        {
                            "id": "s1_c2",
                            "label": "Ignore it, assuming it's Casey's personal life.",
                            "outcome": "Casey stops coming to school, raising warning alerts.",
                            "is_recommended": False
                        }
                    ]
                }
            ]
        },
        {
            "title": "Parent Awareness Essentials",
            "description": "Learn to talk about digital safety, set guidelines, and notice indicators of coercion.",
            "target_role": "Parent",
            "difficulty": "Beginner",
            "scenes": [
                {
                    "scene_number": 0,
                    "scenario_text": "Your child is receiving gifts in the mail from someone they met in an online gaming forum. They become highly secretive about their messages.",
                    "character_information": "Alex, your 14-year-old child.",
                    "learning_objective": "Identify digital grooming warning flags",
                    "choices": [
                        {
                            "id": "s2_c1",
                            "label": "Initiate an open, non-judgmental dialogue about online friendships and review settings.",
                            "outcome": "Alex opens up about the gaming friend and identifies red flags.",
                            "is_recommended": True
                        },
                        {
                            "id": "s2_c2",
                            "label": "Angrily confiscate the phone immediately.",
                            "outcome": "Alex gets defensive and hides communication further.",
                            "is_recommended": False
                        }
                    ]
                }
            ]
        },
        {
            "title": "Hospitality Vigilance: Spotting the Signals",
            "description": "Spot indicators of forced labor or trafficking in check-ins and cleaning routines.",
            "target_role": "Hotel Staff",
            "difficulty": "Beginner",
            "scenes": [
                {
                    "scene_number": 0,
                    "scenario_text": "A guest checking in appears highly controlled by an older companion who holds their ID and handles all communication. The guest avoids eye contact.",
                    "character_information": "Guest in check-in lobby.",
                    "learning_objective": "Spot human trafficking indicators in hospitality",
                    "choices": [
                        {
                            "id": "s3_c1",
                            "label": "Quietly note vehicle license plates and file a report to your supervisor/national hotline.",
                            "outcome": "Safety protocols are triggered securely without alerting the companion.",
                            "is_recommended": True
                        },
                        {
                            "id": "s3_c2",
                            "label": "Directly confront the companion and demand to speak to the guest alone.",
                            "outcome": "The companion leaves quickly, escalating risk to the victim.",
                            "is_recommended": False
                        }
                    ]
                }
            ]
        },
        {
            "title": "Community Advocacy Handout & Workshop",
            "description": "Organize workshops, distribute flyers, and manage community outreach projects.",
            "target_role": "Volunteer",
            "difficulty": "Beginner",
            "scenes": [
                {
                    "scene_number": 0,
                    "scenario_text": "While hosting a community awareness table, a teenager approaches asking for confidential help but seems watched by someone standing nearby.",
                    "character_information": "A distressed youth seeking help.",
                    "learning_objective": "Safe intervention and reporting procedures",
                    "choices": [
                        {
                            "id": "s4_c1",
                            "label": "Discreetly slip a card with safety hotline details and alert local support staff.",
                            "outcome": "Distressed youth safely receives resources and local staff monitor the exit.",
                            "is_recommended": True
                        },
                        {
                            "id": "s4_c2",
                            "label": "Call out to the teenager loudly to come over for support.",
                            "outcome": "The watcher grabs the teenager and departs immediately.",
                            "is_recommended": False
                        }
                    ]
                }
            ]
        }
    ]

    for s_data in default_stories:
        existing = db.query(Story).filter(Story.title == s_data["title"]).first()
        if not existing:
            db_story = Story(
                title=s_data["title"],
                description=s_data["description"],
                target_role=s_data["target_role"],
                difficulty=s_data["difficulty"]
            )
            db.add(db_story)
            db.commit()
            db.refresh(db_story)

            for idx, scene in enumerate(s_data["scenes"]):
                choices_list = []
                for c in scene["choices"]:
                    choices_list.append({
                        "id": c["id"],
                        "label": c["label"],
                        "text": c["label"],
                        "outcome": c["outcome"],
                        "ai_explanation": "Recommended action path." if c["is_recommended"] else "Higher risk action path.",
                        "is_recommended": c["is_recommended"],
                        "next_scene": scene["scene_number"] + 1
                    })

                db_scene = StoryScene(
                    story_id=db_story.id,
                    scene_number=scene["scene_number"],
                    scenario_text=scene["scenario_text"],
                    character_information=scene["character_information"],
                    choices_json=choices_list,
                    learning_objective=scene["learning_objective"]
                )
                db.add(db_scene)
            db.commit()
            logger.info(f"Seeded default story for {s_data['target_role']}")

    # 4. Seed Default Resources
    default_resources = [
        {
            "title": "Understanding the Signs of Online Coercion",
            "description": "A guide for students to recognize grooming behaviors online.",
            "category": "Learning Resources",
            "resource_url": "https://lumen-ai.org/resources/online-signs"
        },
        {
            "title": "Peer Support and Community Vigilance",
            "description": "How to step in and offer support to peers in high school or college.",
            "category": "Learning Resources",
            "resource_url": "https://lumen-ai.org/resources/peer-support"
        },
        {
            "title": "Safe Families: Digital Safety Conversations",
            "description": "Effective conversation starters for discussing online risks with children.",
            "category": "Community Actions",
            "resource_url": "https://lumen-ai.org/resources/digital-conversations"
        },
        {
            "title": "Building Safe Communities Guide",
            "description": "Strengthening local networks to protect children and adolescents.",
            "category": "Community Actions",
            "resource_url": "https://lumen-ai.org/resources/safe-communities"
        },
        {
            "title": "Workplace Awareness Framework for Hospitality",
            "description": "Standard operating procedures for checking in guests and identifying indicators.",
            "category": "Safety Guidelines",
            "resource_url": "https://lumen-ai.org/resources/hospitality-sop"
        },
        {
            "title": "Outreach Toolkit & Shareable Material",
            "description": "Outreach posters and printouts for community awareness boards.",
            "category": "Awareness Materials",
            "resource_url": "https://lumen-ai.org/resources/outreach-toolkit"
        }
    ]

    for res in default_resources:
        existing = db.query(Resource).filter(
            Resource.title == res["title"],
            Resource.category == res["category"]
        ).first()
        if not existing:
            db.add(Resource(
                title=res["title"],
                description=res["description"],
                category=res["category"],
                resource_url=res["resource_url"]
            ))
            logger.info(f"Seeded resource: {res['title']}")
    db.commit()
