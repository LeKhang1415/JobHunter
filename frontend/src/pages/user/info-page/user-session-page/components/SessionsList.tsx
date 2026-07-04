import type { SessionResponse } from '@/types/session.type';
import { SessionItem } from './SessionItem';

interface SessionsListProps {
    sessions: SessionResponse[];
    onLogout: (sessionId: string) => void;
    isLoggingOut?: string | null;
}

export const SessionsList = ({ sessions, onLogout, isLoggingOut }: SessionsListProps) => {

    return (
        <div className="flex flex-col gap-6">
            {sessions.map((session) => (
                <SessionItem
                    key={session.sessionId}
                    isCurrentSession={session.isCurrent}
                    deviceName={session.deviceName}
                    loginAt={session.loginAt}
                    userAgent={session.userAgent}
                    deviceType={session.deviceType}
                    onLogout={() => onLogout(session.sessionId)}
                    isLoggingOut={isLoggingOut === session.sessionId}
                />
            ))}
        </div>
    );
};
