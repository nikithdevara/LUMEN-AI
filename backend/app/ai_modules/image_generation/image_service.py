import urllib.parse
from app.ai_modules.image_generation.prompt_builder import build_illustration_prompt

# Curated high-quality, abstract, and educational graphics for the platform
VISUALS_DATABASE = {
    "student": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    "parent": "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    "hotel": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "volunteer": "https://images.unsplash.com/photo-1559027615-cd2681c15aba?auto=format&fit=crop&w=800&q=80",
    "safety": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    "fallback": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
}

def generate_educational_illustration(story: str, characters: str, location: str, emotion: str) -> dict:
    """
    Simulates AI image generation by constructing a descriptive image prompt and 
    resolving a relevant high-quality educational illustration.
    """
    prompt = build_illustration_prompt(story, characters, location, emotion)
    
    # Simple semantic router to choose a visually cohesive graphics layout
    desc_lower = (story + " " + characters + " " + location + " " + emotion).lower()
    
    selected_url = VISUALS_DATABASE["fallback"]
    category = "general"
    
    if "student" in desc_lower or "school" in desc_lower or "college" in desc_lower:
        selected_url = VISUALS_DATABASE["student"]
        category = "education"
    elif "parent" in desc_lower or "family" in desc_lower or "child" in desc_lower:
        selected_url = VISUALS_DATABASE["parent"]
        category = "family"
    elif "hotel" in desc_lower or "lobby" in desc_lower or "staff" in desc_lower:
        selected_url = VISUALS_DATABASE["hotel"]
        category = "hospitality"
    elif "volunteer" in desc_lower or "ngo" in desc_lower or "community" in desc_lower:
        selected_url = VISUALS_DATABASE["volunteer"]
        category = "ngo"
    elif "safe" in desc_lower or "emergency" in desc_lower or "report" in desc_lower:
        selected_url = VISUALS_DATABASE["safety"]
        category = "safety"

    # Append deterministic signature parameter to avoid browser caching
    url_signature = f"&sig={abs(hash(prompt)) % 10000}"
    final_url = selected_url + url_signature

    return {
        "image_url": final_url,
        "prompt": prompt,
        "metadata": {
            "category": category,
            "dimensions": "1024x1024",
            "aspect_ratio": "1:1",
            "engine": "LUMEN Image Generator v1.0"
        }
    }
