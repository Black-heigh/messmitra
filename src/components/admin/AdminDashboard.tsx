import React, { useState } from 'react';
import { 
  Building2, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Scale, 
  Send, 
  MessageSquare, 
  Filter, 
  ChefHat, 
  Users, 
  Calendar,
  FileText,
  BellRing,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstitutionConfig } from './InstitutionConfig';
import { Concern, ConcernStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentInstitution, 
    concerns, 
    updateConcernStatus, 
    leftoverLogs,
    menus,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'id_config' | 'concerns' | 'analytics' | 'suppliers' | 'broadcast'>('id_config');

  // Concern review state
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ConcernStatus>('under_review');
  const [reviewNote, setReviewNote] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('Maharaj Ramesh Sharma');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const handleUpdateConcern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConcern) return;

    updateConcernStatus(selectedConcern.id, reviewStatus, {
      assignedTo: assignedStaff,
      committeeReviewNote: reviewNote,
      resolutionSummary: reviewStatus === 'resolved' ? reviewNote : undefined,
    });

    setSelectedConcern(null);
    setReviewNote('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    showToast(`Broadcast published: "${broadcastTitle}" sent to all campus students.`);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  // Aggregate stats
  const totalWasteRecorded = leftoverLogs.reduce((acc, l) => acc + l.wasteWeightKg, 0);
  const totalConcerns = concerns.length;
  const resolvedConcerns = concerns.filter(c => c.status === 'resolved').length;
  const resolutionRate = totalConcerns > 0 ? Math.round((resolvedConcerns / totalConcerns) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-700" />
              Mess Committee & Administrator
            </span>
            <span className="text-xs text-[#596A7A]">
              • {currentInstitution.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            Multi-Campus Mess Governance & Audit
          </h1>
          <p className="text-xs text-[#596A7A] mt-0.5">
            Monitor food waste trends, student feedback, and campus student ID policies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Food Waste Cut (Campus-Wide)
            </div>
            <div className="text-xl font-black text-emerald-900">
              -32.4%
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('id_config')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-3 whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'id_config'
              ? 'border-[#114232] text-[#114232]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Student ID Rules & Multi-Campus Setup</span>
        </button>

        <button
          onClick={() => setActiveTab('concerns')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-3 whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'concerns'
              ? 'border-[#D96B43] text-[#D96B43]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Student Concerns & Doubts Desk</span>
          <span className="text-[10px] bg-orange-100 text-[#C2410C] px-1.5 py-0.2 rounded-full font-bold">
            {concerns.filter(c => c.status !== 'resolved').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-3 whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'analytics'
              ? 'border-[#114232] text-[#114232]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Food Waste & Cost Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-3 whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'suppliers'
              ? 'border-[#114232] text-[#114232]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Supplier Quality Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all px-3 whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'broadcast'
              ? 'border-[#114232] text-[#114232]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Broadcast Notifications</span>
        </button>
      </div>

      {/* TAB 1: Institutional & Student ID Config */}
      {activeTab === 'id_config' && <InstitutionConfig />}

      {/* TAB 2: Concerns Management */}
      {activeTab === 'concerns' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                All Student Concerns & Grievance Workflow
              </h3>
              <p className="text-xs text-[#596A7A]">
                Review student concerns, assign to kitchen staff, and record verified resolutions.
              </p>
            </div>

            <div className="text-xs font-bold text-gray-600 bg-[#F8F9F5] px-3 py-1.5 rounded-xl border border-gray-200">
              Resolution Rate: <span className="text-emerald-700 font-mono">{resolutionRate}%</span> ({resolvedConcerns}/{totalConcerns})
            </div>
          </div>

          <div className="space-y-3">
            {concerns.map((concern) => (
              <div 
                key={concern.id}
                className="p-4 rounded-xl border border-gray-200 bg-[#FAFBF9] hover:bg-white hover:border-[#114232]/20 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#114232] bg-[#E3EFE9] px-2 py-0.5 rounded">
                      #{concern.id}
                    </span>
                    <span className="font-bold text-xs text-gray-900">{concern.title}</span>
                    <span className="text-[11px] text-[#596A7A]">
                      by {concern.studentName} ({concern.studentId} • {concern.hostel})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      concern.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      concern.status === 'action_taken' ? 'bg-blue-100 text-blue-800' :
                      concern.status === 'under_review' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {concern.status.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedConcern(concern);
                        setReviewStatus(concern.status);
                        setReviewNote(concern.committeeReviewNote || concern.resolutionSummary || '');
                      }}
                      className="px-3 py-1 bg-[#114232] text-white text-xs font-bold rounded-lg hover:bg-[#0D382B]"
                    >
                      Committee Review
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-700">{concern.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#596A7A] bg-white p-2.5 rounded-lg border border-gray-100">
                  <div>
                    Category: <span className="font-bold text-gray-800 capitalize">{concern.category.replace('_', ' ')}</span>
                    {concern.dishAffected && <span> • Item: <strong>{concern.dishAffected}</strong></span>}
                  </div>
                  <div>
                    Assigned: <span className="font-bold text-[#114232]">{concern.assignedTo || 'Unassigned'}</span>
                  </div>
                </div>

                {concern.resolutionSummary && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-100">
                    <span className="font-bold">Resolution Note: </span>
                    {concern.resolutionSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Analytics (Slide 2 & 9) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Top 3 Impact Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#596A7A]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Food Waste Prevented</span>
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-2">
                1,420 kg
              </div>
              <p className="text-xs text-[#596A7A] mt-1">
                Saved this month through student registration intent
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#596A7A]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Hostel Budget Savings</span>
                <DollarSign className="w-5 h-5 text-[#114232]" />
              </div>
              <div className="text-3xl font-black text-gray-900 mt-2">
                ₹1,84,500
              </div>
              <p className="text-xs text-[#596A7A] mt-1">
                Raw material costs saved by cutting overproduction
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#596A7A]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Biogas & NGO Diversion</span>
                <Scale className="w-5 h-5 text-[#D96B43]" />
              </div>
              <div className="text-3xl font-black text-[#D96B43] mt-2">
                98.2%
              </div>
              <p className="text-xs text-[#596A7A] mt-1">
                Surplus food diverted to Robin Hood Army & biogas units
              </p>
            </div>
          </div>

          {/* Slide 2 The Problem Chain Diagram */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs">
            <h3 className="font-bold text-sm text-gray-900 mb-1">
              From Uncertain Guesswork to Data-Driven Planning
            </h3>
            <p className="text-xs text-[#596A7A] mb-4">
              How MessMitra eliminates the overproduction cycle with real-time intent headcounts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="font-bold text-orange-900">Before MessMitra</div>
                <div className="text-sm font-black text-[#D96B43] mt-2">Uncertain Demand</div>
                <p className="text-[11px] text-orange-800 mt-1">No reliable headcount before cooking starts</p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="font-bold text-orange-900">Excess Preparation</div>
                <div className="text-sm font-black text-[#D96B43] mt-2">Overproduction</div>
                <p className="text-[11px] text-orange-800 mt-1">Prepared quantity exceeds what is eaten</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="font-bold text-emerald-900">MessMitra Solution</div>
                <div className="text-sm font-black text-[#114232] mt-2">Student Intent Registration</div>
                <p className="text-[11px] text-emerald-800 mt-1">Daily opt-in headcounts locked at cut-off</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="font-bold text-emerald-900">Result</div>
                <div className="text-sm font-black text-[#114232] mt-2">Waste Monitoring & Transparency</div>
                <p className="text-[11px] text-emerald-800 mt-1">Data insights refine each future meal</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: Supplier Transparency Audit */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Hostel Mess Supplier & Quality Traceability Audit
              </h3>
              <p className="text-xs text-[#596A7A]">
                Transparent ingredient sourcing and verified raw material certifications.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              All Suppliers Certified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menus[0]?.suppliers.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-[#FAFBF9] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">{s.ingredient}</h4>
                  <span className="text-[10px] font-mono font-bold bg-[#E3EFE9] text-[#114232] px-2 py-0.5 rounded">
                    {s.certifications}
                  </span>
                </div>
                <div className="text-xs text-[#596A7A]">
                  Brand: <span className="font-semibold text-gray-800">{s.brand}</span>
                </div>
                <div className="text-xs text-[#596A7A]">
                  Contracted Supplier: <span className="font-semibold text-gray-800">{s.supplier}</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium pt-1 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Audit verified by IIT BHU Mess Quality Cell
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Broadcast Announcements */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs max-w-xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
              <BellRing className="w-5 h-5 text-[#114232]" />
              <span>Campus Mess Broadcast Announcement</span>
            </h3>
            <p className="text-xs text-[#596A7A] mt-0.5">
              Send instant notification update to all registered students and mess supervisors.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Special Feast Menu for Institute Fest this Friday"
                className="w-full p-2.5 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#114232]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Message Content
              </label>
              <textarea
                required
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Details, cutoff timings, or menu adjustments..."
                className="w-full p-2.5 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#114232]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#114232] hover:bg-[#0D382B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast to Campus</span>
            </button>
          </form>
        </div>
      )}

      {/* Committee Review Modal */}
      {selectedConcern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-bold text-base text-gray-900">
              Mess Committee Review: #{selectedConcern.id}
            </h3>
            <p className="text-xs text-gray-600">
              {selectedConcern.title} (Student: {selectedConcern.studentName})
            </p>

            <form onSubmit={handleUpdateConcern} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Workflow Stage
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as ConcernStatus)}
                  className="w-full p-2.5 border rounded-xl text-xs font-bold"
                >
                  <option value="under_review">Stage 2: Reviewed by Mess Committee (Under Review)</option>
                  <option value="action_taken">Stage 3: Action Assigned (In Progress)</option>
                  <option value="resolved">Stage 4: Resolution Recorded (Resolved & Closed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Assign to Mess Staff / Maharaj
                </label>
                <input
                  type="text"
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Official Committee Review & Resolution Note
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Record instructions for kitchen or resolution confirmation..."
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
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
