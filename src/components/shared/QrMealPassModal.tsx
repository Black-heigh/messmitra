import React from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Utensils, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QrMealPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrMealPassModal: React.FC<QrMealPassModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentInstitution, menus, getUserMealRegistration } = useApp();

  if (!isOpen) return null;
  if (!currentUser) return null;

  const currentMeal = menus.find(m => m.mealType === 'lunch') || menus[0];
  const registration = currentMeal ? getUserMealRegistration(currentMeal.id) : undefined;
  const isRegisteredEating = registration?.status === 'eating';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-gray-100 overflow-hidden text-center">
        
        {/* Pass Top Banner */}
        <div className="bg-[#114232] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-2">
            <Utensils className="w-6 h-6 text-[#88AB8E]" />
          </div>

          <h3 className="font-black text-lg text-white">Digital Mess Pass</h3>
          <p className="text-xs text-[#DCE7DD]">{currentInstitution.name}</p>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-4">
          
          {/* QR Code representation */}
          <div className="p-4 bg-[#F8F9F5] rounded-2xl border-2 border-dashed border-gray-300 inline-block">
            <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center relative shadow-xs">
              {/* QR Pattern visual */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-gray-50 rounded">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30
                        ? 'bg-[#114232]'
                        : i % 5 === 0
                        ? 'bg-[#D96B43]'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-[#114232] font-black text-xs border border-gray-100">
                  MM
                </div>
              </div>
            </div>
            <p className="text-[10px] font-mono text-gray-500 mt-2">
              TOKEN: MM-{currentUser.studentId}-{new Date().toISOString().slice(0, 10)}
            </p>
          </div>

          {/* Student Info */}
          <div className="bg-[#FAFBF9] p-3.5 rounded-xl border border-gray-100 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Student Name:</span>
              <span className="font-bold text-gray-900">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{currentInstitution.studentIdLabel}:</span>
              <span className="font-mono font-bold text-[#114232]">{currentUser.studentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hostel Mess:</span>
              <span className="font-bold text-gray-900">{currentUser.hostel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Meal Status:</span>
              <span className={`font-bold px-2 py-0.2 rounded ${
                isRegisteredEating ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {isRegisteredEating ? 'Registered Serving ✓' : 'Unregistered'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Token • Anti-Proxy Verification</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#114232] text-white text-xs font-bold rounded-xl hover:bg-[#0D382B]"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
