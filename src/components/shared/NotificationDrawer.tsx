import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcern?: (concernId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose,
  onSelectConcern 
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    currentUser 
  } = useApp();

  if (!isOpen) return null;
  if (!currentUser) return null;

  // Filter notifications relevant to current user or all if admin
  const userNotifs = notifications.filter(
    n => n.targetUid === currentUser.uid || currentUser.role === 'admin'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-[#114232] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#88AB8E]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Live Notifications</h3>
                <p className="text-[11px] text-[#DCE7DD]">Real-time concern & meal updates</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={markAllNotificationsAsRead}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {userNotifs.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="font-bold">No notifications right now</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  You will receive real-time updates when concerns change status or registration cutoff approaches.
                </p>
              </div>
            ) : (
              userNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.relatedConcernId && onSelectConcern) {
                      onSelectConcern(n.relatedConcernId);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    n.read 
                      ? 'bg-white border-gray-100 text-gray-700' 
                      : 'bg-emerald-50/40 border-emerald-200 text-gray-900 shadow-xs ring-1 ring-emerald-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs flex items-center space-x-1.5">
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#D96B43] shrink-0" />
                      )}
                      <span>{n.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  {n.relatedConcernId && (
                    <div className="mt-2 text-[10px] font-bold text-[#114232] flex items-center">
                      <span>Click to view doubt progress in tracker →</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#F8F9F5] border-t border-gray-100 text-center text-[10px] text-[#596A7A]">
            MessMitra Real-Time Sync Engine Active
          </div>

        </div>
      </div>
    </div>
  );
};
