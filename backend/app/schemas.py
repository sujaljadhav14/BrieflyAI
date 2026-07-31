from pydantic import BaseModel, Field

class SummarizeRequest(BaseModel):
    dialogue: str = Field(..., description="The conversational dialogue text to summarize.")

class SummarizeResponse(BaseModel):
    summary: str = Field(..., description="The generated summary.")
