import { Injectable } from '@nestjs/common';
import { MailProducerService } from '../mail/mail-producer.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
    constructor(
        private readonly mailProducerService: MailProducerService
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        await this.mailProducerService.sendDailyJobsEmail('nguyenvana@gmail.com', []);
    }
}
