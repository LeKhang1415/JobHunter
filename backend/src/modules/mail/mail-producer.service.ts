import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Job } from '../job/entities/job.entity';

@Injectable()
export class MailProducerService {
    constructor(
        @InjectQueue('daily-job-emails')
        private readonly mailQueue: Queue
    ) { }

    async sendDailyJobsEmail(userEmail: string, jobs: Job[]) {
        await this.mailQueue.add("send-mail", { userEmail, jobs })
    }
}
