import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ResumeNotificationProducer } from './resume-notification.producer';
import { ResumeNotificationProcessor } from './resume-notification.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'resume-notifications',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 500,
        removeOnFail: 2000,
      },
    }),
  ],
  providers: [
    ResumeNotificationProducer,
    ResumeNotificationProcessor,
  ],
  exports: [ResumeNotificationProducer],
})
export class ResumeNotificationModule {}
