import re
from typing import Any, Dict, List, Union

# Banned patterns for safety check
BANNED_PATTERNS = [
    r"\b(kidnap|abduct|rape|assault|force\s+sex|beaten|torture|chained|locked\s+in\s+room|handcuff)\w*\b",
    r"\b(why\s+didn't\s+they\s+leave|their\s+own\s+fault|should\s+have\s+known\s+better|gullible|stupid|naive|illegal\s+alien|prostitute|hooker)\b",
]

# Vocabulary mappings
SAFE_REPLACEMENTS = {
    "victim": "survivor",
    "prostitute": "exploited person",
    "illegal alien": "undocumented worker",
    "kidnapped": "coerced",
    "handcuffed": "restricted",
    "beaten": "physically controlled",
}

def validate_ai_response(content: Union[Dict[str, Any], List[Any], str]) -> bool:
    """
    Returns True if content is safe and free of banned graphic/victim-blaming patterns.
    """
    if isinstance(content, dict):
        return all(validate_ai_response(v) for v in content.values())
    elif isinstance(content, list):
        return all(validate_ai_response(item) for item in content)
    elif isinstance(content, str):
        for pattern in BANNED_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                return False
        return True
    return True

def sanitize_content(content: Union[Dict[str, Any], List[Any], str]) -> Union[Dict[str, Any], List[Any], str]:
    """
    Recursively replaces unsafe terms with survivor-centered counterparts.
    """
    if isinstance(content, dict):
        return {k: sanitize_content(v) for k, v in content.items()}
    elif isinstance(content, list):
        return [sanitize_content(item) for item in content]
    elif isinstance(content, str):
        sanitized = content
        # Apply standard vocabulary replacements
        for unsafe, safe in SAFE_REPLACEMENTS.items():
            pattern = re.compile(rf"\b{unsafe}\b", re.IGNORECASE)
            sanitized = pattern.sub(safe, sanitized)
        # Apply graphic patterns replacement if present
        for pattern in BANNED_PATTERNS:
            if re.search(pattern, sanitized, re.IGNORECASE):
                sanitized = re.sub(pattern, "[removed graphic description for safety compliance]", sanitized, flags=re.IGNORECASE)
        return sanitized
    return content
