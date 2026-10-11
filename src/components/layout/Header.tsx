import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Building2, 
  UserCheck, 
  ChefHat, 
  ShieldCheck, 
  Bell, 
  Info, 
  CheckCircle2, 
  ChevronDown, 
  LogOut,
  Sparkles,
  QrCode,
  Phone,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenNotifications: () => void;
  onOpenQrPass?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAbout, 
  onOpenNotifications, 
  onOpenQrPass 
}) => {
  const { 
    currentInstitution, 
    currentUser, 
    logout, 
    unreadNotificationsCount 
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Current Campus */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#114232] flex items-center justify-center text-white shadow-xs">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-[#88AB8E]" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#114232]">
                  Mess<span className="text-[#D96B43]">Mitra</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E3EFE9] text-[#114232]">
                  {currentInstitution.shortCode}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#596A7A] hidden sm:block font-medium truncate max-w-xs">
                {currentInstitution.name}
              </p>
            </div>
          </div>

          {/* Active Role & Status Indicator in center */}
          <div className="hidden md:flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-2xs ${
              currentUser.role === 'student' ? 'bg-[#E3EFE9] text-[#114232]' :
              currentUser.role === 'manager' ? 'bg-[#FFEDD5] text-[#C2410C]' :
              'bg-blue-100 text-blue-900'
            }`}>
              {currentUser.role === 'student' && <UserCheck className="w-3.5 h-3.5" />}
              {currentUser.role === 'manager' && <ChefHat className="w-3.5 h-3.5" />}
              {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
              <span className="capitalize">
                {currentUser.role === 'student' ? `Student Portal (${currentUser.studentId})` :
                 currentUser.role === 'manager' ? `Mess Staff Portal (${currentUser.hostel})` :
                 `Administrator In-Charge (${currentUser.adminStaffId})`}
              </span>
            </span>
          </div>

          {/* Right Action Icons: QR Pass (if student), Notifications, About, User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {currentUser.role === 'student' && onOpenQrPass && (
              <button
                onClick={onOpenQrPass}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#E3EFE9] text-[#114232] hover:bg-[#d5e7dd] text-xs font-bold flex items-center space-x-1.5 transition-colors"
                title="Open Student QR Meal Pass"
              >
                <QrCode className="w-4 h-4 text-[#114232]" />
                <span className="hidden sm:inline">Meal Pass</span>
              </button>
            )}

            {/* About System button */}
            <button
              onClick={onOpenAbout}
              className="p-2 sm:p-2.5 rounded-xl text-[#596A7A] hover:text-[#114232] hover:bg-[#F8F9F5] transition-colors"
              title="About MessMitra System"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 sm:p-2.5 rounded-xl text-[#596A7A] hover:text-[#114232] hover:bg-[#F8F9F5] transition-colors"
              title="Real-time notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D96B43] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile & Logout Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 pl-2 pr-2 py-1.5 rounded-xl hover:bg-[#F8F9F5] border border-gray-200 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white ${
                  currentUser.role === 'student' ? 'bg-[#114232]' :
                  currentUser.role === 'manager' ? 'bg-[#D96B43]' : 'bg-[#1E3A8A]'
                }`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-gray-900 leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-[#596A7A] capitalize leading-none">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#596A7A] hidden sm:block" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="pb-3 border-b border-gray-100 space-y-1">
                    <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
                    <p className="text-[11px] text-[#596A7A]">{currentUser.email}</p>
                    
                    {currentUser.studentId && (
                      <div className="text-[11px] font-semibold text-[#114232] bg-[#E3EFE9] inline-block px-2 py-0.5 rounded">
                        {currentInstitution.studentIdLabel}: {currentUser.studentId}
                      </div>
                    )}
                    {currentUser.adminStaffId && (
                      <div className="text-[11px] font-semibold text-blue-900 bg-blue-50 inline-block px-2 py-0.5 rounded">
                        Staff ID: {currentUser.adminStaffId}
                      </div>
                    )}
                    {currentUser.messLicense && (
                      <div className="text-[10px] font-semibold text-[#C2410C] bg-[#FFEDD5] inline-block px-2 py-0.5 rounded font-mono">
                        Lic: {currentUser.messLicense}
                      </div>
                    )}

                    {currentUser.hostel && (
                      <p className="text-[11px] text-gray-600 mt-1">
                        Hostel: <span className="font-semibold">{currentUser.hostel}</span> {currentUser.roomNumber ? `(Room ${currentUser.roomNumber})` : ''}
                      </p>
                    )}

                    {currentUser.phoneNumber && (
                      <p className="text-[11px] text-gray-600 flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        <span>{currentUser.phoneNumber}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
