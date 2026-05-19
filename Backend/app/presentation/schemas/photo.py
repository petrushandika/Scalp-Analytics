from pydantic import BaseModel


class AnalyzeResponse(BaseModel):
    severity_stage: str
    confidence: float
    recommendation: str
    probabilities: dict[str, float]
