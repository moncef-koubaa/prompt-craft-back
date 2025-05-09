import fal_client, requests
from PIL import Image
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM  # :contentReference[oaicite:0]{index=0}

def generate_image(prompt):
    out = fal_client.run("fal-ai/f-lite/standard", {"prompt": prompt})

    return out["images"][0]["url"]
    # img = Image.open(requests.get(url, stream=True).raw)

    # img.save("output.png")
    # img.show()