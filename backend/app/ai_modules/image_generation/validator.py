from pydantic import BaseModel
from typing import Dict, Any

class ImageGenerationRequest(BaseModel):
    story: str
    characters: str
    location: str
    emotion: str

class ImageGenerationResponse(BaseModel):
    image_url: str
    prompt: str
    metadata: Dict[str, Any]
