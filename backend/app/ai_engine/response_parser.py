import json
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

def parse_json_string(raw_text: str) -> Dict[str, Any]:
    """
    Cleans markdown json wrapper blocks and parses string to dict.
    """
    if not raw_text:
        raise ValueError("AI response was empty.")
    
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
        
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error(f"JSONDecodeError: {e}. Raw Text: {raw_text}")
        raise ValueError(f"AI response did not contain valid JSON: {e}")

def validate_json_schema(parsed_dict: Dict[str, Any], required_keys: List[str]) -> bool:
    """
    Validates that a parsed dictionary contains all required top-level keys.
    """
    if not isinstance(parsed_dict, dict):
        return False
    return all(key in parsed_dict for key in required_keys)
