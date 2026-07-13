# LUMEN AI - Role-Based End-to-End Test Report

This document reports the QA validation of the role-based learning tracks, user access control, database persistence, and AI personalization across all four persona profiles inside the **LUMEN AI** system.

---

## 1. Role Testing Matrix

The table below summarizes the test results for the user roles, verifying authentication, dashboard features, personalization, and data persistence:

| Role Persona | Login | Dashboard Load | Role-Based Features | AI Personalization | Progress Save | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Student** | **PASS** | **PASS** (Sam Student) | Course paths, score, badges | **PASS** (Peer-oriented) | **PASS** (Stored in DB) | **READY** |
| **Parent** | **PASS** | **PASS** (Patricia Parent) | Family safety guides, guidance | **PASS** (Protection focus) | **PASS** (Stored in DB) | **READY** |
| **Hotel Staff** | **PASS** | **PASS** (Harry Staff) | Hospitality warning indicators | **PASS** (Workplace safety) | **PASS** (Stored in DB) | **READY** |
| **Volunteer** | **PASS** | **PASS** (Valerie Volunteer)| Community support resources | **PASS** (Advocacy focus) | **PASS** (Stored in DB) | **READY** |

---

## 2. Phase-by-Phase QA Audit Findings

### Phase 1 — Authentication & Session Verification
- **New Account Registration**: Validated correct fields. Duplicate registration requests correctly trigger a database unique constraint check, returning a user-friendly error response (`400 Bad Request: Email already registered`).
- **Demo Credential Testing**: Verified that all four demo emails (`student@lumen.ai`, `parent@lumen.ai`, `staff@lumen.ai`, `volunteer@lumen.ai`) log in instantly with `password123`.
- **JWT token creation**: Token is securely issued on backend login, stored locally, and attached to all future API calls.

---

### Phase 2 — Student Role Testing
- **Dashboard Experience**: Welcome header correctly displays `"Hello Sam"`. Features include Student Learning Score, Course Progress bar, and Achievements.
- **AI Customization**: Stories are centered around school, peers, and online vulnerability indicators. Choice critiques evaluate safety actions from a peer-advocate perspective.
- **Data tracking**: Completed stories update the user score and append the completed story count to the profile state.

---

### Phase 3 — Parent Role Testing
- **Dashboard Experience**: Welcome header displays `"Hello Patricia"`. Features focus on family safety, communication templates, and interactive stories.
- **AI Customization**: Gemini prompts compile parents' scenarios focused on recognizing grooming, cyber-vulnerability indicators, and maintaining open dialogue.
- **Recommendations**: Recommendations target communication, digital safety checkups, and reporting protocols.

---

### Phase 4 — Hotel Staff Role Testing
- **Dashboard Experience**: Welcome header displays `"Hello Harry"`. Renders Hospitality Training tracks and warning sign recognition lists.
- **AI Customization**: Interactive scenarios focus on hotel check-in indicators (e.g. guests checking in with third parties speaking for them, lack of physical ID, visible signs of fear).
- **Safety content**: Choice explanations critique workplace intervention limits (reporting indicators to safety management vs. unsafe direct confrontation).

---

### Phase 5 — Volunteer Role Testing
- **Dashboard Experience**: Welcome header displays `"Hello Valerie"`. Renders Community Outreach materials, campaigns, and guides.
- **AI Customization**: Scenarios focus on support groups, public safety advocacy, and community outreach risks.
- **Actionable steps**: AI compiles resources on active listening, outreach, and safety.

---

## 3. System and Integration Checks

### Phase 6 — Role Access Control (RBAC)
- **Role separation**: Access is segmented dynamically. The backend retrieves the database `Role` associated with the request's JWT sub parameter. It automatically filters `Story` objects where `target_role == user_role`.
- **Redirect behavior**: Unauthenticated requests to protected endpoints immediately return `401 Unauthorized` responses and are redirected to `/login` by the frontend `ProtectedRoute`.

### Phase 7 — Data Persistence
- **State Restoration**: After logging out and logging back in, the backend correctly queries the SQLite database, returning all previously saved user progress metrics. Complete stories, reflections, and quiz score indicators are fully restored.

### Phase 8 — AI Personalization Output Comparison
We tested the prompt builder using the same core indicator scenario. The AI model output dynamically customized its tone and safety content based on the target persona:
- **Student Prompt Response**: Focuses on peer support, trusted counselors, and online guidelines.
- **Parent Prompt Response**: Emphasizes family boundaries, open discussion tips, and parental controls.
- **Hotel Staff Prompt Response**: Prioritizes hotel reporting protocols, corporate accountability, and safety personnel checkups.
- **Volunteer Prompt Response**: Evaluates outreach boundaries, active listening safety, and community helpline coordination.

---

## 4. Issues Log & Resolutions

### 1. Default Role Mappings [HIGH]
- **Issue**: Newly registered users had a null `role_id`, causing story retrieval to return empty lists.
- **Resolution**: Implemented automatic database seeding during FastAPI initialization, creating standard roles ("Student", "Parent", "Hotel Staff", "Volunteer") and providing four pre-mapped demo logins for quick verification.

### 2. Missing Onboarding Updates [MEDIUM]
- **Issue**: Onboarding choice cards were not updating the database state during local runs.
- **Resolution**: Updated `local-db.js` `updateMe` method to dispatch a PUT request to the backend `PUT /api/users/role` endpoint, synchronizing the profile role dynamically.

### 3. Redirection Flow Gaps [MEDIUM]
- **Issue**: Login redirect pointed to `/`, creating an unnecessary navigation step to the landing page.
- **Resolution**: Updated the redirect route to `/workspace` upon login or registration validation.

---

## 5. Recommended Production Fixes

1. **Add Role Restriction Middleware**:
   Add role verification checks directly inside the backend routes (e.g. `@router.get("/stories", dependencies=[Depends(role_required("Student"))])`) to prevent users from manually requesting stories that do not match their assigned role.
2. **Dynamic Badges**:
   Map specific SVG badge assets to each persona track (e.g. "Shield Badge" for Hotel Staff, "Counselor Badge" for Parents) to make the gamification profile achievements feel highly customized.
