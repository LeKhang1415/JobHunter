import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    sessionId: string

    @Column()
    deviceName: string

    @Column()
    deviceType: string

    @Column()
    userAgent: string

    @Column()
    loginAt: Date
}