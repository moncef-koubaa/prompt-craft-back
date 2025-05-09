import { Controller, Post, Body } from "@nestjs/common";
import { LlmService } from "./llm.service";
@Controller("ai")
export class LlmController {
  constructor(private readonly llm: LlmService) {}

  @Post("image-url")
  async getImageUrl(@Body() request) {
    const url = await this.llm.generateImageUrl(request.prompt);
    return { url };
  }
}
