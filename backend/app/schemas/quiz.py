from pydantic import BaseModel
from typing import List, Optional

class QuizQuestionOut(BaseModel):
    id: Optional[int] = None
    question: str
    choices: List[str]
    correct: int  # Index of the correct answer
    explanation: str
    ai_insight: Optional[str] = None

class QuizGenerateRequest(BaseModel):
    story_id: int

class QuizAnswerSubmit(BaseModel):
    question_idx: int
    selected: int

class QuizSubmitRequest(BaseModel):
    user_id: int
    story_id: int
    answers: List[QuizAnswerSubmit]

class QuizSubmitResponse(BaseModel):
    score: int
    total_questions: int
    percentage: float
    progress_updated: bool
    recommendations: List[str]
