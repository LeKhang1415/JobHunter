import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Skill } from '../skills/entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber, Skill])],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService]
})
export class SubscribersModule { }
