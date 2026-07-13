import json
import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)

def parse_llm_json_response(raw_text: str) -> Dict[str, Any]:
    """
    Cleans raw LLM text by removing markdown json blocks and parses it to a Python dict.
    """
    if not raw_text:
        raise ValueError("Empty response received from AI model.")

    cleaned = raw_text.strip()
    
    # Remove markdown code fence triggers if present
    if cleaned.startswith("```"):
        # Match ```json or ``` and strip both ends
        lines = cleaned.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI JSON response: {e}. Raw text: {raw_text}")
        raise ValueError(f"AI response did not contain valid JSON: {e}")
