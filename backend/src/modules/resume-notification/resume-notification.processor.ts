import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ResumeNotificationJobType,
  ResumeNotificationPayload,
} from './resume-notification.producer';


@Processor('resume-notifications', {
  concurrency: 5,
})
export class ResumeNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(ResumeNotificationProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<ResumeNotificationPayload>): Promise<void> {
    this.logger.log(
      `Processing [${job.name}] #${job.id} — attempt ${job.attemptsMade + 1}/${job.opts.attempts}`,
    );
    switch (job.name) {
      case ResumeNotificationJobType.APPROVED:
        return this.handleApproved(job.data);

      case ResumeNotificationJobType.REJECTED:
        return this.handleRejected(job.data);

      case ResumeNotificationJobType.REVIEWING:
        return this.handleReviewing(job.data);

      default:

        throw new Error(`Unknown job type: "${job.name}"`);
    }
  }

  private async handleApproved(data: ResumeNotificationPayload): Promise<void> {
    await this.mailerService.sendMail({
      to: data.candidateEmail,
      from: '"JobHunter" <noreply@jobhunter.com>',
      subject: '🎉 Chúc mừng! Hồ sơ của bạn đã được chấp nhận',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #16a34a;">Chúc mừng, ${data.candidateName}! 🎉</h2>
          <p>
            Hồ sơ của bạn ứng tuyển vị trí <strong>${data.jobName}</strong>
            tại <strong>${data.companyName}</strong> đã được <strong>chấp nhận</strong>.
          </p>
          <p>Nhà tuyển dụng sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
          <p style="color: #6b7280;">— Đội ngũ JobHunter</p>
        </div>
      `,
    });

    this.logger.log(`✅ Approval email sent → ${data.candidateEmail}`);
  }

  private async handleRejected(data: ResumeNotificationPayload): Promise<void> {
    await this.mailerService.sendMail({
      to: data.candidateEmail,
      from: '"JobHunter" <noreply@jobhunter.com>',
      subject: 'Thông báo kết quả ứng tuyển từ JobHunter',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Xin chào ${data.candidateName},</h2>
          <p>
            Cảm ơn bạn đã quan tâm đến vị trí <strong>${data.jobName}</strong>
            tại <strong>${data.companyName}</strong>.
          </p>
          <p>
            Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng
            hồ sơ của bạn chưa phù hợp với yêu cầu của vị trí này ở thời điểm hiện tại.
          </p>
          <p>JobHunter chúc bạn sớm tìm được cơ hội phù hợp!</p>
          <p style="color: #6b7280;">— Đội ngũ JobHunter</p>
        </div>
      `,
    });

    this.logger.log(`📧 Rejection email sent → ${data.candidateEmail}`);
  }

  private async handleReviewing(data: ResumeNotificationPayload): Promise<void> {
    await this.mailerService.sendMail({
      to: data.candidateEmail,
      from: '"JobHunter" <noreply@jobhunter.com>',
      subject: '📋 Hồ sơ của bạn đang được xem xét',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Xin chào ${data.candidateName},</h2>
          <p>
            Hồ sơ ứng tuyển vị trí <strong>${data.jobName}</strong>
            tại <strong>${data.companyName}</strong> đang được nhà tuyển dụng xem xét.
          </p>
          <p>Chúng tôi sẽ thông báo kết quả đến bạn sớm nhất có thể.</p>
          <p style="color: #6b7280;">— Đội ngũ JobHunter</p>
        </div>
      `,
    });

    this.logger.log(`📋 Reviewing email sent → ${data.candidateEmail}`);
  }
}
