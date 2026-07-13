import re
from typing import Any, Dict, List, Union

# Safety checklist and filters for human trafficking awareness content
BANNED_PATTERNS = [
    # Graphic descriptions / sensationalism
    r"\b(kidnap|abduct|rape|assault|force\s+sex|beaten|torture|chained|locked\s+in\s+room|handcuff)\w*\b",
    # Victim blaming/stereotypes
    r"\b(why\s+didn't\s+they\s+leave|their\s+own\s+fault|should\s+have\s+known\s+better|gullible|stupid|naive|illegal\s+alien|prostitute|hooker)\b",
]

# Replacements to sanitize content programmatically to survivor-centered equivalents
SAFE_REPLACEMENTS = {
    "victim": "survivor",
    "prostitute": "exploited person",
    "illegal alien": "undocumented worker",
    "kidnapped": "coerced",
    "handcuffed": "restricted",
    "beaten": "physically controlled",
}

def sanitize_text(text: str) -> str:
    """
    Programmatically sanitizes text to use survivor-centered language.
    """
    sanitized = text
    for unsafe, safe in SAFE_REPLACEMENTS.items():
        # Case insensitive replacement matching word boundaries
        pattern = re.compile(rf"\b{unsafe}\b", re.IGNORECASE)
        sanitized = pattern.sub(safe, sanitized)
    return sanitized

def validate_content_safety(data: Union[Dict[str, Any], List[Any], str]) -> Union[Dict[str, Any], List[Any], str]:
    """
    Recursively scans and validates dictionary data or list content.
    Returns the sanitized safe version of the data.
    """
    if isinstance(data, dict):
        sanitized_dict = {}
        for key, value in data.items():
            sanitized_dict[key] = validate_content_safety(value)
        return sanitized_dict
    elif isinstance(data, list):
        return [validate_content_safety(item) for item in data]
    elif isinstance(data, str):
        # 1. Check for banned graphic patterns
        for pattern in BANNED_PATTERNS:
            if re.search(pattern, data, re.IGNORECASE):
                # Programmatically filter out or replace graphic patterns with safer terms
                data = re.sub(pattern, "[removed graphic description for safety compliance]", data, flags=re.IGNORECASE)
        
        # 2. Sanitize vocabulary (e.g. victim -> survivor)
        return sanitize_text(data)
    else:
        return data
