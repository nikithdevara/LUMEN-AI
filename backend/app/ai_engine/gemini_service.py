import logging
from typing import Dict, Any, List

from app.core.config import settings
from app.ai_engine import prompt_builder
from app.ai_engine.response_parser import parse_llm_json_response
from app.ai_engine.safety_filter import validate_content_safety

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.gemini_model = None
        self.openai_client = None

        # 1. Initialize Google Gemini (Primary Provider)
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                # Use gemini-1.5-pro as primary, fallback to gemini-1.5-flash
                try:
                    self.gemini_model = genai.GenerativeModel("gemini-1.5-pro")
                except Exception:
                    self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("Google Gemini initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Google Gemini: {e}")

        # 2. Initialize OpenAI (Optional Fallback Provider)
        if settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
                logger.info("OpenAI fallback client initialized.")
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client fallback: {e}")

    def _execute_api_call(self, prompt: str, system_instruction: str) -> str:
        """
        Runs LLM text generation with primary Gemini and fallback OpenAI.
        """
        # A. Call Google Gemini
        if self.gemini_model:
            try:
                # Format for Gemini SDK (combines system instructions and content)
                response = self.gemini_model.generate_content(
                    [system_instruction, prompt] if system_instruction else [prompt],
                    generation_config={"response_mime_type": "application/json"}
                )
                return response.text
            except Exception as e:
                logger.error(f"Gemini API call failed: {e}. Trying fallback...")

        # B. Call OpenAI Fallback
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
                logger.error(f"OpenAI fallback API call failed: {e}.")

        # C. Raise error to trigger local mock fallback
        raise RuntimeError("No active LLM providers succeeded.")

    def generate_story(self, role: str, difficulty: str) -> Dict[str, Any]:
        prompt, system_inst = prompt_builder.build_story_prompt(role, difficulty)
        try:
            raw_text = self._execute_api_call(prompt, system_inst)
            parsed = parse_llm_json_response(raw_text)
        except Exception as e:
            logger.warning(f"AI Story generation failed ({e}), using mock fallback.")
            parsed = self._generate_mock_story(role, difficulty)

        # Run safety validation layer
        return validate_content_safety(parsed)

    def explain_choice(self, scenario_text: str, selected_choice: str, outcome_text: str) -> Dict[str, Any]:
        prompt, system_inst = prompt_builder.build_explanation_prompt(scenario_text, selected_choice, outcome_text)
        try:
            raw_text = self._execute_api_call(prompt, system_inst)
            parsed = parse_llm_json_response(raw_text)
        except Exception as e:
            logger.warning(f"AI Decision Explanation failed ({e}), using mock fallback.")
            parsed = self._generate_mock_explanation()

        # Run safety validation layer
        return validate_content_safety(parsed)

    def analyze_reflection(self, story_title: str, what_you_learned: str, signs_noticed: str, action_taken: str) -> Dict[str, Any]:
        prompt, system_inst = prompt_builder.build_reflection_prompt(story_title, what_you_learned, signs_noticed, action_taken)
        try:
            raw_text = self._execute_api_call(prompt, system_inst)
            parsed = parse_llm_json_response(raw_text)
        except Exception as e:
            logger.warning(f"AI Reflection failed ({e}), using mock fallback.")
            parsed = self._generate_mock_reflection()

        # Run safety validation layer
        return validate_content_safety(parsed)

    def generate_quiz(self, story_title: str, story_description: str) -> Dict[str, Any]:
        prompt, system_inst = prompt_builder.build_quiz_prompt(story_title, story_description)
        try:
            raw_text = self._execute_api_call(prompt, system_inst)
            parsed = parse_llm_json_response(raw_text)
        except Exception as e:
            logger.warning(f"AI Quiz Generation failed ({e}), using mock fallback.")
            parsed = self._generate_mock_quiz()

        # Run safety validation layer
        return validate_content_safety(parsed)

    def generate_recommendations(
        self,
        role: str,
        completed_stories_count: int,
        reflections_summary: List[str],
        quiz_scores: List[int]
    ) -> Dict[str, Any]:
        prompt, system_inst = prompt_builder.build_recommendations_prompt(
            role, completed_stories_count, reflections_summary, quiz_scores
        )
        try:
            raw_text = self._execute_api_call(prompt, system_inst)
            parsed = parse_llm_json_response(raw_text)
        except Exception as e:
            logger.warning(f"AI Recommendations failed ({e}), using mock fallback.")
            parsed = self._generate_mock_recommendations()

        # Run safety validation layer
        return validate_content_safety(parsed)

    # --- Local Mock Fallbacks ---
    def _generate_mock_story(self, role: str, difficulty: str) -> Dict[str, Any]:
        return {
            "title": f"Empowered Choices: {role} Awareness",
            "description": f"An educational scenario helping you recognize risks and support safety as a {role}.",
            "target_role": role,
            "difficulty": difficulty,
            "scenes": [
                {
                    "scene_number": 0,
                    "scenario": f"You notice someone in your {role} circle who seems unusually isolated, and their communication is closely monitored by another person.",
                    "choices": [
                        {
                            "id": "A",
                            "text": "Document observations and reach out to a trusted supervisor or hotline.",
                            "outcome": "You keep a quiet record and inform the local support network safely.",
                            "ai_explanation": "Reporting through proper channels protects both you and the individual from escalating danger.",
                            "is_recommended": True,
                            "next_scene": 1
                        },
                        {
                            "id": "B",
                            "text": "Confront the person monitoring them directly.",
                            "outcome": "The monitoring person becomes defensive and restricts your peer's interactions even further.",
                            "ai_explanation": "Direct confrontation is risky and can lead to increased surveillance or isolation of the vulnerable individual.",
                            "is_recommended": False,
                            "next_scene": 1
                        }
                    ],
                    "learning_objective": "Recognize signs of control and know the safe channels for reporting.",
                    "reflection_points": ["Why was direct intervention dangerous?", "What signs of control stood out?"]
                }
            ]
        }

    def _generate_mock_explanation(self) -> Dict[str, Any]:
        return {
            "why_this_choice_matters": "Making choices that prioritize safety and collaboration prevents unintended escalation and ensures professional handles the situation.",
            "awareness_signals": "Indicators of control, lack of personal independence, or extreme defensive behaviors from the supervisor.",
            "better_actions": "Documenting specific dates, times, and observable indicators, then contacting the National Trafficking Hotline.",
            "learning_takeaway": "Your role is to notice and report, rather than directly investigate or intervene, keeping safety as the top priority."
        }

    def _generate_mock_reflection(self) -> Dict[str, Any]:
        return {
            "summary": "Your reflection shows a strong understanding of how subtle control signals can manifest in daily interactions.",
            "key_lessons": [
                "Awareness begins with noticing patterns of isolation and control.",
                "Seeking guidance from established support systems keeps everyone safe.",
                "Even subtle actions, like documented reporting, make a measurable difference."
            ],
            "personal_insight": "You demonstrate empathy and a proactive safety-first mindset that helps protect community members.",
            "recommended_actions": [
                "Review local safety helpline contact cards.",
                "Share workplace safety checklists with coworkers."
            ]
        }

    def _generate_mock_quiz(self) -> Dict[str, Any]:
        return {
            "questions": [
                {
                    "question": "What is the primary indicator of potential exploitation in a community setting?",
                    "choices": [
                        "Someone who prefers using cash transactions",
                        "An individual whose interactions and movement are strictly controlled by another person",
                        "A coworker who chooses to eat lunch alone",
                        "An employee who asks for overtime hours"
                    ],
                    "correct": 1,
                    "explanation": "Strict control by another person is a strong, observable sign of potential exploitation.",
                    "ai_insight": "Trafficking relies on isolating the individual and keeping them dependent. Control of speech or ID is a major red flag."
                }
            ]
        }

    def _generate_mock_recommendations(self) -> Dict[str, Any]:
        return {
            "recommendations": [
                "Review local safety helpline contact cards.",
                "Share safety checklists with coworkers.",
                "Review warning indicators documentation."
            ]
        }

gemini_service = GeminiService()
