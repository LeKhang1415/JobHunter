import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { MailerService } from "@nestjs-modules/mailer";

@Processor('daily-job-emails')
export class MailProcessor extends WorkerHost {
    constructor(private readonly mailerService: MailerService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { userEmail, jobs } = job.data;
        console.log('Bắt đầu quy trình gửi email cho:', userEmail);

        const jobsHtml = jobs.map(j => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif;">
                <h3 style="color: #2563eb; margin-top: 0;">${j.name}</h3>
                <p><strong>🏢 Công ty:</strong> ${j.company?.name || 'Đang cập nhật'}</p>
                <p><strong>💰 Mức lương:</strong> ${j.salary} $</p>
                <p><strong>🛠 Kỹ năng:</strong> ${j.skills?.map(s => s.name).join(', ') || 'Chưa rõ'}</p>
            </div>
        `).join('');

        const htmlTemplate = `
            <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; color: #333;">
                <h2 style="color: #1e40af;">Chào bạn,</h2>
                <p>JobHunter xin thông báo: Hôm nay có <strong>${jobs.length} việc làm mới</strong> rất phù hợp với bộ kỹ năng của bạn!</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                ${jobsHtml}
                <p style="margin-top: 30px;">Chúc bạn một ngày làm việc hiệu quả và sớm tìm được công việc ưng ý,<br><strong>Đội ngũ JobHunter</strong></p>
            </div>
        `;

        try {
            await this.mailerService.sendMail({
                to: userEmail,
                from: '"JobHunter Team" <noreply@jobhunter.com>',
                subject: '🔥 Cơ Hội Việc Làm Mới Dành Riêng Cho Bạn Hôm Nay!',
                html: htmlTemplate,
            });
            console.log(`Đã gửi email thành công tới ${userEmail}!`);
        } catch (error) {
            console.error(`Lỗi khi gửi email cho ${userEmail}:`, error);
            throw error;
        }
    }
}
