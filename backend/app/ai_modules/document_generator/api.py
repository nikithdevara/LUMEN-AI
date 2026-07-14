from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class DocumentRequest(BaseModel):
    document_type: str  # Awareness Guide, Report, Workshop Manual, Volunteer Kit, Training Manual, Handbook
    topic: str

@router.post("/generate")
def generate_document(
    req: DocumentRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate an educational document. "
        f"Document Type: '{req.document_type}'. "
        f"Topic: '{req.topic}'. "
        f"Respond ONLY with a JSON object. The JSON object must contain:\n"
        f"- 'title': Document Title\n"
        f"- 'metadata': A JSON object mapping 'author', 'version', and 'tags'\n"
        f"- 'markdown_content': A comprehensive markdown string containing structured headers, bullets, advice, warnings, and citations\n"
        f"- 'structured_sections': An array of section objects mapping 'header' and 'summary_bullets'"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "title": f"LUMEN: Official {req.document_type} on {req.topic}",
            "metadata": {"author": "LUMEN AI System", "version": "1.0", "tags": ["prevention", "safety"]},
            "markdown_content": f"# LUMEN {req.document_type}\n\n## Introduction\nThis guide outlines indicators and responses regarding {req.topic}.\n\n### Core Signals\n- Unexplained absenteeism\n- Controlled speech",
            "structured_sections": [
                {
                    "header": "Introduction",
                    "summary_bullets": ["Overview of the safety landscape", "Purpose of this workbook"]
                }
            ]
        }
    return data
