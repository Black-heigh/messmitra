import React, { useState } from 'react';
import { 
  Users, 
  Scale, 
  UtensilsCrossed, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  ChefHat, 
  Sparkles,
  Leaf,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Edit3,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealType, Concern, LeftoverLog } from '../../types';
import { DailyMenuEditor } from './DailyMenuEditor';

export const ManagerDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentInstitution, 
    menus, 
    registrations, 
    concerns, 
    updateConcernStatus,
    leftoverLogs,
    logLeftover,
    historicalAttendance 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'menu_editor' | 'concerns' | 'leftovers'>('overview');
  const [showLogLeftoverModal, setShowLogLeftoverModal] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);

  // Leftover modal fields
  const [wasteWeight, setWasteWeight] = useState<number>(18);
  const [wasteMealType, setWasteMealType] = useState<MealType>('lunch');
  const [primaryDishesInput, setPrimaryDishesInput] = useState('Lauki Sabzi (8kg), Rice (6kg), Roti trimmings (4kg)');
  const [disposalMethod, setDisposalMethod] = useState<LeftoverLog['disposalMethod']>('biogas');
  const [wasteNotes, setWasteNotes] = useState('Transferred to campus biogas unit #2.');

  // Concern resolution modal
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionStage, setActionStage] = useState<'action_taken' | 'resolved'>('action_taken');

  if (!currentUser) return null;

  // Headcount stats
  const todayLunch = menus.find(m => m.mealType === 'lunch') || menus[0];
  const registeredEatingCount = registrations.filter(r => r.mealMenuId === todayLunch?.id && r.status === 'eating').length;
  const registeredSkippingCount = registrations.filter(r => r.mealMenuId === todayLunch?.id && r.status === 'skipping').length;

  const expectedNextMeal = todayLunch?.predictedAttendance || 780;
  const actualLastMeal = 790;
  const lastLeftoverKg = leftoverLogs[0]?.wasteWeightKg || 18;

  const handleSaveLeftover = (e: React.FormEvent) => {
    e.preventDefault();
    logLeftover({
      institutionId: currentInstitution.id,
      hostelId: currentUser.hostel || 'Rajputana Hostel',
      date: new Date().toISOString().split('T')[0],
      mealType: wasteMealType,
      wasteWeightKg: Number(wasteWeight),
      primaryDishes: primaryDishesInput.split(',').map(s => s.trim()),
      disposalMethod,
      notes: wasteNotes,
    });
    setShowLogLeftoverModal(false);
  };

  const handleUpdateConcern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConcern) return;

    updateConcernStatus(selectedConcern.id, actionStage, {
      assignedTo: currentUser.name,
      committeeReviewNote: actionStage === 'action_taken' ? resolutionNote : selectedConcern.committeeReviewNote,
      resolutionSummary: actionStage === 'resolved' ? resolutionNote : selectedConcern.resolutionSummary,
    });
    setSelectedConcern(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] text-xs font-bold flex items-center">
              <ChefHat className="w-3.5 h-3.5 mr-1" />
              Mess Staff & Maharaj Portal
            </span>
            <span className="text-xs text-[#596A7A]">
              • {currentUser.hostel || 'Rajputana Hostel'} Mess
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            Kitchen Preparation & Headcount Command
          </h1>
          <p className="text-xs text-[#596A7A] mt-0.5">
            Turn student meal registrations into exact kitchen batch sizes.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveTab('menu_editor')}
            className="px-4 py-2.5 bg-[#114232] hover:bg-[#0D382B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Camera className="w-4 h-4 text-[#88AB8E]" />
            <span>Edit Daily Menu & Photos</span>
          </button>
          <button
            onClick={() => setShowLogLeftoverModal(true)}
            className="px-3.5 py-2.5 bg-[#D96B43] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Log Leftover</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2.5 bg-[#F8F9F5] hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
            title="Print Kitchen Sheet"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards from Slide 5 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. EXPECTED NEXT MEAL */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#596A7A]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Expected Next Meal</span>
            <Users className="w-4 h-4 text-[#114232]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-gray-900">
            {expectedNextMeal}
          </div>
          <div className="text-[11px] text-[#596A7A] mt-1 flex items-center">
            <span>students • {todayLunch?.dayName} {todayLunch?.mealType}</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded inline-block">
            {registeredSkippingCount} students opted out (food saved)
          </div>
        </div>

        {/* 2. ACTUAL LAST MEAL */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#596A7A]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Actual Last Meal</span>
            <UtensilsCrossed className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-gray-900">
            {actualLastMeal}
          </div>
          <div className="text-[11px] text-[#596A7A] mt-1">
            students • Wed lunch (historical)
          </div>
          <div className="mt-2 text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded inline-block">
            96.3% prediction accuracy
          </div>
        </div>

        {/* 3. LEFTOVER LAST MEAL */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#596A7A]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B43]">Leftover Last Meal</span>
            <Scale className="w-4 h-4 text-[#D96B43]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#D96B43]">
            {lastLeftoverKg} kg
          </div>
          <div className="text-[11px] text-[#596A7A] mt-1">
            recorded by mess staff
          </div>
          <div className="mt-2 text-[10px] text-[#C2410C] font-semibold bg-orange-50 px-2 py-0.5 rounded inline-block">
            Diverted to {leftoverLogs[0]?.disposalMethod || 'biogas'}
          </div>
        </div>

        {/* 4. SUGGESTED PREP */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#596A7A]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#114232]">Suggested Prep</span>
            <ChefHat className="w-4 h-4 text-[#114232]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#114232]">
            {todayLunch?.suggestedPrep.portions || 780}
          </div>
          <div className="text-[11px] text-[#596A7A] mt-1">
            portions • dynamic batch sized
          </div>
          <div className="mt-2 text-[10px] text-emerald-800 font-semibold bg-[#E3EFE9] px-2 py-0.5 rounded inline-block">
            Ingredients computed below ↓
          </div>
        </div>

      </div>

      {/* Navigation tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#114232] text-[#114232]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Preparation Engine & Headcount
        </button>
        <button
          onClick={() => setActiveTab('menu_editor')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'menu_editor'
              ? 'border-[#114232] text-[#114232]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-[#D96B43]" />
          <span>Edit Daily Menu & Photos</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
            Live
          </span>
        </button>
        <button
          onClick={() => setActiveTab('concerns')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'concerns'
              ? 'border-[#D96B43] text-[#D96B43]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Kitchen Concerns Desk</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
            {concerns.filter(c => c.status !== 'resolved').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('leftovers')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 whitespace-nowrap ${
            activeTab === 'leftovers'
              ? 'border-[#114232] text-[#114232]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Food Waste & Donation Logs ({leftoverLogs.length})
        </button>
      </div>

      {activeTab === 'menu_editor' && (
        <DailyMenuEditor onSaved={() => setActiveTab('overview')} />
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Predicted vs Actual chart & Dish Popularity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Predicted vs Actual Attendance (Slide 5) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Predicted vs Actual Attendance
                  </h3>
                  <p className="text-[11px] text-[#596A7A]">
                    Feedback loop: actual attendance refines future intent algorithms
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-semibold">
                  <span className="flex items-center text-gray-600">
                    <span className="w-3 h-3 rounded-xs bg-[#CBD5E1] mr-1.5" />
                    Predicted
                  </span>
                  <span className="flex items-center text-gray-900">
                    <span className="w-3 h-3 rounded-xs bg-[#114232] mr-1.5" />
                    Actual
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="space-y-3 pt-2">
                {historicalAttendance.slice(0, 4).map((item) => {
                  const maxVal = 950;
                  const predWidth = (item.predicted / maxVal) * 100;
                  const actWidth = (item.actual / maxVal) * 100;

                  return (
                    <div key={item.day} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-800">{item.day}</span>
                        <span className="text-[#596A7A] font-mono text-[11px]">
                          Pred: {item.predicted} | Act: {item.actual} diners
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-4 bg-gray-100 rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-[#CBD5E1] rounded-sm transition-all duration-500"
                            style={{ width: `${predWidth}%` }}
                          />
                        </div>
                        <div className="h-4 bg-gray-100 rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-[#114232] rounded-sm transition-all duration-500"
                            style={{ width: `${actWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-gray-400 mt-4 text-right italic">
                Illustrative sample data based on Rajputana Mess turnstile records
              </p>
            </div>

            {/* Dish Popularity (Slide 5: % of diners taking dish) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Dish Popularity
                  </h3>
                  <p className="text-[11px] text-[#596A7A]">
                    % of diners taking each dish (guides scaling of specific recipe quantities)
                  </p>
                </div>
                <span className="text-xs font-bold text-[#114232] bg-[#E3EFE9] px-2.5 py-0.5 rounded-full">
                  Live Insights
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Paneer Masala', percent: 92, color: 'bg-[#114232]' },
                  { name: 'Rajma Chawal', percent: 84, color: 'bg-[#165B45]' },
                  { name: 'Aloo Gobi', percent: 58, color: 'bg-[#596A7A]' },
                  { name: 'Lauki Sabzi', percent: 41, color: 'bg-[#D96B43]' },
                ].map((dish) => (
                  <div key={dish.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-900">{dish.name}</span>
                      <span className="font-mono text-gray-800">{dish.percent}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${dish.color} rounded-full transition-all duration-500`}
                        style={{ width: `${dish.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-[#FAFBF9] rounded-xl text-xs text-[#596A7A] border border-gray-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D96B43] shrink-0" />
                <span>
                  <strong>Maharaj Recommendation:</strong> Lauki Sabzi should be prepped at 40% batch volume, while Paneer and Rajma need 100% full capacity.
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Suggested Prep Quantities */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Suggested Prep Quantities
                  </h3>
                  <p className="text-[11px] text-[#596A7A]">
                    Calculated for {todayLunch?.suggestedPrep.portions || 780} expected diners
                  </p>
                </div>
                <ChefHat className="w-5 h-5 text-[#114232]" />
              </div>

              {/* Dynamic Batch Breakdown */}
              <div className="divide-y divide-gray-100 my-2 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Rice</span>
                  <span className="font-mono font-bold text-base text-gray-900">
                    {todayLunch?.suggestedPrep.riceKg || 70} kg
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Dal / Curry</span>
                  <span className="font-mono font-bold text-base text-gray-900">
                    {todayLunch?.suggestedPrep.dalLiters || 45} L
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Roti / Phulka</span>
                  <span className="font-mono font-bold text-base text-gray-900">
                    {todayLunch?.suggestedPrep.rotiPieces.toLocaleString() || '1,600'} pcs
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Dry Sabzi</span>
                  <span className="font-mono font-bold text-base text-gray-900">
                    {todayLunch?.suggestedPrep.sabziKg || 55} kg
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Salad & Curd / Raita</span>
                  <span className="font-mono font-bold text-base text-gray-900">
                    {todayLunch?.suggestedPrep.saladCurdKg || 40} kg
                  </span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 border border-emerald-100">
                <div className="font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  Zero Guesswork Cooking
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Adjusting cooking volumes to registration intent cuts overall hostel food waste by over 30%.
                </p>
              </div>
            </div>

            {/* Leftover by Meal Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#596A7A] mb-3">
                Leftover by Meal (Recent Samples)
              </h3>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-[#FAFBF9] rounded-xl border border-gray-100">
                  <div className="text-[11px] font-bold text-gray-600">Breakfast</div>
                  <div className="text-lg font-black text-[#114232] mt-1">6 kg</div>
                  <div className="text-[9px] text-gray-400">B - 6 kg</div>
                </div>

                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="text-[11px] font-bold text-[#D96B43]">Lunch</div>
                  <div className="text-lg font-black text-[#D96B43] mt-1">18 kg</div>
                  <div className="text-[9px] text-[#C2410C]">L - 18 kg</div>
                </div>

                <div className="p-3 bg-[#FAFBF9] rounded-xl border border-gray-100">
                  <div className="text-[11px] font-bold text-gray-600">Dinner</div>
                  <div className="text-lg font-black text-[#114232] mt-1">11 kg</div>
                  <div className="text-[9px] text-gray-400">D - 11 kg</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Concerns Desk for Mess Staff */}
      {activeTab === 'concerns' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Assigned Student Concerns & Kitchen Action
              </h3>
              <p className="text-xs text-[#596A7A] mt-0.5">
                Students receive live progress notifications when you update the resolution stage.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {concerns.map((concern) => (
              <div 
                key={concern.id}
                className="p-4 rounded-xl border border-gray-200 bg-[#FAFBF9] hover:bg-white transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#114232] bg-[#E3EFE9] px-2 py-0.5 rounded">
                      #{concern.id}
                    </span>
                    <span className="font-bold text-xs text-gray-900">{concern.title}</span>
                    <span className="text-[11px] text-gray-500">by {concern.studentName} ({concern.studentId})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      concern.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      concern.status === 'action_taken' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {concern.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedConcern(concern);
                        setActionStage(concern.status === 'resolved' ? 'resolved' : 'action_taken');
                        setResolutionNote(concern.resolutionSummary || concern.committeeReviewNote || '');
                      }}
                      className="px-3 py-1 bg-[#114232] text-white text-xs font-bold rounded-lg hover:bg-[#0D382B] flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Take Action</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-700 pl-1">{concern.description}</p>
                
                {concern.dishAffected && (
                  <div className="text-[11px] text-[#114232] pl-1 font-medium">
                    Item affected: <strong>{concern.dishAffected}</strong>
                  </div>
                )}

                {concern.resolutionSummary && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200">
                    <strong>Recorded Action:</strong> {concern.resolutionSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leftover Waste Logs */}
      {activeTab === 'leftovers' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Food Leftover & Surplus Diversion Log
              </h3>
              <p className="text-xs text-[#596A7A]">
                Historical records of unconsumed food weighed by mess Maharaj and disposal channels
              </p>
            </div>
            <button
              onClick={() => setShowLogLeftoverModal(true)}
              className="px-4 py-2 bg-[#D96B43] text-white text-xs font-bold rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Leftover Weight</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9F5] text-gray-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Meal</th>
                  <th className="p-3">Weight (kg)</th>
                  <th className="p-3">Primary Dishes Leftover</th>
                  <th className="p-3">Disposal / NGO Channel</th>
                  <th className="p-3">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leftoverLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{log.date}</td>
                    <td className="p-3 capitalize font-bold text-[#114232]">{log.mealType}</td>
                    <td className="p-3 font-mono font-bold text-base text-[#D96B43]">{log.wasteWeightKg} kg</td>
                    <td className="p-3 text-gray-700">{log.primaryDishes.join(', ')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold capitalize">
                        {log.disposalMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{log.loggedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Leftovers Modal */}
      {showLogLeftoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
              <Scale className="w-5 h-5 text-[#D96B43]" />
              <span>Record Leftover Food Weight</span>
            </h3>

            <form onSubmit={handleSaveLeftover} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Meal Type
                </label>
                <select
                  value={wasteMealType}
                  onChange={(e) => setWasteMealType(e.target.value as MealType)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                >
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Total Leftover Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={wasteWeight}
                  onChange={(e) => setWasteWeight(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl text-sm font-bold text-[#D96B43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Main Dishes Left Unconsumed
                </label>
                <input
                  type="text"
                  required
                  value={primaryDishesInput}
                  onChange={(e) => setPrimaryDishesInput(e.target.value)}
                  placeholder="e.g. Lauki Sabzi (8kg), Rice (5kg)"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Surplus Diversion Channel
                </label>
                <select
                  value={disposalMethod}
                  onChange={(e) => setDisposalMethod(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                >
                  <option value="ngo_donation">NGO Donation (Robin Hood Army / Food Bank)</option>
                  <option value="biogas">Campus Biogas Digester Unit</option>
                  <option value="composting">Vermicomposting Pit</option>
                  <option value="animal_feed">Shelter Animal Feed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={wasteNotes}
                  onChange={(e) => setWasteNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLogLeftoverModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D96B43] text-white text-xs font-bold rounded-xl hover:bg-[#C2410C]"
                >
                  Save Leftover Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action / Resolve Concern Modal */}
      {selectedConcern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-bold text-base text-gray-900">
              Kitchen Action: #{selectedConcern.id}
            </h3>
            <p className="text-xs text-gray-600">
              {selectedConcern.title} ({selectedConcern.studentName})
            </p>

            <form onSubmit={handleUpdateConcern} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Progress Stage
                </label>
                <select
                  value={actionStage}
                  onChange={(e) => setActionStage(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl text-xs font-bold"
                >
                  <option value="action_taken">Stage 3: Action Assigned / In Progress</option>
                  <option value="resolved">Stage 4: Resolution Recorded & Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Kitchen Action / Resolution Note
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Instructed tandoor cook to calibrate temperature; batch inspected."
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedConcern(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#114232] text-white text-xs font-bold rounded-xl hover:bg-[#0D382B]"
                >
                  Update & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
