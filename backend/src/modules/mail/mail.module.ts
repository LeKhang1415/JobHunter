import { Module } from '@nestjs/common';
import { MailProducerService } from './mail-producer.service';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [BullModule.registerQueue({
        name: 'daily-job-emails',
    })],
    providers: [MailProducerService, MailProcessor],
    exports: [MailProducerService]
})
export class MailModule { }
