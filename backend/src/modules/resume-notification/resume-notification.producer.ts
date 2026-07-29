import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

export enum ResumeNotificationJobType {
  APPROVED = 'resume.approved',
  REJECTED = 'resume.rejected',
  REVIEWING = 'resume.reviewing',
}

export interface ResumeNotificationPayload {
  candidateEmail: string;
  candidateName: string;
  jobName: string;
  companyName: string;
  resumeId: string;
}

@Injectable()
export class ResumeNotificationProducer {
  private readonly logger = new Logger(ResumeNotificationProducer.name);

  constructor(
    @InjectQueue('resume-notifications')
    private readonly queue: Queue,
  ) { }

  async notifyApproved(payload: ResumeNotificationPayload): Promise<void> {
    await this.queue.add(ResumeNotificationJobType.APPROVED, payload, {
      priority: 1,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 30_000,
      },
      removeOnComplete: 500,
      removeOnFail: 2000,
    });

    this.logger.log(
      `[APPROVED] Queued notification for ${payload.candidateEmail} — Job: "${payload.jobName}"`,
    );
  }

  async notifyRejected(payload: ResumeNotificationPayload): Promise<void> {
    const DELAY_24H = 24 * 60 * 60 * 1000;

    await this.queue.add(ResumeNotificationJobType.REJECTED, payload, {
      priority: 10,
      delay: DELAY_24H,
      attempts: 3,
      backoff: { type: 'exponential', delay: 30_000 },
      removeOnComplete: 500,
      removeOnFail: 2000,
    });

    this.logger.log(
      `[REJECTED] Queued notification for ${payload.candidateEmail} — will send after 24h`,
    );
  }

  async notifyReviewing(payload: ResumeNotificationPayload): Promise<void> {
    await this.queue.add(ResumeNotificationJobType.REVIEWING, payload, {
      priority: 5,
      attempts: 2,
      backoff: { type: 'fixed', delay: 60_000 },
      removeOnComplete: 100,
      removeOnFail: 1000,
    });

    this.logger.log(
      `[REVIEWING] Queued notification for ${payload.candidateEmail}`,
    );
  }
}
