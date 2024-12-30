import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SummarizerService } from './ai-scraping.service';

@Controller('summarizer')
export class SummarizerController {
  constructor(private readonly summarizerService: SummarizerService) {
    console.log({SummarizerController});
  }

  @Post('ai-summary')
  async getAISummary(@Body() text: string) {
    console.log({text});
    return await this.summarizerService.getAISummary(text);
  }

  @Post('summarize')
  summarize(@Body('text') text: string) {
    return this.summarizerService.summarize(text);
  }

  @Get('scrape')
  async scrape(@Query('url') url: string) {
    return await this.summarizerService.scrape(url);
  }
}
