def build_illustration_prompt(story: str, characters: str, location: str, emotion: str) -> str:
    """
    Constructs a highly detailed prompt for educational illustration generation.
    """
    return (
        f"Create a high-quality educational awareness illustration. "
        f"Context/Story: {story}. "
        f"Characters involved: {characters}. "
        f"Setting/Location: {location}. "
        f"Atmosphere/Emotion: {emotion}. "
        f"Style: Flat illustration, modern SVG editorial style, vibrant but respectful colors, "
        f"highly descriptive, focused on human safety and trafficking prevention awareness."
    )
