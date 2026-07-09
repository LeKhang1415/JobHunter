import { Injectable } from '@nestjs/common';
import { MailProducerService } from '../mail/mail-producer.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobService } from '../job/job.service';
import { SubscriberService } from '../subscriber/subscriber.service';

@Injectable()
export class CronService {
    constructor(
        private readonly mailProducerService: MailProducerService,

        private readonly jobService: JobService,

        private readonly subscriberService: SubscriberService,
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        const newJobs = await this.jobService.getNewJobs()

        if (newJobs.length === 0) {
            return
        }

        const subscribers = await this.subscriberService.getSubscribersWithSkills()

        for (const subscriber of subscribers) {
            const subSkillIds = subscriber.skills.map(s => s.id);

            const matchingJobs = newJobs.filter(job =>
                job.skills.some(jobSkill => subSkillIds.includes(jobSkill.id))
            );

            if (matchingJobs.length > 0) {
                await this.mailProducerService.sendDailyJobsEmail(subscriber.email, matchingJobs)
            }
        }

    }
}
