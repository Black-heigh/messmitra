import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  MessageSquare, 
  Filter, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  ChefHat,
  X,
  Send,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Concern, ConcernCategory, MealType } from '../../types';

export const StudentConcerns: React.FC = () => {
  const { currentUser, currentInstitution, concerns, submitConcern } = useApp();

  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ConcernCategory>('food_quality');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [dishAffected, setDishAffected] = useState('');
  const [description, setDescription] = useState('');

  if (!currentUser) return null;

  // Only show this student's concerns
  const myConcerns = concerns.filter(c => c.studentUid === currentUser.uid);

  const filteredConcerns = myConcerns.filter(c => {
    if (filter === 'active') return c.status !== 'resolved';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    submitConcern({
      title,
      category,
      mealType,
      dishAffected,
      description,
      mealDate: new Date().toISOString().split('T')[0],
    });

    setTitle('');
    setDescription('');
    setDishAffected('');
    setShowSubmitModal(false);
  };

  const getWorkflowSteps = (concern: Concern) => {
    const steps = [
      {
        number: 1,
        title: 'Feedback Submitted',
        statusKey: 'submitted',
        isComplete: true,
        note: `Submitted by ${concern.studentName} on ${new Date(concern.createdAt).toLocaleDateString()}`,
      },
      {
        number: 2,
        title: 'Reviewed by Mess Committee',
        statusKey: 'under_review',
        isComplete: ['under_review', 'action_taken', 'resolved'].includes(concern.status),
        note: concern.committeeReviewNote || (concern.status === 'submitted' ? 'Pending committee review meeting' : 'Review completed'),
      },
      {
        number: 3,
        title: 'Action Assigned',
        statusKey: 'action_taken',
        isComplete: ['action_taken', 'resolved'].includes(concern.status),
        note: concern.assignedTo ? `Assigned to: ${concern.assignedTo}` : 'Pending assignment to Mess Staff',
      },
      {
        number: 4,
        title: 'Resolution Recorded',
        statusKey: 'resolved',
        isComplete: concern.status === 'resolved',
        note: concern.resolutionSummary || 'Remediation verification pending',
      },
    ];
    return steps;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Student Feedback & Doubts Tracker
          </h2>
          <p className="text-xs text-[#596A7A] mt-0.5">
            Track your concern in real-time through each stage of review and resolution.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filters */}
          <div className="flex items-center bg-[#F8F9F5] p-1 rounded-xl border border-gray-200 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'all' ? 'bg-[#114232] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({myConcerns.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'active' ? 'bg-[#D96B43] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active ({myConcerns.filter(c => c.status !== 'resolved').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'resolved' ? 'bg-emerald-700 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resolved ({myConcerns.filter(c => c.status === 'resolved').length})
            </button>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2.5 bg-[#114232] hover:bg-[#0D382B] text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Concern</span>
          </button>
        </div>
      </div>

      {/* Concerns List */}
      {filteredConcerns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E3EFE9] text-[#114232] flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-gray-900">No Concerns Found</h3>
          <p className="text-xs text-[#596A7A] mt-1">
            {filter === 'active' 
              ? 'Great news! You have no unresolved concerns or doubts.' 
              : 'Have any complaint regarding food quality, hygiene, or timings? Submit your feedback.'}
          </p>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-4 px-4 py-2 bg-[#114232] text-white text-xs font-bold rounded-xl"
          >
            Submit Feedback
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConcerns.map((concern) => {
            const steps = getWorkflowSteps(concern);
            const isResolved = concern.status === 'resolved';

            return (
              <div 
                key={concern.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs hover:border-[#114232]/30 transition-all"
              >
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-[#114232] bg-[#E3EFE9] px-2.5 py-0.5 rounded-lg">
                      #{concern.id}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(concern.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {concern.mealType && (
                      <span className="text-xs text-gray-400 capitalize">
                        • {concern.mealType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-500 capitalize">
                      Category: <span className="text-gray-900">{concern.category.replace('_', ' ')}</span>
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      concern.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      concern.status === 'action_taken' ? 'bg-blue-100 text-blue-800' :
                      concern.status === 'under_review' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {concern.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Concern Content */}
                <div className="py-4">
                  <h3 className="font-bold text-base text-gray-900">
                    {concern.title}
                  </h3>
                  <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">
                    {concern.description}
                  </p>
                  {concern.dishAffected && (
                    <div className="mt-2 text-xs font-medium text-[#114232]">
                      Specific Item Affected: <span className="font-bold underline">{concern.dishAffected}</span>
                    </div>
                  )}
                </div>

                {/* 4-Step Progress Tracker Workflow (Exact Replication of Slide 6) */}
                <div className="mt-2 pt-4 border-t border-gray-100 bg-[#FAFBF9] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-b-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#596A7A]">
                      Transparent Feedback Tracking Workflow
                    </h4>
                    {isResolved && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Student Notified & Satisfied
                      </span>
                    )}
                  </div>

                  {/* Visual Step Connectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                    {steps.map((st) => (
                      <div
                        key={st.number}
                        className={`p-3 rounded-xl border transition-all ${
                          st.isComplete
                            ? 'bg-white border-[#114232]/30 shadow-xs ring-1 ring-[#114232]/10'
                            : 'bg-white/50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            st.isComplete
                              ? 'bg-[#114232] text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {st.isComplete ? '✓' : st.number}
                          </div>
                          <span className={`text-xs font-bold ${st.isComplete ? 'text-gray-900' : 'text-gray-500'}`}>
                            {st.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-2 leading-tight">
                          {st.note}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Resolution Notes Banner */}
                  {concern.resolutionSummary && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-emerald-900">Recorded Resolution: </span>
                        <span className="text-emerald-800">{concern.resolutionSummary}</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Submit Concern Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
            
            <div className="bg-[#114232] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">Post Student Concern / Doubt</h3>
                <p className="text-xs text-[#DCE7DD]">Directly visible to Mess Maharaj & Committee</p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Issue Title / Subject
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Roti undercooked or oil excess in sabzi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ConcernCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                  >
                    <option value="food_quality">Food Quality</option>
                    <option value="hygiene">Hygiene & Cleanliness</option>
                    <option value="quantity">Portion Size</option>
                    <option value="timing">Meal Timings</option>
                    <option value="menu_variety">Menu Variety</option>
                    <option value="staff_behavior">Staff Interaction</option>
                    <option value="other">Other Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Meal Affected
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                  >
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Specific Dish / Station (Optional)
                </label>
                <input
                  type="text"
                  value={dishAffected}
                  onChange={(e) => setDishAffected(e.target.value)}
                  placeholder="e.g. Tandoori Roti / RO Water Dispenser"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details so the Mess Maharaj and Committee can investigate..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#114232] hover:bg-[#0D382B] text-white font-bold text-xs flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Concern</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
