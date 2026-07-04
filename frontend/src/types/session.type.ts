export interface SessionResponse {
    isCurrent: boolean;
    sessionId: string;
    deviceName: string;
    deviceType: string;
    userAgent: string;
    loginAt: string;
}
