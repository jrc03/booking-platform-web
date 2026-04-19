import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationResponseDto } from "../../types/dtos";
import { notificationService } from "../../api/notificationService";
import { signalRNotificationService } from "../../api/signalrService";
import { Bell, CheckCheck, Check } from "lucide-react";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>(
    [],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hidingIds, setHidingIds] = useState<Set<string>>(new Set());
  const dropDownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getUnread();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications ", error);
    }
  }, []);

  // Root Setup: Connect API & SignalR
  useEffect(() => {
    // 1. Initial Load from HTTP
    const initFetch = async () => {
      await fetchNotifications();
    };
    initFetch();

    // 2. Establish persistent Real-Time WebSocket Connection
    signalRNotificationService.startConnection().then(() => {
      signalRNotificationService.onReceiveNotification((newNoti) => {
        // Instantly inject new notifications into the top of the list!
        setNotifications((prev) => [newNoti, ...prev]);
      });
    });

    const handleCliclOutside = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleCliclOutside);
    return () => {
      document.removeEventListener("mousedown", handleCliclOutside);
      // Clean up connection if this layout unmounts (e.g. logging out)
      signalRNotificationService.stopConnection();
    };
  }, [fetchNotifications]);

  // Fetch immediately whenever the user opens the dropdown as a safety net
  useEffect(() => {
    const fetchOnOpen = async () => {
      if (isOpen) {
        await fetchNotifications();
      }
    };
    fetchOnOpen();
  }, [isOpen, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      setHidingIds((prev) => new Set(prev).add(id));
      await notificationService.markAsRead(id);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 200);
    } catch (error) {
      console.error("Failed to mark notification as read ", error);
      setHidingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const allIds = notifications.map((n) => n.id);
      setHidingIds(new Set(allIds));

      await notificationService.markAllAsRead();

      setTimeout(() => {
        setNotifications([]);
        setHidingIds(new Set());
      }, 300);
    } catch (error) {
      console.error("Failed to mark all notifications as read ", error);
      setHidingIds(new Set());
    }
  };

  return (
    <div className="relative" ref={dropDownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-600 hover:text-stone-900 bg-stone-50 rounded-full border border-stone-200 transition-colors"
      >
        <Bell size={18} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50 animate-scale-in origin-top-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50/50">
            <h3 className="font-semibold text-stone-900 text-sm">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs flex items-center gap-1 text-stone-500 hover:text-stone-900 font-light transition-colors"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-stone-500 font-light">
                You're all caught up!
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`transition-all duration-200 ease-in-out border-b border-stone-100 last:border-none origin-right ${
                      hidingIds.has(notification.id)
                        ? "opacity-0 translate-x-4 scale-95"
                        : "opacity-100 translate-x-0 scale-100"
                    }`}
                  >
                    <div className="flex gap-3 p-4 hover:bg-stone-50 transition-colors group">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-stone-800 leading-snug">
                          {notification.message}
                        </p>
                        <p className="text-xs text-stone-400 font-light">
                          {new Date(
                            notification.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all shrink-0 h-fit"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
