import React from 'react';
import { 
  UtensilsCrossed, 
  MessageSquare, 
  ChefHat, 
  Building2, 
  Bell, 
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  currentView: string;
  onChangeView: (view: any) => void;
  onOpenQrPass: () => void;
  onOpenNotifications: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentView, 
  onChangeView, 
  onOpenQrPass,
  onOpenNotifications 
}) => {
  const { currentUser, unreadNotificationsCount } = useApp();

  if (!currentUser) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 py-1.5">
      <div className="flex items-center justify-around">
        
        {/* Main Dashboard */}
        <button
          onClick={() => onChangeView('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-colors ${
            currentView === 'dashboard' ? 'text-[#114232]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {currentUser.role === 'student' ? (
            <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          ) : currentUser.role === 'manager' ? (
            <ChefHat className="w-5 h-5 mb-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 mb-0.5" />
          )}
          <span>Dashboard</span>
        </button>

        {/* Concerns / Doubts */}
        <button
          onClick={() => onChangeView('concerns')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-colors ${
            currentView === 'concerns' ? 'text-[#D96B43]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Concerns</span>
        </button>

        {/* Student QR pass button */}
        {currentUser.role === 'student' && (
          <button
            onClick={onOpenQrPass}
            className="flex flex-col items-center -mt-4 bg-[#114232] text-white p-2.5 rounded-2xl shadow-md border-2 border-white ring-2 ring-[#114232]/20"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[9px] font-black mt-0.5">Pass</span>
          </button>
        )}

        {/* Admin Rules config */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => onChangeView('id_config')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-colors ${
              currentView === 'id_config' ? 'text-[#114232]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span>ID Rules</span>
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold text-gray-400 hover:text-gray-600 relative"
        >
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D96B43] text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <span>Alerts</span>
        </button>

      </div>
    </nav>
  );
};
