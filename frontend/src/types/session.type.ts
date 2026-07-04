export interface SessionResponse {
    redisKey: string;
    isCurrent: boolean;
    sessionId: string;
    deviceName: string;
    deviceType: string;
    userAgent: string;
    loginAt: string;
}
