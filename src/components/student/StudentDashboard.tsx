import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  HelpCircle, 
  ShieldCheck, 
  Eye, 
  QrCode, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Info,
  DollarSign,
  Utensils,
  Leaf,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { MealMenu, MealType } from '../../types';

interface StudentDashboardProps {
  onNavigateToConcerns: () => void;
  onOpenQrPass: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  onNavigateToConcerns,
  onOpenQrPass 
}) => {
  const { 
    currentUser, 
    currentInstitution, 
    menus, 
    registerMealIntent, 
    getUserMealRegistration,
    concerns 
  } = useApp();

  const [activeMealType, setActiveMealType] = useState<MealType>('lunch');
  const [showSupplierDetails, setShowSupplierDetails] = useState(false);

  if (!currentUser) return null;

  const activeMenu = menus.find(m => m.mealType === activeMealType) || menus[0];
  const userRegistration = activeMenu ? getUserMealRegistration(activeMenu.id) : undefined;
  const isEating = userRegistration?.status === 'eating';
  const isSkipping = userRegistration?.status === 'skipping';

  // Count active student concerns
  const myConcerns = concerns.filter(c => c.studentUid === currentUser.uid);
  const activeConcernsCount = myConcerns.filter(c => c.status !== 'resolved').length;

  const handleRegister = (status: 'eating' | 'skipping') => {
    if (!activeMenu) return;
    registerMealIntent(activeMenu.id, status);
    if (status === 'eating') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#114232', '#88AB8E', '#D96B43'],
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#114232] to-[#1C5240] rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#DCE7DD] text-xs font-semibold">
                {currentInstitution.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D96B43]/90 text-white text-xs font-semibold">
                {currentUser.hostel || 'Hostel Mess'}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
              Namaste, {currentUser.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-[#DCE7DD] mt-1 max-w-xl">
              {currentInstitution.studentIdLabel}: <span className="font-mono font-bold text-white">{currentUser.studentId}</span> • Room {currentUser.roomNumber || 'A-214'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenQrPass}
              className="px-4 py-2.5 bg-white text-[#114232] hover:bg-[#F8F9F5] rounded-xl font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
            >
              <QrCode className="w-4 h-4 text-[#114232]" />
              <span>Digital Meal Pass</span>
            </button>
            <button
              onClick={onNavigateToConcerns}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs flex items-center space-x-2 transition-colors relative"
            >
              <HelpCircle className="w-4 h-4 text-[#88AB8E]" />
              <span>Track Concerns</span>
              {activeConcernsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#D96B43] animate-ping" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Meal Selection Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {menus.map((m) => {
          const isSelected = m.mealType === activeMealType;
          const reg = getUserMealRegistration(m.id);
          return (
            <button
              key={m.id}
              onClick={() => setActiveMealType(m.mealType)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize flex items-center space-x-2 whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#114232] text-white border-[#114232] shadow-xs'
                  : 'bg-white text-[#596A7A] hover:bg-[#F8F9F5] border-[#E2E8F0]'
              }`}
            >
              <span>{m.mealType}</span>
              {reg?.status === 'eating' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
              {reg?.status === 'skipping' && (
                <span className="w-2 h-2 rounded-full bg-[#D96B43]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Core Hero: Meal Registration & Today's Menu */}
      {activeMenu && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main 2-Col Card: Intent Registration + Dishes */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            
            {/* Live Meal Picture Uploaded by Mess Manager */}
            {activeMenu.photoUrl && (
              <div className="relative aspect-video sm:aspect-21/9 overflow-hidden bg-gray-900 group">
                <img
                  src={activeMenu.photoUrl}
                  alt={activeMenu.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#114232] text-white text-[10px] font-bold flex items-center space-x-1 shadow-xs border border-white/20">
                      <Camera className="w-3 h-3 text-[#88AB8E]" />
                      <span>Actual Meal Photo • Uploaded by Mess Maharaj</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-medium">
                      {activeMenu.dishes.length} items on menu
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                    {activeMenu.title}
                  </h3>
                </div>
              </div>
            )}

            {/* Header info bar */}
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-[#FAFBF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-[#D96B43] uppercase tracking-wider">
                    {activeMenu.dayName} • {activeMenu.mealType}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-[#596A7A] flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {activeMenu.timing}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {activeMenu.title}
                </h2>
              </div>

              {/* Registration Cutoff Warning */}
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs font-semibold self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-[#D96B43]" />
                <span>Cut-off: {activeMenu.cutoffTime}</span>
              </div>
            </div>

            {/* Interactive Registration Buttons (Pillar 1 Core Feature) */}
            <div className="p-5 sm:p-6 bg-white border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Are you eating {activeMenu.mealType}?
                  </h3>
                  <p className="text-xs text-[#596A7A] mt-0.5">
                    Your response helps the mess kitchen prepare exact quantities and eliminate waste.
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleRegister('eating')}
                    className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                      isEating
                        ? 'bg-[#114232] text-white ring-2 ring-[#114232]/20 shadow-sm'
                        : 'bg-[#E3EFE9] text-[#114232] hover:bg-[#d2e5da]'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${isEating ? 'text-white' : 'text-[#114232]'}`} />
                    <span>{isEating ? "I'll eat this meal ✓" : "I'll eat this meal"}</span>
                  </button>

                  <button
                    onClick={() => handleRegister('skipping')}
                    className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                      isSkipping
                        ? 'bg-[#D96B43] text-white ring-2 ring-[#D96B43]/20 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>{isSkipping ? "Skipping marked ✓" : "Skip meal"}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="mt-4 p-3 rounded-xl bg-[#F8F9F5] border border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-600">Current intent status:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                  isEating ? 'bg-emerald-100 text-emerald-800' :
                  isSkipping ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {isEating ? "Serving Reserved (Registered)" :
                   isSkipping ? "Skipped (Meal saved from prep)" :
                   "Pending Choice"}
                </span>
              </div>
            </div>

            {/* Dishes & Meal Photo */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#596A7A]">
                  Menu Items & Student Popularity
                </h4>
                <button
                  onClick={() => setShowSupplierDetails(!showSupplierDetails)}
                  className="text-xs font-bold text-[#114232] hover:underline flex items-center space-x-1"
                >
                  <Leaf className="w-3.5 h-3.5 text-[#114232]" />
                  <span>{showSupplierDetails ? "Hide Ingredients" : "View Ingredients & Brands"}</span>
                </button>
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeMenu.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-xl border border-gray-100 bg-[#FAFBF9] hover:bg-white hover:border-[#114232]/20 hover:shadow-xs transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100/60 text-[#114232] flex items-center justify-center font-bold text-xs">
                        <Utensils className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-gray-900 flex items-center space-x-1.5">
                          <span>{dish.name}</span>
                          {dish.isSpecial && (
                            <span className="text-[10px] bg-[#D96B43] text-white px-1.5 py-0.2 rounded font-bold">
                              Special
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 capitalize">{dish.category}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-[#114232]">{dish.popularityPercent}%</div>
                      <div className="text-[9px] text-gray-400">popularity</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Supplier & Ingredient Transparency Drawer (Page 6 & 7) */}
              {showSupplierDetails && (
                <div className="mt-5 p-4 rounded-xl bg-[#F4F7F5] border border-[#DCE7DD] animate-in fade-in duration-150">
                  <div className="flex items-center space-x-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-[#114232]" />
                    <h5 className="font-bold text-xs text-[#114232] uppercase tracking-wider">
                      Verified Supplier & Quality Traceability
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeMenu.suppliers.map((s, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-lg border border-gray-200">
                        <div className="font-bold text-gray-900">{s.ingredient}</div>
                        <div className="text-[11px] text-[#596A7A] mt-0.5">
                          Brand: <span className="font-semibold text-gray-800">{s.brand}</span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Supplier: {s.supplier} {s.certifications ? `(${s.certifications})` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Semester Fee Overview + Concerns Widget */}
          <div className="space-y-6">
            
            {/* Semester Fee Overview */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#596A7A]">
                  Semester Fee Overview
                </h3>
                <span className="text-[11px] font-mono font-bold text-[#114232]">
                  ₹{currentUser.semesterFee?.toLocaleString() || '24,000'}
                </span>
              </div>

              {/* Meter graphic */}
              <div className="mt-4 flex flex-col items-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#114232]"
                      strokeDasharray={`${currentUser.estimatedValueConsumed || 76}, 100`}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-gray-900">
                      {currentUser.estimatedValueConsumed || 76}%
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Consumed</span>
                  </div>
                </div>

                <div className="w-full mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#114232] mr-2" />
                      Est. value consumed
                    </span>
                    <span className="font-bold text-gray-900">
                      ₹{Math.round(((currentUser.semesterFee || 24000) * (currentUser.estimatedValueConsumed || 76)) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-2" />
                      Est. unused balance
                    </span>
                    <span className="font-bold text-gray-700">
                      ₹{Math.round(((currentUser.semesterFee || 24000) * (100 - (currentUser.estimatedValueConsumed || 76))) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fee Transparency Note */}
              <div className="mt-4 p-2.5 bg-[#FFF8F0] border border-[#FFE4CC] rounded-xl text-[10px] text-[#A3471B] leading-relaxed flex items-start space-x-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#D96B43]" />
                <span>
                  <strong>Important:</strong> Meal value is an estimate — not a refund, saving, or official fee accounting.
                </span>
              </div>
            </div>

            {/* Quick Concerns Tracker Widget */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#596A7A]">
                  My Feedback & Concerns
                </h3>
                <button
                  onClick={onNavigateToConcerns}
                  className="text-xs font-bold text-[#114232] hover:underline flex items-center"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              {myConcerns.length === 0 ? (
                <div className="text-center py-4 text-xs text-gray-500">
                  No concerns posted yet. Have a doubt about meals or hygiene?
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myConcerns.slice(0, 2).map(c => (
                    <div 
                      key={c.id}
                      onClick={onNavigateToConcerns}
                      className="p-3 rounded-xl border border-gray-100 bg-[#FAFBF9] hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-gray-400">#{c.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'action_taken' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'under_review' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-semibold text-xs text-gray-900 line-clamp-1">{c.title}</p>
                      {c.resolutionSummary && (
                        <p className="text-[10px] text-emerald-700 mt-1 line-clamp-1">
                          ✓ {c.resolutionSummary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={onNavigateToConcerns}
                className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-[#114232] text-xs font-bold text-[#114232] hover:bg-[#F8F9F5] transition-all flex items-center justify-center space-x-1.5"
              >
                <span>+ Report Food / Mess Concern</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
