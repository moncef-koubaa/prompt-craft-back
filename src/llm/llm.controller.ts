import { Controller, Post, Body } from "@nestjs/common";
import { LlmService } from "./llm.service";
import { Public } from "src/decorator/public.decorator";
import { GetUser } from "src/decorator/get-user.decorator";
@Controller("ai")
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Public()
  @Post("image-url")
  async getImageUrl(@Body() request) {
    console.log("Received request:", request);
    const url = await this.llmService.generateImageUrl(request.prompt);
    console.log("Generated URL:", url);
    return { url };
  }
}
