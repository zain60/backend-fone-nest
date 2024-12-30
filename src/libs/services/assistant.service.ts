import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface AssistantConfig {
    firstMessage: string;
    userID: string;
    campaignID: string;
    knowledgeBase: string;
    maxDuration: number;
    generateLink: boolean;
    serverURL: string;
    voiceID: string;
  }

interface VoiceConfig {
  voiceId: string;
  provider: string;
  stability: number;
  similarityBoost: number;
}

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private readonly apiUrl: string;
  private readonly endCallPhrases: string[];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = 'https://api.vapi.ai/assistant';
    this.endCallPhrases = [
      'bye',
      'good bye',
      'thank you for helping',
      'thank you for your help',
      'thank you for help',
      'goodbye',
    ];
  }

  private createVoiceConfig(voiceID: string): VoiceConfig {
    return {
      voiceId: voiceID,
      provider: '11labs',
      stability: 0.5,
      similarityBoost: 0.75,
    };
  }

  private createAssistantPayload({
    firstMessage,
    userID,
    campaignID,
    knowledgeBase,
    maxDuration,
    generateLink,
    serverURL,
    voiceID,
  }: AssistantConfig) {
    return {
      model: {
        messages: [
          {
            content: knowledgeBase,
            role: 'system',
          },
        ],
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        toolIds: generateLink ? ['937f79aa-f03d-42f9-bc76-07351d630b73'] : [],
      },
      transcriber: {
        model: 'nova-2-phonecall',
        language: 'en-US',
        provider: 'deepgram',
      },
      name: `${userID}-${campaignID}`,
      endCallPhrases: this.endCallPhrases,
      firstMessage,
      firstMessageMode: 'assistant-speaks-first',
      recordingEnabled: true,
      maxDurationSeconds: maxDuration,
      backgroundSound: 'office',
      voice: this.createVoiceConfig(voiceID),
      transportConfigurations: [
        {
          provider: 'twilio',
          record: true,
          recordingChannels: 'mono',
        },
      ],
      serverMessages: ['end-of-call-report', 'conversation-update'],
      serverUrl: serverURL,
      analysisPlan: {
        structuredDataSchema: {
          type: 'string',
        },
      },
    };
  }

  async createAssistant(config: AssistantConfig): Promise<string> {
    try {
      const vapiToken = this.configService.get<string>('VAPI_TOKEN');
      
      if (!vapiToken) {
        throw new Error('VAPI_TOKEN not configured');
      }

      const headers = {
        Authorization: `Bearer ${vapiToken}`,
        'Content-Type': 'application/json',
      };

      const payload = this.createAssistantPayload(config);

      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, payload, { headers }),
      );

      this.logger.log(`Assistant created successfully for user ${config.userID}`);
      return response.data.id;
    } catch (error) {
      this.logger.error(
        `Failed to create assistant for user ${config.userID}: ${error.message}`,
      );
      throw new Error(`Assistant creation failed: ${error.message}`);
    }
  }
}
