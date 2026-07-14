import pytest

def test_lumen_flow(client):
    # 1. Register User
    reg_response = client.post(
        "/api/auth/register",
        json={
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "strongpassword123"
        }
    )
    assert reg_response.status_code == 200
    reg_data = reg_response.json()
    assert reg_data["status"] == "success"
    assert reg_data["data"]["email"] == "jane@example.com"
    user_id = reg_data["data"]["id"]

    # 2. Login User
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "jane@example.com",
            "password": "strongpassword123"
        }
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert login_data["status"] == "success"
    token = login_data["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Update User Role
    role_response = client.put(
        "/api/users/role",
        headers=headers,
        json={"role_name": "Student"}
    )
    assert role_response.status_code == 200
    role_data = role_response.json()
    assert role_data["status"] == "success"
    assert role_data["data"]["role_name"] == "Student"

    # 4. Get User Profile
    profile_response = client.get("/api/users/profile", headers=headers)
    assert profile_response.status_code == 200
    profile_data = profile_response.json()
    assert profile_data["status"] == "success"
    assert profile_data["data"]["role_name"] == "Student"

    # 5. List Stories (Trigger seed/generation)
    stories_response = client.get("/api/stories", headers=headers)
    assert stories_response.status_code == 200
    stories_data = stories_response.json()
    assert stories_data["status"] == "success"
    assert len(stories_data["data"]) > 0
    story_id = stories_data["data"][0]["id"]

    # 6. Start Story
    start_response = client.post(
        "/api/story/start",
        headers=headers,
        json={
            "user_id": user_id,
            "story_id": story_id
        }
    )
    assert start_response.status_code == 200
    start_data = start_response.json()
    assert start_data["status"] == "success"
    assert "scene" in start_data["data"]
    scene_id = start_data["data"]["scene"]["id"]
    choice_id = start_data["data"]["scene"]["choices"][0]["id"]

    # 7. Explain Choice
    explain_response = client.post(
        "/api/ai/explain-choice",
        headers=headers,
        json={
            "user_id": user_id,
            "scene_id": scene_id,
            "selected_choice": choice_id
        }
    )
    assert explain_response.status_code == 200
    explain_data = explain_response.json()
    assert explain_data["status"] == "success"
    assert "why_this_choice_matters" in explain_data["data"]

    # 8. Continue Story
    continue_response = client.post(
        "/api/story/continue",
        headers=headers,
        json={
            "user_id": user_id,
            "story_id": story_id,
            "selected_choice": choice_id
        }
    )
    assert continue_response.status_code == 200
    continue_data = continue_response.json()
    assert continue_data["status"] == "success"

    # 9. Submit Reflection
    reflection_response = client.post(
        "/api/ai/reflection",
        headers=headers,
        json={
            "user_id": user_id,
            "story_id": story_id,
            "what_you_learned": "To prioritize safety and report concerns properly.",
            "signs_noticed": "Isolation and monitored communication.",
            "action_taken": "Notify a supervisor or local support hotline."
        }
    )
    assert reflection_response.status_code == 200
    reflection_data = reflection_response.json()
    assert reflection_data["status"] == "success"
    assert "summary" in reflection_data["data"]

    # 10. Generate Quiz Questions
    quiz_gen_response = client.post(
        "/api/ai/generate-quiz",
        headers=headers,
        json={"story_id": story_id}
    )
    assert quiz_gen_response.status_code == 200
    quiz_gen_data = quiz_gen_response.json()
    assert quiz_gen_data["status"] == "success"
    assert len(quiz_gen_data["data"]) > 0

    # 11. Submit Quiz Results
    quiz_submit_response = client.post(
        "/api/quiz/submit",
        headers=headers,
        json={
            "user_id": user_id,
            "story_id": story_id,
            "answers": [
                {
                    "question_idx": 0,
                    "selected": 1
                }
            ]
        }
    )
    assert quiz_submit_response.status_code == 200
    quiz_submit_data = quiz_submit_response.json()
    assert quiz_submit_data["status"] == "success"
    assert "score" in quiz_submit_data["data"]

    # 12. Get Recommendations
    recs_response = client.get("/api/recommendations", headers=headers)
    assert recs_response.status_code == 200
    recs_data = recs_response.json()
    assert recs_data["status"] == "success"
    assert len(recs_data["data"]) > 0

    # 13. AI Status
    status_response = client.get("/api/ai/status", headers=headers)
    assert status_response.status_code == 200
    status_data = status_response.json()
    assert status_data["provider"] == "Google Gemini"
    assert status_data["status"] in ["connected", "mock"]

    # 14. Get User Progress
    progress_response = client.get("/api/stories/progress", headers=headers)
    assert progress_response.status_code == 200
    progress_data = progress_response.json()
    assert progress_data["status"] == "success"
    assert len(progress_data["data"]) > 0
    progress_id = progress_data["data"][0]["id"]

    # 15. Update Progress by ID
    update_progress_response = client.put(
        f"/api/stories/progress/{progress_id}",
        headers=headers,
        json={
            "current_scene": 1,
            "completed": False,
            "completion_percentage": 50.0
        }
    )
    assert update_progress_response.status_code == 200
    update_progress_data = update_progress_response.json()
    assert update_progress_data["status"] == "success"
    assert update_progress_data["data"]["current_scene"] == 1
    assert update_progress_data["data"]["completion_percentage"] == 50.0
