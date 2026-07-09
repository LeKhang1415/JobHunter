import { Module } from '@nestjs/common';
import { MailProducerService } from './mail-producer.service';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bullmq';
import { JobModule } from '../job/job.module';
import { SubscribersModule } from '../subscriber/subscriber.module';
import { MailCronService } from '../../cron/mail-cron';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'daily-job-emails',
        }),
        JobModule,
        SubscribersModule,
    ],
    providers: [MailProducerService, MailProcessor, MailCronService],
    exports: [MailProducerService]
})
export class MailModule { }
