import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VapiService {
  private vapiToken: string;
  private twilioSid: string;
  private twilioToken: string;
  public inboundServerUrl: string;
  public outboundServerUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.vapiToken = this.configService.get<string>('vapi.VAPI_TOKEN');
    this.twilioSid = this.configService.get<string>('vapi.TWILIO_ACCOUNT_SID');
    this.twilioToken = this.configService.get<string>('vapi.TWILIO_AUTH_TOKEN');
    this.inboundServerUrl = this.configService.get<string>('vapi.VAPI_INBOUND_CALLBACK');
    this.outboundServerUrl = this.configService.get<string>('vapi.VAPI_OUTBOUND_CALLBACK');
  }

  async createAssistant(
    name: string,
    firstMessage: string,
    knowledgeBase: string,
    voiceId: string,
    serverUrl: string,
    maxDuration: number,
  ): Promise<any> {
    const url = 'https://api.vapi.ai/assistant';
    const payload = {
      model: {
        messages: [{
          content: knowledgeBase,
          role: 'system',
        }],
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        toolIds: [],
      },
      transcriber: {
        model: 'nova-2-phonecall',
        language: 'en-US',
        provider: 'deepgram',
      },
      name: `${name}`,
      endCallPhrases: [
        'bye',
        'good bye',
        'thank you for helping',
        'thank you for your help',
        'thank you for help',
        'goodbye',
      ],
      firstMessage: firstMessage,
      firstMessageMode: 'assistant-speaks-first',
      recordingEnabled: true,
      maxDurationSeconds: maxDuration,
      backgroundSound: 'office',
      voice: {
        voiceId: voiceId,
        provider: '11labs',
        stability: 0.5,
        similarityBoost: 0.75,
      },
      transportConfigurations: [
        {
          provider: 'twilio',
          record: true,
          recordingChannels: 'mono',
        },
      ],
      serverMessages: ['end-of-call-report', 'conversation-update'],
      serverUrl: serverUrl,
      analysisPlan: {
        structuredDataPlan: { schema: [{ type: 'string' }] },
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to create assistant',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAssistant(
    assistantId: string,
    firstMessage: string,
    knowledgeBase: string,
    voiceId: string,
  ): Promise<any> {
    const url = `https://api.vapi.ai/assistant/${assistantId}`;
    const payload = {
      model: {
        messages: [{
          content: knowledgeBase,
          role: 'system',
        }],
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        toolIds: [],
      },
      firstMessage: firstMessage,
      voice: {
        voiceId: voiceId,
        provider: '11labs',
        stability: 0.5,
        similarityBoost: 0.75,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.patch(url, payload, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to update assistant',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAssistant(assistantId: string): Promise<void> {
    const url = `https://api.vapi.ai/assistant/${assistantId}`;

    try {
      const response = await lastValueFrom(
        this.httpService.delete(url, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
          },
        }),
      );

      if (response.status === HttpStatus.OK) {
        console.log(`Assistant with ID ${assistantId} has been deleted.`);
      } else {
        console.error(
          `Failed to delete assistant with ID ${assistantId}. Status code: ${response.status}`,
        );
      }
    } catch (error) {
      console.error(
        `Error deleting assistant with ID ${assistantId}: ${error.message}`,
      );
    }
  }

  async callCustomer(
    customerPhoneNumber: string,
    assistantId: string,
    callerPhoneNumber: string,
  ): Promise<void> {
    const url = 'https://api.vapi.ai/call';

    const payload = {
      assistantId: assistantId,
      customer: { number: customerPhoneNumber },
      phoneNumber: {
        twilioPhoneNumber: callerPhoneNumber,
        twilioAccountSid: this.twilioSid,
        twilioAuthToken: this.twilioToken,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      const data = response.data;
      console.log(`The call has been created successfully with ID ${data.id}.`);
    } catch (error) {
      console.error(`Error making call: ${error.message}`);
    }
  }

  async importNumber(phoneNumber: string,assistantId:string): Promise<any> {
    const url = 'https://api.vapi.ai/phone-number';

    const payload = {
      provider: 'twilio',
      number: phoneNumber,
      twilioAccountSid: this.twilioSid,
      twilioAuthToken: this.twilioToken,
      assistantId: assistantId,
      name: phoneNumber,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to import number',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async assignAssistantToNumber(
    vapiNumberId: string,
    assistantId: string,
  ): Promise<any> {
    const url = `https://api.vapi.ai/phone-number/${vapiNumberId}`;

    const payload = {
      assistantId: assistantId,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.patch(url, payload, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to assign assistant to number',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removePhoneNumber(phoneNumberId: string): Promise<void> {
    const url = `https://api.vapi.ai/phone-number/${phoneNumberId}`;

    try {
      await lastValueFrom(
        this.httpService.delete(url, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
          },
        }),
      );
    } catch (error) {
      console.error(`Error deleting phone number: ${error.message}`);
    }
  }

  async getCallRecording(callId: string): Promise<any> {
    const url = `https://api.vapi.ai/call/${callId}`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.vapiToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      const responseData = response.data;

      const duration = responseData.artifact?.messages?.length
        ? responseData.artifact.messages[responseData.artifact.messages.length - 1]?.secondsFromStart || 0
        : 0;

      const callStatus = responseData.status;
      let recordingStatus = 'missed-call';

      if (callStatus === 'ended' && duration > 0 && responseData.endedReason === 'customer-ended-call') {
        recordingStatus = 'completed';
      } else if (callStatus === 'ringing' && duration === 0) {
        recordingStatus = 'missed-call';
      } else if (callStatus === 'ended' && responseData.endedReason === 'silence-timed-out' && duration > 0) {
        recordingStatus = 'voice-mail';
      } else if (callStatus === 'ended' && responseData.endedReason === 'silence-timed-out' && duration === 0) {
        recordingStatus = 'escalated';
      } else if (callStatus === 'ended' && responseData.endedReason === 'customer-ended-call' && duration === 0 && responseData.type === 'inboundPhoneCall') {
        recordingStatus = 'missed-call';
      }

      return {
        type: responseData.type === 'outboundPhoneCall' ? 'Outbound' : 'Inbound',
        customer_phone: responseData.customer?.number,
        recording_url: responseData.recordingUrl,
        summary: JSON.stringify(responseData.summary),
        duration: duration,
        status: recordingStatus,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to get call recording',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
