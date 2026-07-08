import type { SessionResponse } from '@/types/session.type';
import { SessionsList } from './components/SessionsList';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/features/slices/auth/authThunk';
import { getAllUserSessionsApi, removeSessionApi } from '@/services/sessionApi';
import { Loader2 } from 'lucide-react';

export default function SecurityPage() {

  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);

      const res = (await getAllUserSessionsApi()).data;
      const sortedSessions = res.result.sort(
        (a: SessionResponse, b: SessionResponse) => {
          if (a.isCurrent && !b.isCurrent) return -1;
          if (!a.isCurrent && b.isCurrent) return 1;
          return new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime();
        },
      );

      setSessions(sortedSessions);
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Không thể lấy danh sách phiên đăng nhập."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogoutSession = async (sessionId: string) => {
    try {
      setIsLoggingOut(sessionId);
      await removeSessionApi(sessionId);
      toast.success("Đăng xuất phiên thành công");
      fetchSessions();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể đăng xuất phiên này"));
    } finally {
      setIsLoggingOut(null);
    }
  };


  return (
    <div className="min-h-screen pb-10">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Phiên đăng nhập</h1>
          <p className="text-gray-600">
            Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
            <p className="font-medium">Đang tải thông tin phiên đăng nhập...</p>
          </div>
        ) : (
          <SessionsList
            sessions={sessions}
            onLogout={handleLogoutSession}
            isLoggingOut={isLoggingOut}
          />
        )}
      </div>
    </div>
  );
}
