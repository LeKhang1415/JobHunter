import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { MailModule } from '../mail/mail.module';
import { JobModule } from '../job/job.module';
import { SubscribersModule } from '../subscriber/subscriber.module';

@Module({
  imports: [MailModule, JobModule, SubscribersModule],
  providers: [CronService]
})
export class CronModule { }
