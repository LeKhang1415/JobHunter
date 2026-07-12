import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobService } from '../modules/job/job.service';
import { SubscriberService } from '../modules/subscriber/subscriber.service';
import { MailProducerService } from '../modules/mail/mail-producer.service';

@Injectable()
export class MailCronService {
    constructor(
        private readonly jobService: JobService,
        private readonly subscriberService: SubscriberService,
        private readonly mailProducerService: MailProducerService,
    ) { }

    @Cron('0 7 * * *', { timeZone: 'Asia/Ho_Chi_Minh' })
    async handleCron() {
        const newJobs = await this.jobService.getNewJobs();

        if (newJobs.length === 0) return;

        const subscribers = await this.subscriberService.getSubscribersWithSkills();

        for (const subscriber of subscribers) {
            const subSkillIds = subscriber.skills.map(s => s.id);

            const matchingJobs = newJobs.filter(job =>
                job.skills.some(jobSkill => subSkillIds.includes(jobSkill.id))
            );

            if (matchingJobs.length > 0) {
                await this.mailProducerService.sendDailyJobsEmail(subscriber.email, matchingJobs);
            }
        }
    }
}
