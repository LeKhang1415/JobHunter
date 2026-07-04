import { Monitor, Clock, ShieldCheck, Smartphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DeleteConfirmDialog } from '@/components/custom/DeleteConfirmationDialog';

export interface SessionItemProps {
  isCurrentSession?: boolean;
  deviceName: string; // From BE: e.g. "Windows - Chrome"
  deviceType: string;
  userAgent: string;
  loginAt: string | Date;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

export const SessionItem = ({
  isCurrentSession = false,
  deviceName,
  deviceType = 'desktop',
  userAgent,
  loginAt,
  onLogout,
  isLoggingOut = false,
}: SessionItemProps) => {
  const formattedTime = (() => {
    try {
      const dateObj = loginAt instanceof Date ? loginAt : new Date(loginAt);
      if (isNaN(dateObj.getTime())) {
        return String(loginAt);
      }
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi });
    } catch {
      return String(loginAt);
    }
  })();

  const [osName, browserName] = deviceName.includes(' - ')
    ? deviceName.split(' - ')
    : ['Unknown OS', deviceName];
  const displayTitle = browserName && osName !== 'Unknown OS' ? `${browserName} on ${osName}` : deviceName;

  return (
    <div
      className={`p-5 md:p-6 rounded-xl border ${isCurrentSession
        ? 'bg-green-50/60 border-green-300 shadow-sm'
        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
        } transition-all duration-200`}
    >
      <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start">
        {/* Device & OS */}
        <div className="flex gap-4 flex-1">
          <div className={`p-3 rounded-xl shadow-sm border h-fit flex items-center justify-center ${isCurrentSession ? 'bg-green-100 border-green-200 text-green-600' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
            {deviceType === 'desktop' ? (
              <Monitor className="w-6 h-6" strokeWidth={1.8} />
            ) : (
              <Smartphone className="w-6 h-6" strokeWidth={1.8} />
            )}
          </div>
          <div className="pt-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1.5">{displayTitle}</h3>
            <p className="text-gray-600 text-sm flex items-center gap-2 font-medium">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isCurrentSession ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`}></span>
              {browserName} • {osName}
            </p>
          </div>
        </div>

        {/* Vertical Divider (Desktop only) */}
        <div className={`hidden md:block w-px h-14 mt-1 ${isCurrentSession ? 'bg-green-200' : 'bg-gray-200'}`}></div>

        {/* Login Time */}
        <div className="flex gap-3 md:w-1/3 pt-1">
          <div className={`p-2 rounded-lg h-fit flex items-center justify-center ${isCurrentSession ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
            <Clock className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">Đăng nhập lúc</p>
            <p className="text-gray-900 font-semibold text-sm first-letter:uppercase">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <hr className={`my-5 ${isCurrentSession ? 'border-green-200/80' : 'border-gray-200'}`} />

      {/* User Agent */}
      <div className={`p-4 rounded-lg border ${isCurrentSession ? 'bg-white/70 border-green-100' : 'bg-gray-50 border-gray-200'} mb-4 shadow-sm`}>
        <p className="text-gray-500 font-bold mb-2 text-xs uppercase tracking-wider">Chi tiết trình duyệt:</p>
        <p className="text-gray-800 text-xs break-all leading-relaxed font-mono font-medium">
          {userAgent}
        </p>
      </div>

      {/* Current Session Alert OR Logout Button */}
      {isCurrentSession ? (
        <div className="bg-green-100 rounded-lg p-4 flex gap-3 items-center border border-green-300 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-green-700 flex-shrink-0" strokeWidth={2} />
          <p className="text-green-800 font-bold text-sm">Đây là phiên đăng nhập hiện tại của bạn</p>
        </div>
      ) : (
        <div className="flex justify-end pt-2">
          <DeleteConfirmDialog
            onConfirm={() => {
              if (onLogout) onLogout();
            }}
            title="Đăng xuất thiết bị?"
            description="Bạn có chắc chắn muốn đăng xuất khỏi thiết bị này? Người dùng trên thiết bị đó sẽ phải đăng nhập lại."
          >
            <button
              disabled={isLoggingOut}
              className="px-5 py-2.5 text-sm font-bold text-red-600 bg-white rounded-lg border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất thiết bị này"}
            </button>
          </DeleteConfirmDialog>
        </div>
      )}
    </div>
  );
};
