import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { VapiService } from './vapi.service';

@Injectable()
export class QueueService {
    constructor(@InjectQueue('call-queue') 
    private callQueue: Queue,
    private vapiService: VapiService
) {
        console.log('Queue Service Initialized');
        this.callQueue.process(async (job) => {
            console.log('Processing job:', job.id);
            console.log('Job data:', job.data);
            const { contactNumber, assistantId, phoneNumber } = job.data;
            await this.vapiService.callCustomer(contactNumber, assistantId, phoneNumber);
            console.log('Job completed:', job.id);

        });

        this.callQueue.on('waiting', (jobId) => {
            console.log(`Job ${jobId} is waiting`);
        });

        this.callQueue.on('active', (job) => {
            console.log(`Job ${job.id} has started processing`);
        });

        this.callQueue.on('completed', (job) => {
            console.log(`Job ${job.id} has completed successfully`);
        });

        this.callQueue.on('failed', (job, error) => {
            console.log(`Job ${job.id} has failed with error:`, error);
        });
    }

    async addCallJob(contactNumber: string, assistantId: string, phoneNumber: string) {
        const randomDelay = Math.floor(Math.random() * (30000 - 5000) + 5000);
        // const fixedDelay = 10000; // 10 seconds delay
        // console.log('Adding job to queue with delay ->:', fixedDelay);
        await this.callQueue.add(
            { contactNumber, assistantId, phoneNumber },
            { delay: randomDelay }
        );
    }
}
