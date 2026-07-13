from typing import Tuple, List

# Centralized system instructions enforcing survivor-centered language, non-graphic content, etc.
SYSTEM_INSTRUCTION = (
    "You are an expert safety analyst, educator, and AI developer for human trafficking awareness.\n"
    "SAFETY COMPLIANCE RULES:\n"
    "- Always use survivor-centered, non-judgmental, and dignity-respecting language.\n"
    "- Focus strictly on education, prevention, and recognition of indicator signals.\n"
    "- Never generate graphic descriptions of abuse, violence, or exploitation details.\n"
    "- Never engage in victim-blaming or generate harmful stereotypes.\n"
    "- Output format MUST be a raw, valid JSON object matching the requested structure."
)

def build_story_prompt(role: str, difficulty: str) -> Tuple[str, str]:
    prompt = (
        f"Create an interactive, educational awareness story with exactly 3 scenes for target role: '{role}' "
        f"and difficulty: '{difficulty}'.\n"
        "Each scene must lead to the next. The last scene should wrap up the scenario.\n\n"
        "Return a JSON object with the following structure:\n"
        "{\n"
        "  \"title\": \"Story Title\",\n"
        "  \"description\": \"Brief overview of the training goal\",\n"
        "  \"target_role\": \"role name\",\n"
        "  \"difficulty\": \"difficulty level\",\n"
        "  \"scenes\": [\n"
        "    {\n"
        "      \"scene_number\": 0,\n"
        "      \"scenario\": \"Detailed training scenario text detailing red flags and situations\",\n"
        "      \"choices\": [\n"
        "        {\n"
        "          \"id\": \"A\",\n"
        "          \"text\": \"The choice action description\",\n"
        "          \"outcome\": \"The immediate result of making this choice\",\n"
        "          \"ai_explanation\": \"Explanation of why this choice is or is not recommended from a safety standpoint\",\n"
        "          \"is_recommended\": true,\n"
        "          \"next_scene\": 1\n"
        "        },\n"
        "        {\n"
        "          \"id\": \"B\",\n"
        "          \"text\": \"An alternative choice option\",\n"
        "          \"outcome\": \"The immediate result of making this choice\",\n"
        "          \"ai_explanation\": \"Explanation of why this choice is not recommended\",\n"
        "          \"is_recommended\": false,\n"
        "          \"next_scene\": 1\n"
        "        }\n"
        "      ],\n"
        "      \"learning_objective\": \"The key lesson from this scene\",\n"
        "      \"reflection_points\": [\"Reflection point question 1\", \"Reflection point question 2\"]\n"
        "    }\n"
        "  ]\n"
        "}"
    )
    return prompt, SYSTEM_INSTRUCTION

def build_explanation_prompt(scenario_text: str, selected_choice: str, outcome_text: str) -> Tuple[str, str]:
    prompt = (
        f"A trainee made a decision in an awareness scenario.\n"
        f"Scenario Context: {scenario_text}\n"
        f"Trainee's Choice: {selected_choice}\n"
        f"Resulting Outcome: {outcome_text}\n\n"
        "Explain why this decision matters, highlight signals to look out for, outline better actions, and list the key learning takeaway.\n"
        "Return a JSON object with this structure:\n"
        "{\n"
        "  \"why_this_choice_matters\": \"Explanation of decision impact.\",\n"
        "  \"awareness_signals\": \"Key indicators or red flags visible in the scenario.\",\n"
        "  \"better_actions\": \"Alternative safe responses.\",\n"
        "  \"learning_takeaway\": \"Primary educational learning takeaway.\"\n"
        "}"
    )
    return prompt, SYSTEM_INSTRUCTION

def build_reflection_prompt(
    story_title: str,
    what_you_learned: str,
    signs_noticed: str,
    action_taken: str
) -> Tuple[str, str]:
    prompt = (
        f"Review a trainee's reflection on the story '{story_title}'.\n"
        f"1. What they learned: {what_you_learned}\n"
        f"2. Signs they noticed: {signs_noticed}\n"
        f"3. Actions they would take: {action_taken}\n\n"
        "Provide a helpful summary, extract key lessons, give personal growth insight, and suggest next steps.\n"
        "Return a JSON object with this structure:\n"
        "{\n"
        "  \"summary\": \"Warm summary of reflection.\",\n"
        "  \"key_lessons\": [\"Lesson 1\", \"Lesson 2\", \"Lesson 3\"],\n"
        "  \"personal_insight\": \"Insight into their awareness growth.\",\n"
        "  \"recommended_actions\": [\"Action 1\", \"Action 2\"]\n"
        "}"
    )
    return prompt, SYSTEM_INSTRUCTION

def build_quiz_prompt(story_title: str, story_description: str) -> Tuple[str, str]:
    prompt = (
        f"Generate a 3-question multiple-choice quiz to assess learning on the story '{story_title}' "
        f"with context: '{story_description}'.\n\n"
        "Return a JSON object with this structure:\n"
        "{\n"
        "  \"questions\": [\n"
        "    {\n"
        "      \"question\": \"Question text?\",\n"
        "      \"choices\": [\"Option 0\", \"Option 1\", \"Option 2\", \"Option 3\"],\n"
        "      \"correct\": 0,\n"
        "      \"explanation\": \"Detailed explanation of the correct choice.\",\n"
        "      \"ai_insight\": \"Extra safety info or red flag context.\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )
    return prompt, SYSTEM_INSTRUCTION

def build_recommendations_prompt(
    role: str,
    completed_stories_count: int,
    reflections_summary: List[str],
    quiz_scores: List[int]
) -> Tuple[str, str]:
    prompt = (
        f"Recommend next steps for a trainee with role: '{role}' who completed {completed_stories_count} stories "
        f"and had quiz scores: {quiz_scores}.\n"
        f"Reflections topics: {reflections_summary}.\n\n"
        "Return a JSON object with this structure:\n"
        "{\n"
        "  \"recommendations\": [\n"
        "    \"Recommendation 1\",\n"
        "    \"Recommendation 2\",\n"
        "    \"Recommendation 3\"\n"
        "  ]\n"
        "}"
    )
    return prompt, SYSTEM_INSTRUCTION
