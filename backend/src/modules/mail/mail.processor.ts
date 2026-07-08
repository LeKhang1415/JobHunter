import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('daily-job-emails')
export class MailProcessor extends WorkerHost {
    async process(job: Job<any, any, string>): Promise<any> {
        const { userEmail } = job.data
        console.log('Đang xử lý gửi email cho:', userEmail)
    }
}
