import { Monitor, Clock, ShieldCheck, Smartphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export interface SessionItemProps {
  isCurrentSession?: boolean;
  deviceName: string; // From BE: e.g. "Windows - Chrome"
  deviceType: string;
  userAgent: string;
  loginAt: string | Date;
}

export const SessionItem = ({
  isCurrentSession = false,
  deviceName,
  deviceType = 'desktop',
  userAgent,
  loginAt,
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
      className={`p-6 rounded-xl border ${isCurrentSession
        ? 'bg-orange-50 border-orange-200'
        : 'bg-white border-gray-200 hover:border-orange-200 hover:shadow-sm'
        } transition-all`}
    >
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Device & OS */}
        <div className="flex gap-4 flex-1">
          <div className="mt-0.5">
            {deviceType === 'desktop' ? (
              <Monitor className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
            ) : (
              <Smartphone className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg leading-tight">{displayTitle}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {browserName} • {osName}
            </p>
          </div>
        </div>

        {/* Login Time */}
        <div className="flex gap-3 md:w-1/3">
          <div className="mt-0.5">
            <Clock className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-gray-700 font-medium text-sm leading-tight">Thời gian đăng nhập:</p>
            <p className="text-gray-500 text-sm mt-1 first-letter:uppercase">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* User Agent */}
      <div className="bg-white/80 p-4 rounded-lg text-sm mb-4">
        <p className="text-gray-600 font-medium mb-1.5 text-xs uppercase tracking-wider">Chi tiết trình duyệt:</p>
        <p className="text-gray-500 text-xs break-all leading-relaxed font-mono">
          {userAgent}
        </p>
      </div>

      {/* Current Session Alert */}
      {isCurrentSession && (
        <div className="bg-green-50/50 border border-green-200 rounded-lg p-4 flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-green-700 font-medium text-sm">Đây là phiên đăng nhập hiện tại của bạn</p>
            <p className="text-green-600/80 text-xs mt-1">
              Bạn không thể đăng xuất phiên này. Để đăng xuất, vui lòng sử dụng nút đăng xuất chính.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
