import fal_client, requests
from PIL import Image
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM  # :contentReference[oaicite:0]{index=0}
import requests
import base64
import uuid
import os
# def generate_image(prompt):
#     out = fal_client.run("fal-ai/f-lite/standard", {"prompt": prompt})

#     return out["images"][0]["url"]
#     # img = Image.open(requests.get(url, stream=True).raw)

#     # img.save("output.png")
#     # img.show()

def generate_image(prompt):


    # 1) Replace with your actual API key
    API_KEY = "AIzaSyANqemwsLITCIBNZDQ3RD47LgogB3UnlUs"

    # 2) Use the preview-image-generation endpoint
    URL = (
        "https://generativelanguage.googleapis.com/"
        "v1beta/models/"
        "gemini-2.0-flash-preview-image-generation"
        f":generateContent?key={API_KEY}"
    )


    # 3) Build your payload
    payload = {
        "contents": [
            {
                "parts": [
                    { "text": prompt }
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"]
        }
    }

    # 4) Send the POST
    resp = requests.post(URL, json=payload)
    resp.raise_for_status()  # will raise an exception for HTTP errors

    # 5) Parse the JSON
    data = resp.json()
    candidates = data.get("candidates", [])
    if not candidates:
        raise RuntimeError("No candidates returned in response")

    # 6) Find the part with inlineData (the Base64 image)
    image_b64 = None
    for part in candidates[0]["content"]["parts"]:
        if "inlineData" in part:
            image_b64 = part["inlineData"]["data"]
            break

    if image_b64 is None:
        raise RuntimeError("No inlineData found in the response parts")

    # 7) Decode and save to disk
    image_bytes = base64.b64decode(image_b64)
    return image_bytes
