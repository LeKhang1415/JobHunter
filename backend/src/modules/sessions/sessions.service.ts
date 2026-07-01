import { Injectable } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {

    constructor(
    ) { }

    private buildKey(token: string, userId: string): string {
        return `auth::refesh_token`
    }
}
