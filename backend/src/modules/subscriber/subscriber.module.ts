import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Skill } from '../skills/entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber, Skill])],
  controllers: [SubscriberService],
  providers: [SubscriberService],
})
export class SubscribersModule { }
