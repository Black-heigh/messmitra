import React from 'react';
import { 
  X, 
  UtensilsCrossed, 
  CheckCircle2, 
  Building2, 
  Award, 
  ArrowRight, 
  Repeat, 
  Users, 
  ShieldCheck, 
  ChefHat, 
  Sparkles,
  Layers,
  Leaf
} from 'lucide-react';

interface AboutSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSystemModal: React.FC<AboutSystemModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8">
        
        {/* Banner with Ideathon 2026 citation from Slide 1 */}
        <div className="bg-[#114232] text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-[#DCE7DD] text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-[#88AB8E]" />
            <span>Space and beyond : Ideathon 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Mess<span className="text-[#D96B43]">Mitra</span>
          </h2>
          <p className="text-sm text-[#DCE7DD] font-medium mt-1">
            Smart Mess Management & Food Waste Reduction System
          </p>
          <p className="text-xs text-[#88AB8E] font-bold mt-1">
            "Less Waste. Better Meals. Complete Transparency."
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-[11px] text-[#DCE7DD]">
            <div>Team: <span className="text-white font-bold">[Blast]</span></div>
            <div>Author: <span className="text-white font-bold">[Aayush Singh]</span></div>
            <div>Institution: <span className="text-white font-bold">[Indian Institute of Technology, BHU]</span></div>
          </div>
        </div>

        {/* Content sections corresponding to the slides */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* 1. The Problem */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D96B43] block">
              The Hostel Food Waste Problem
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              Mess Management Still Runs on Guesswork.
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-lg font-bold text-[#D96B43]">?</div>
                <div className="font-bold text-xs text-gray-900 mt-1">Uncertain Demand</div>
                <div className="text-[10px] text-gray-600 mt-0.5">No reliable headcount before cooking</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-lg font-bold text-[#D96B43]">🍲</div>
                <div className="font-bold text-xs text-gray-900 mt-1">Excess Prep</div>
                <div className="text-[10px] text-gray-600 mt-0.5">Cooking exceeds what is eaten</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-lg font-bold text-[#D96B43]">🗑️</div>
                <div className="font-bold text-xs text-gray-900 mt-1">Food Waste</div>
                <div className="text-[10px] text-gray-600 mt-0.5">Over 20kg unserved food daily</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-lg font-bold text-[#D96B43]">₹</div>
                <div className="font-bold text-xs text-gray-900 mt-1">Resource Loss</div>
                <div className="text-[10px] text-gray-600 mt-0.5">Huge financial and energy loss</div>
              </div>
            </div>
          </div>

          {/* 2. The Solution */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#114232] block">
              The Three Stakeholder Framework
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              One Platform. Three Stakeholders. Smarter Decisions.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="p-3.5 rounded-xl border border-[#DCE7DD] bg-[#FAFBF9]">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-[#114232]">
                  <Users className="w-4 h-4" />
                  <span>1. Students</span>
                </div>
                <ul className="text-[11px] text-gray-600 mt-2 space-y-1 list-disc list-inside">
                  <li>Register meal intent</li>
                  <li>4-step concern tracking</li>
                  <li>Supplier transparency</li>
                  <li>Est. meal-value usage</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-orange-200 bg-[#FFF9F5]">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-[#D96B43]">
                  <ChefHat className="w-4 h-4" />
                  <span>2. Mess Staff</span>
                </div>
                <ul className="text-[11px] text-gray-600 mt-2 space-y-1 list-disc list-inside">
                  <li>Expected attendance</li>
                  <li>Preparation suggestions</li>
                  <li>Dish popularity analysis</li>
                  <li>Log leftover food</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>3. Mess Committee</span>
                </div>
                <ul className="text-[11px] text-gray-600 mt-2 space-y-1 list-disc list-inside">
                  <li>Multi-campus ID rules</li>
                  <li>Waste & spending trends</li>
                  <li>Review doubts & assign</li>
                  <li>Evaluate menu quality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. The Continuous Loop */}
          <div className="p-4 bg-[#FAFBF9] rounded-2xl border border-gray-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#114232] block">
              Core Innovation
            </span>
            <h4 className="font-bold text-sm text-gray-900 mt-0.5">
              The Continuous Feedback Loop
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              "Every meal served makes the next plan better — not just recorded, but learned from."
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-gray-700 overflow-x-auto gap-2 py-1">
              <span className="bg-white px-2.5 py-1.5 rounded-lg border shadow-xs whitespace-nowrap">01 Intent Reg</span>
              <span>→</span>
              <span className="bg-white px-2.5 py-1.5 rounded-lg border shadow-xs whitespace-nowrap">02 Demand Data</span>
              <span>→</span>
              <span className="bg-white px-2.5 py-1.5 rounded-lg border shadow-xs whitespace-nowrap">03 Smart Prep</span>
              <span>→</span>
              <span className="bg-white px-2.5 py-1.5 rounded-lg border shadow-xs whitespace-nowrap">04 Leftovers Log</span>
              <span>→</span>
              <span className="bg-[#114232] text-white px-2.5 py-1.5 rounded-lg shadow-xs whitespace-nowrap">05 Better Forecast</span>
            </div>
          </div>

          {/* 4. Scalability Path */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#596A7A] block">
              Multi-Campus Scalability Path
            </span>
            <div className="flex items-center justify-between text-xs font-bold text-gray-800 mt-2 gap-2 overflow-x-auto">
              <span className="bg-gray-100 px-3 py-2 rounded-xl whitespace-nowrap">College Hostel</span>
              <span>→</span>
              <span className="bg-emerald-100 text-emerald-900 px-3 py-2 rounded-xl whitespace-nowrap">Multiple Hostels</span>
              <span>→</span>
              <span className="bg-[#114232] text-white px-3 py-2 rounded-xl whitespace-nowrap">University Campus</span>
              <span>→</span>
              <span className="bg-blue-900 text-white px-3 py-2 rounded-xl whitespace-nowrap">Multiple Institutions</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F9F5] border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#114232] text-white text-xs font-bold rounded-xl hover:bg-[#0D382B]"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
