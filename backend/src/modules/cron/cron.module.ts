import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [CronService]
})
export class CronModule { }
