import { SessionItem } from './SessionItem';

export const SessionsList = () => {
    const mockSessions = [
        {
            sessionId: 1,
            isCurrentSession: true,
            deviceName: 'Windows - Chrome',
            loginAt: new Date(),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            deviceType: 'desktop' as const,
        },
        {
            sessionId: 2,
            isCurrentSession: false,
            deviceName: 'iOS - Safari',
            loginAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
            deviceType: 'mobile' as const,
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            {mockSessions.map((session) => (
                <SessionItem
                    key={session.sessionId}
                    isCurrentSession={session.isCurrentSession}
                    deviceName={session.deviceName}
                    loginAt={session.loginAt}
                    userAgent={session.userAgent}
                    deviceType={session.deviceType}
                />
            ))}
        </div>
    );
};
