import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { AuthPage } from './components/auth/AuthPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentConcerns } from './components/student/StudentConcerns';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationDrawer } from './components/shared/NotificationDrawer';
import { QrMealPassModal } from './components/shared/QrMealPassModal';
import { AboutSystemModal } from './components/shared/AboutSystemModal';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, toastMessage } = useApp();

  const [studentView, setStudentView] = useState<'dashboard' | 'concerns'>('dashboard');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQrPassOpen, setIsQrPassOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // If not logged in, display the authentic Registration & Sign In landing page!
  if (!currentUser) {
    return (
      <>
        <AuthPage onOpenAbout={() => setIsAboutOpen(true)} />
        <AboutSystemModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#114232] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center space-x-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#88AB8E] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // Once authenticated, display the user's specific pillar portal
  return (
    <div className="min-h-screen bg-[#F8F9F5] text-gray-900 flex flex-col font-sans selection:bg-[#114232] selection:text-white pb-20 lg:pb-12">
      
      {/* Authenticated Global Header */}
      <Header
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenQrPass={() => setIsQrPassOpen(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Pillar 1: Student Portal */}
        {currentUser.role === 'student' && (
          <div>
            {/* Student Sub Navigation: Today's Meals vs Doubts Tracker */}
            <div className="flex items-center space-x-2 mb-5">
              <button
                onClick={() => setStudentView('dashboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  studentView === 'dashboard'
                    ? 'bg-[#114232] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Today's Meals & Intent Registration
              </button>
              <button
                onClick={() => setStudentView('concerns')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  studentView === 'concerns'
                    ? 'bg-[#114232] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                My Doubts & Concerns Tracker
              </button>
            </div>

            {studentView === 'dashboard' ? (
              <StudentDashboard 
                onNavigateToConcerns={() => setStudentView('concerns')}
                onOpenQrPass={() => setIsQrPassOpen(true)}
              />
            ) : (
              <StudentConcerns />
            )}
          </div>
        )}

        {/* Pillar 2: Mess Staff & Maharaj Portal */}
        {currentUser.role === 'manager' && (
          <ManagerDashboard />
        )}

        {/* Pillar 3: Mess Committee & Administrator Portal */}
        {currentUser.role === 'admin' && (
          <AdminDashboard />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-gray-700 font-medium">
            <span className="font-black text-[#114232]">MessMitra</span>
            <span>•</span>
            <span>Ideathon 2026 [Blast]</span>
            <span>•</span>
            <span>IIT (BHU) Varanasi</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-[#596A7A]">
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-[#114232] font-semibold"
            >
              System Blueprint & Slide Flow
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <BottomNav
        currentView={currentUser.role === 'student' ? studentView : 'dashboard'}
        onChangeView={(view) => {
          if (currentUser.role === 'student') {
            setStudentView(view === 'concerns' ? 'concerns' : 'dashboard');
          }
        }}
        onOpenQrPass={() => setIsQrPassOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />

      {/* Real-time Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onSelectConcern={(id) => {
          if (currentUser.role === 'student') {
            setStudentView('concerns');
          }
        }}
      />

      {/* QR Pass Modal */}
      <QrMealPassModal
        isOpen={isQrPassOpen}
        onClose={() => setIsQrPassOpen(false)}
      />

      {/* About Ideathon Presentation Modal */}
      <AboutSystemModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Real-time Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-18 lg:bottom-5 right-5 z-50 bg-[#114232] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center space-x-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#88AB8E] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
