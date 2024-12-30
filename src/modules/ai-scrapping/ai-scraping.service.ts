import axios from 'axios';
import * as cheerio from 'cheerio';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class SummarizerService {
  private readonly CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
  private readonly logger = new Logger(SummarizerService.name);
   
  
    async getAISummary(userText: string): Promise<string> {
      const apiKey = this.CHATGPT_API_KEY;
      console.log({apiKey});
      if (!apiKey) {
        throw new Error('ChatGPT API key is not configured');
      }
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
  
      const jsonData = {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You will be provided with text of website
              you need to write a complete explanation on it and divide it into following sections. 
              THE SUMMARY MUST NOT EXCEED 5000 CHARACTERS.
              -Description
              -Use Cases and benefits
              -FAQs`
          },
          {
            role: 'user',
            content: userText,
          },
        ],
      };
  
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions', 
          jsonData, 
          { headers }
        );
        
        return response.data.choices[0].message.content;
      } catch (error) {
        this.logger.error(`AI Summary generation failed: ${error.message}`);
        throw new Error(`Failed to generate AI summary: ${error.response?.data?.error?.message || error.message}`);
      }
    }
  

  summarize(text: string): string {
    const sentences = text.split('. ');
    // Note: TF-IDF implementation would need a separate NPM package
    // For now, using a simple length-based summary
    const summaryLength = Math.max(1, Math.floor(0.2 * sentences.length));
    return sentences.slice(0, summaryLength).join('. ');
  }

  async scrape(url: string): Promise<{ title: string; body: string }> {
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const $ = cheerio.load(response.data);
      const title = $('title').text() || 'No Title';
      
      let body = '';
      $('p').each((_, element) => {
        body += $(element).text() + ' ';
      });

      if (!body.trim()) {
        $('#container div').each((_, element) => {
          body += $(element).text() + ' ';
        });
      }

      return { title, body };
    } catch (error) {
      throw new Error('Failed to scrape website');
    }
  }
}
