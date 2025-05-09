from fastapi import FastAPI
from pydantic import BaseModel
from app.llm_client  import generate_image as generate_image_client 
import os

FAL_KEY = os.getenv("FAL_KEY")
if not FAL_KEY:
    raise RuntimeError("FAL_KEY not set in environment")

class ImageRequest(BaseModel):
    prompt: str


class ImageResponse(BaseModel):
    image_url: str

app = FastAPI()


@app.post("/generate-image", response_model=ImageResponse)
def generate_image(request: ImageRequest):
    url = generate_image_client(request.prompt)

    return {"image_url": url}
    
