import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import axios from "axios";
import { setTimeout } from "timers/promises";

interface ImageRequest {
  prompt: string;
}

interface ImageResponse {
  image_bytes: string;
}

@Injectable()
export class LlmService {
  private readonly baseUrl = process.env.LLM_URL;

  constructor(private readonly http: HttpService) {}

  async generateImageUrl(prompt: string): Promise<string> {
    const url = `${this.baseUrl}/generate-image`;
    console.log(url);
    const payload: ImageRequest = { prompt };

    try {
      const response = await axios.post(
        url,
        { prompt },
        { responseType: "arraybuffer" }
      );
      const buffer = Buffer.from(response.data);
      const fileName = `${Date.now()}.png`;
      const filePath = `./src/assets/generated_image/${fileName}`;
      require("fs").writeFileSync(filePath, buffer);
      const imageUrl = `http://localhost:3000/generated-images/${fileName}`;
      //   console.log("Image URL:", imageUrl);
      // await setTimeout(5000);

      // const imageUrl = `http://localhost:3000/generated-images/1747003830177.png`;
      return imageUrl;
    } catch (error) {
      console.error("Error generating image URL:", error);
      throw new Error("Failed to generate image URL");
    }
  }
}
