import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

interface ImageRequest {
  prompt: string;
}

interface ImageResponse {
  image_url: string;
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
      const resp$ = this.http.post<ImageResponse>(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const resp = await firstValueFrom(resp$);
      return resp.data.image_url;
    } catch (error) {
      console.error("Error generating image URL:", error);
      throw new Error("Failed to generate image URL");
    }
  }
}
