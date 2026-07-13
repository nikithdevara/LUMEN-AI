# Prompt Builder Module for LUMEN AI

def build_story_prompt(role: str, difficulty: str, age_group: str = "Young Adult", experience: str = "Returning user") -> str:
    return (
        f"Generate an interactive awareness training story scene matching role: '{role}', "
        f"difficulty level: '{difficulty}', target age group: '{age_group}', and user experience: '{experience}'.\n"
        "Return a valid JSON object strictly matching the following schema:\n"
        "{\n"
        "  \"title\": \"Title of the Story\",\n"
        "  \"scenario\": \"The detailed story narrative introducing red flags and situations\",\n"
        "  \"characters\": [\"Character A\", \"Character B\"],\n"
        "  \"context\": \"Background context and warning signals to pay attention to\",\n"
        "  \"choices\": [\n"
        "    {\n"
        "      \"id\": \"A\",\n"
        "      \"text\": \"First choice action description\",\n"
        "      \"impact\": \"The consequence/result of selecting this choice\"\n"
        "    },\n"
        "    {\n"
        "      \"id\": \"B\",\n"
        "      \"text\": \"Second choice action description\",\n"
        "      \"impact\": \"The consequence/result of selecting this choice\"\n"
        "    }\n"
        "  ],\n"
        "  \"learning_objective\": \"The key educational takeaway from this scene\"\n"
        "}"
    )

def build_explanation_prompt(scenario: str, choice: str) -> str:
    return (
        f"Evaluate the user's choice in the following interactive scenario:\n"
        f"Scenario Context: {scenario}\n"
        f"Selected Choice Action: {choice}\n\n"
        "Explain why this choice matters, indicators/signals, safe actions, and learning points.\n"
        "Return a valid JSON object strictly matching this schema:\n"
        "{\n"
        "  \"explanation\": \"Detailed safety analysis of the choice.\",\n"
        "  \"awareness_signs\": [\"Red flag sign 1\", \"Red flag sign 2\"],\n"
        "  \"safer_actions\": [\"Safe action alternative 1\", \"Safe action alternative 2\"],\n"
        "  \"key_learning\": \"Key takeaway lesson.\"\n"
        "}"
    )

def build_reflection_prompt(reflection_text: str, role: str) -> str:
    return (
        f"Analyze the following trainee reflection on their training experience as a {role}.\n"
        f"Trainee Reflection Text: {reflection_text}\n\n"
        "Return a valid JSON object strictly matching this schema:\n"
        "{\n"
        "  \"summary\": \"Supportive, empathetic summary of the reflection.\",\n"
        "  \"learning_points\": [\"Extracted lesson 1\", \"Extracted lesson 2\"],\n"
        "  \"personal_insight\": \"Insight into user's growth and situational awareness.\",\n"
        "  \"next_action\": \"Recommended immediate actionable step.\"\n"
        "}"
    )

def build_quiz_prompt(role: str, story_topic: str, difficulty: str) -> str:
    return (
        f"Generate a 3-question multiple choice knowledge check about the topic '{story_topic}' "
        f"tailored to the role '{role}' and difficulty '{difficulty}'.\n\n"
        "Return a valid JSON object strictly matching this schema:\n"
        "{\n"
        "  \"questions\": [\n"
        "    {\n"
        "      \"question\": \"Question text?\",\n"
        "      \"options\": [\"Option 0\", \"Option 1\", \"Option 2\", \"Option 3\"],\n"
        "      \"correct_answer\": \"Option index (0, 1, 2, or 3 as a string)\",\n"
        "      \"explanation\": \"Detailed educational explanation of the correct choice\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )

def build_recommendation_prompt(role: str, completed_stories: str, quiz_score: str, reflection: str) -> str:
    return (
        f"Compile action steps for a {role} who completed stories: '{completed_stories}' "
        f"with quiz score: '{quiz_score}' and reflection: '{reflection}'.\n\n"
        "Return a valid JSON object strictly matching this schema:\n"
        "{\n"
        "  \"recommendations\": [\n"
        "    {\n"
        "      \"title\": \"Title of Recommendation\",\n"
        "      \"description\": \"Details of the recommendation.\",\n"
        "      \"action\": \"Actionable step for the user.\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )
