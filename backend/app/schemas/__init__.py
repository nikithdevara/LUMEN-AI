from app.schemas.auth import UserRegister, UserLogin, Token, UserProfile, UserRoleUpdate
from app.schemas.story import ChoiceSchema, StorySceneOut, StoryOut, StoryStartRequest, StoryContinueRequest
from app.schemas.quiz import QuizQuestionOut, QuizGenerateRequest, QuizAnswerSubmit, QuizSubmitRequest, QuizSubmitResponse
from app.schemas.ai import ExplainChoiceRequest, ExplainChoiceResponse, ReflectionRequest, ReflectionResponse, ResourceOut
from app.schemas.extra import SettingsSchema, SettingsUpdateSchema, DashboardStats
