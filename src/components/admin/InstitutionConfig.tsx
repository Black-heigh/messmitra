import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Save, 
  HelpCircle, 
  Code2, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Institution } from '../../types';

export const InstitutionConfig: React.FC = () => {
  const { 
    institutions, 
    currentInstitution, 
    setInstitutionById, 
    updateInstitution, 
    createInstitution 
  } = useApp();

  const [selectedInstId, setSelectedInstId] = useState<string>(currentInstitution.id);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  // Edit form state
  const activeInst = institutions.find(i => i.id === selectedInstId) || institutions[0];
  const [name, setName] = useState(activeInst.name);
  const [shortCode, setShortCode] = useState(activeInst.shortCode);
  const [studentIdLabel, setStudentIdLabel] = useState(activeInst.studentIdLabel);
  const [studentIdFormatDesc, setStudentIdFormatDesc] = useState(activeInst.studentIdFormatDesc);
  const [studentIdRegex, setStudentIdRegex] = useState(activeInst.studentIdRegex);
  const [studentIdExample, setStudentIdExample] = useState(activeInst.studentIdExample);
  const [hostelsText, setHostelsText] = useState(activeInst.hostels.join(', '));

  // Regex tester state
  const [testInput, setTestInput] = useState(activeInst.studentIdExample);

  // Sync when active institution changes
  const handleSelectInstitution = (id: string) => {
    setSelectedInstId(id);
    const target = institutions.find(i => i.id === id);
    if (target) {
      setName(target.name);
      setShortCode(target.shortCode);
      setStudentIdLabel(target.studentIdLabel);
      setStudentIdFormatDesc(target.studentIdFormatDesc);
      setStudentIdRegex(target.studentIdRegex);
      setStudentIdExample(target.studentIdExample);
      setHostelsText(target.hostels.join(', '));
      setTestInput(target.studentIdExample);
      setIsEditing(false);
    }
  };

  // Test regex match
  const testRegexEvaluation = () => {
    try {
      const reg = new RegExp(studentIdRegex);
      const isMatch = reg.test(testInput.trim());
      return {
        isValid: isMatch,
        message: isMatch 
          ? `✓ Valid! "${testInput}" successfully matches rule pattern: ${studentIdRegex}` 
          : `✗ Invalid! "${testInput}" does not match rule: ${studentIdFormatDesc}`,
      };
    } catch (e: any) {
      return {
        isValid: false,
        message: `Regex syntax error: ${e.message}`,
      };
    }
  };

  const testResult = testInput ? testRegexEvaluation() : null;

  // Preset rules for quick selection
  const applyPreset = (preset: {
    label: string;
    regex: string;
    desc: string;
    example: string;
  }) => {
    setStudentIdLabel(preset.label);
    setStudentIdRegex(preset.regex);
    setStudentIdFormatDesc(preset.desc);
    setStudentIdExample(preset.example);
    setTestInput(preset.example);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Institution = {
      ...activeInst,
      name,
      shortCode,
      studentIdLabel,
      studentIdFormatDesc,
      studentIdRegex,
      studentIdExample,
      hostels: hostelsText.split(',').map(h => h.trim()).filter(Boolean),
    };
    updateInstitution(updated);
    setIsEditing(false);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createInstitution({
      name,
      shortCode,
      studentIdLabel,
      studentIdFormatDesc,
      studentIdRegex,
      studentIdExample,
      hostels: hostelsText.split(',').map(h => h.trim()).filter(Boolean),
      active: true,
      mealTimings: {
        breakfast: '07:30 AM - 09:30 AM',
        lunch: '12:00 PM - 02:30 PM',
        snacks: '05:00 PM - 06:15 PM',
        dinner: '07:45 PM - 09:45 PM',
      },
      cutoffHours: {
        breakfast: '10:00 PM (Prior Night)',
        lunch: '10:00 AM (Same Day)',
        snacks: '03:30 PM (Same Day)',
        dinner: '05:30 PM (Same Day)',
      },
    });
    setSelectedInstId(created.id);
    setShowAddNew(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Card: Institution Selector & Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E3EFE9] text-[#114232] text-xs font-bold">
              Multi-Institutional Configuration
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Student ID Format & Institutional Rules
          </h2>
          <p className="text-xs text-[#596A7A] mt-0.5">
            Set unique student ID validation expressions, length constraints, and mapped hostel messes per institution.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setShowAddNew(true);
              setName('New Institute of Technology');
              setShortCode('NIT-NEW');
              setStudentIdLabel('Student Registration No');
              setStudentIdFormatDesc('8-digit numeric code');
              setStudentIdRegex('^[0-9]{8}$');
              setStudentIdExample('20261001');
              setHostelsText('Hostel A, Hostel B, Hostel C');
            }}
            className="px-4 py-2.5 bg-[#114232] hover:bg-[#0D382B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Institution</span>
          </button>
        </div>
      </div>

      {/* Institution Picker Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {institutions.map((inst) => {
          const isSelected = inst.id === selectedInstId;
          return (
            <button
              key={inst.id}
              onClick={() => handleSelectInstitution(inst.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#114232] text-white border-[#114232] shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-[#F8F9F5] border-[#E2E8F0]'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#88AB8E]' : 'text-gray-400'}`} />
              <span>{inst.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {inst.shortCode}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Configuration Card + Live Regex Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Rule Policy for {activeInst.name}
              </h3>
              <p className="text-xs text-[#596A7A]">
                Controls login validation and hostel routing for {activeInst.shortCode} students.
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 bg-[#E3EFE9] text-[#114232] hover:bg-[#d5e7dd] text-xs font-bold rounded-lg flex items-center space-x-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modify Rules</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Institution Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-medium disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Short Code / Campus Tag
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-medium disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Quick Rule Presets (User requirement: IIT vs NIT differences) */}
            {isEditing && (
              <div className="p-3 bg-[#F8F9F5] rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Apply Standard Multi-Campus Rule Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset({
                      label: 'Roll Number',
                      regex: '^[0-9]{8}$',
                      desc: '8-digit numeric roll number (e.g. 21075024)',
                      example: '21075024',
                    })}
                    className="px-2.5 py-1 bg-white border border-gray-200 hover:border-[#114232] rounded-lg text-xs font-bold text-[#114232]"
                  >
                    IIT Standard (8-Digits)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset({
                      label: 'Roll Number',
                      regex: '^1[0-9]{8}$',
                      desc: '9-digit NIT scholar roll number starting with 1',
                      example: '106122045',
                    })}
                    className="px-2.5 py-1 bg-white border border-gray-200 hover:border-[#114232] rounded-lg text-xs font-bold text-[#114232]"
                  >
                    NIT Standard (9-Digits)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset({
                      label: 'LDAP Roll Number',
                      regex: '^[0-9]{2}[A-Za-z0-9]{7}$',
                      desc: 'Alphanumeric roll number (e.g. 21B030012)',
                      example: '21B030012',
                    })}
                    className="px-2.5 py-1 bg-white border border-gray-200 hover:border-[#114232] rounded-lg text-xs font-bold text-[#114232]"
                  >
                    Alphanumeric (IIT Bombay)
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Student ID Field Label
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={studentIdLabel}
                  onChange={(e) => setStudentIdLabel(e.target.value)}
                  placeholder="e.g. Roll Number, Scholar ID"
                  className="w-full p-2.5 border rounded-xl text-xs font-medium disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Example Student ID
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={studentIdExample}
                  onChange={(e) => setStudentIdExample(e.target.value)}
                  placeholder="e.g. 21075024"
                  className="w-full p-2.5 border rounded-xl text-xs font-mono font-bold text-[#114232] disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Regular Expression (Regex) Validation Rule
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={studentIdRegex}
                  onChange={(e) => setStudentIdRegex(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-mono font-bold text-blue-900 bg-blue-50/20 disabled:bg-gray-50 disabled:text-gray-600"
                />
                <Code2 className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Student Help Description / Format Hint
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={studentIdFormatDesc}
                onChange={(e) => setStudentIdFormatDesc(e.target.value)}
                className="w-full p-2.5 border rounded-xl text-xs font-medium disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mapped Hostel Messes (Comma-separated)
              </label>
              <textarea
                rows={2}
                disabled={!isEditing}
                value={hostelsText}
                onChange={(e) => setHostelsText(e.target.value)}
                className="w-full p-2.5 border rounded-xl text-xs font-medium disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#114232] hover:bg-[#0D382B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save ID Rule Policy</span>
                </button>
              </div>
            )}

          </form>
        </div>

        {/* Right Col: Live Regex Tester Sandbox */}
        <div className="space-y-6">
          <div className="bg-[#FAFBF9] rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-[#114232]">
              <Code2 className="w-5 h-5" />
              <h3 className="font-bold text-sm text-gray-900">
                Live Regex Tester Sandbox
              </h3>
            </div>
            <p className="text-xs text-[#596A7A]">
              Test any test student ID against your configured rule <span className="font-mono font-bold text-gray-800">{studentIdRegex}</span> before publishing to campus students.
            </p>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Test Input String
              </label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type a student ID to test..."
                className="w-full p-3 border rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-[#114232]"
              />
            </div>

            {/* Live Result Card */}
            {testResult && (
              <div className={`p-3.5 rounded-xl border text-xs font-medium ${
                testResult.isValid 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  {testResult.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-bold text-xs">
                    {testResult.isValid ? 'Validation Passed' : 'Validation Rejected'}
                  </span>
                </div>
                <p className="text-[11px] leading-tight mt-1">{testResult.message}</p>
              </div>
            )}

            <div className="space-y-1.5 pt-2 text-[11px] text-gray-500">
              <span className="font-bold block text-gray-700">Quick Test Samples:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setTestInput('21075024')}
                  className="px-2 py-0.5 bg-white border rounded text-[10px] font-mono hover:bg-gray-50"
                >
                  21075024 (8-digit)
                </button>
                <button
                  type="button"
                  onClick={() => setTestInput('106122045')}
                  className="px-2 py-0.5 bg-white border rounded text-[10px] font-mono hover:bg-gray-50"
                >
                  106122045 (9-digit)
                </button>
                <button
                  type="button"
                  onClick={() => setTestInput('21B030012')}
                  className="px-2 py-0.5 bg-white border rounded text-[10px] font-mono hover:bg-gray-50"
                >
                  21B030012 (Alphanumeric)
                </button>
                <button
                  type="button"
                  onClick={() => setTestInput('abc99')}
                  className="px-2 py-0.5 bg-white border rounded text-[10px] font-mono hover:bg-gray-50 text-rose-600"
                >
                  abc99 (Invalid)
                </button>
              </div>
            </div>

          </div>

          {/* Scalable Multi-Campus Info Badge */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#114232]">
              <ShieldCheck className="w-4 h-4 text-[#114232]" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                Scalable Multi-Institutional Schema
              </h4>
            </div>
            <p className="text-xs text-[#596A7A] leading-relaxed">
              Every document is isolated with <code className="text-xs bg-gray-100 px-1 py-0.5 rounded font-mono text-[#114232]">institutionId</code> partition keys, preventing cross-tenant leakage between IITs, NITs, and central universities.
            </p>
          </div>
        </div>

      </div>

      {/* Onboard New Institution Modal */}
      {showAddNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#114232]" />
              <span>Onboard New Institution / College</span>
            </h3>

            <form onSubmit={handleCreateNew} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Short Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    ID Label
                  </label>
                  <input
                    type="text"
                    required
                    value={studentIdLabel}
                    onChange={(e) => setStudentIdLabel(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Regex Rule Pattern
                </label>
                <input
                  type="text"
                  required
                  value={studentIdRegex}
                  onChange={(e) => setStudentIdRegex(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Example ID
                </label>
                <input
                  type="text"
                  required
                  value={studentIdExample}
                  onChange={(e) => setStudentIdExample(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Hostels (Comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={hostelsText}
                  onChange={(e) => setHostelsText(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddNew(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#114232] text-white text-xs font-bold rounded-xl hover:bg-[#0D382B]"
                >
                  Register Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
