import logging
import time
from typing import Any, Dict
from app.core.config import settings
from app.ai_engine.response_parser import parse_json_string

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.gemini_model = None
        self.openai_client = None

        # Initialize primary Google Gemini client
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                # Primary is gemini-1.5-pro, fallback to gemini-1.5-flash
                try:
                    self.gemini_model = genai.GenerativeModel("gemini-1.5-pro")
                except Exception:
                    self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("Google Gemini service loaded.")
            except Exception as e:
                logger.warning(f"Google Gemini initialization failed: {e}")

        # Initialize optional OpenAI client
        if settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
                logger.info("OpenAI fallback service loaded.")
            except Exception as e:
                logger.warning(f"OpenAI fallback initialization failed: {e}")

    def generate_content(self, prompt: str, system_instruction: str = "") -> str:
        """
        Sends prompt to Gemini API with retry logic and error fallbacks.
        """
        retries = 3
        delay = 1.0

        for attempt in range(retries):
            # A. Google Gemini (Primary)
            if self.gemini_model:
                try:
                    content_list = []
                    if system_instruction:
                        content_list.append(system_instruction)
                    content_list.append(prompt)
                    
                    response = self.gemini_model.generate_content(
                        content_list,
                        generation_config={"response_mime_type": "application/json"}
                    )
                    if response and response.text:
                        return response.text
                except Exception as e:
                    logger.error(f"Gemini API attempt {attempt + 1} failed: {e}")
                    time.sleep(delay)
                    delay *= 2

        # B. OpenAI Fallback
        if self.openai_client:
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})

                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    response_format={"type": "json_object"},
                    temperature=0.7
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.error(f"OpenAI fallback generation failed: {e}")

        raise RuntimeError("AI content generation failed across all active providers.")

    def generate_json_response(self, prompt: str, system_instruction: str = "") -> Dict[str, Any]:
        """
        Generates content and returns the parsed JSON dictionary.
        """
        raw_text = self.generate_content(prompt, system_instruction)
        return parse_json_string(raw_text)

gemini_service = GeminiService()

def generate_content(prompt: str, system_instruction: str = "") -> str:
    return gemini_service.generate_content(prompt, system_instruction)

def generate_json_response(prompt: str, system_instruction: str = "") -> Dict[str, Any]:
    return gemini_service.generate_json_response(prompt, system_instruction)
