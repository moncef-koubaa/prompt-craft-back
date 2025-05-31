from fastapi import FastAPI
from pydantic import BaseModel
import base64
from fastapi.responses import Response
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.llm_client  import generate_image as generate_image_client 
import os

FAL_KEY = os.getenv("FAL_KEY")
if not FAL_KEY:
    raise RuntimeError("FAL_KEY not set in environment")

class ImageRequest(BaseModel):
    prompt: str


class ImageResponse(BaseModel):
    image_bytes: str

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="easy-to-guess")

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-preview-image-generation",
                             google_api_key="AIzaSyBuHI7CJDg2WKlQSZ-PoJRGzcZx0ieFTTI",
                             response_modalities=[1, 2])
prompt = PromptTemplate(
    input_variables=["chat_history", "user_input"],
    template="History:\n{chat_history}\nUser: {user_input}\nAI Prompt:"
)

@app.post("/generate-image", response_model=ImageResponse)
def generate_image(request: ImageRequest):
    session = request.session
    if "chat_history" not in session:
        session["chat_history"] = []  
    memory = ConversationBufferMemory(
        chat_memory=ConversationBufferMemory.ChatMessageHistory.parse_obj({"messages": session["chat_history"]}),
        memory_key="chat_history"
    )

    chain = LLMChain(llm=llm, prompt=prompt, memory=memory)

    ai_prompt = chain.predict(user_input=request.prompt)

    session["chat_history"] = memory.chat_memory.dict()["messages"]
    image_bytes = generate_image_client(ai_prompt)
    return Response(content=image_bytes, media_type="image/png")
    
