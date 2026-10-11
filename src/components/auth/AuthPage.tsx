import React, { useState } from 'react';
import { 
  Building2, 
  UtensilsCrossed, 
  UserCheck, 
  ChefHat, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Home, 
  FileBadge, 
  Mail, 
  User, 
  Lock, 
  Info, 
  Leaf,
  Scale,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AuthPageProps {
  onOpenAbout: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onOpenAbout }) => {
  const { 
    institutions, 
    currentInstitution, 
    validateStudentId, 
    registerStudent, 
    registerManager, 
    registerAdmin, 
    loginUser,
    users 
  } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [selectedInstId, setSelectedInstId] = useState<string>(currentInstitution.id);
  const [errorMessage, setErrorMessage] = useState('');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Student specific
  const [studentId, setStudentId] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  // Mess Manager specific
  const [messLicense, setMessLicense] = useState('');
  const [managerHostel, setManagerHostel] = useState('');

  // Admin specific
  const [adminStaffId, setAdminStaffId] = useState('');
  const [designation, setDesignation] = useState('Mess Warden & Committee Head');

  // Login field
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('student');

  const targetInst = institutions.find(i => i.id === selectedInstId) || currentInstitution;
  const studentIdValidation = studentId ? validateStudentId(studentId, targetInst.id) : null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRole === 'student') {
      const hostelToUse = selectedHostel || targetInst.hostels[0];
      const res = registerStudent({
        institutionId: targetInst.id,
        studentId,
        name,
        email,
        phoneNumber: phone,
        hostel: hostelToUse,
        roomNumber,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to register student');
      }
    } else if (selectedRole === 'manager') {
      const hostelToUse = managerHostel || targetInst.hostels[0];
      const res = registerManager({
        institutionId: targetInst.id,
        name,
        email,
        phoneNumber: phone,
        hostel: hostelToUse,
        messLicense,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to register mess manager');
      }
    } else if (selectedRole === 'admin') {
      const res = registerAdmin({
        institutionId: targetInst.id,
        name,
        email,
        phoneNumber: phone,
        adminStaffId,
        designation,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to register administrator');
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginUser(loginIdentifier, loginRole);
    if (!res.success) {
      setErrorMessage(res.error || 'Sign in failed');
    }
  };

  // Quick 1-click test accounts
  const quickSignInAs = (identifier: string, role: UserRole) => {
    setErrorMessage('');
    loginUser(identifier, role);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#114232] flex items-center justify-center text-white shadow-xs">
              <UtensilsCrossed className="w-5 h-5 text-[#88AB8E]" />
            </div>
            <div>
              <span className="text-xl font-black text-[#114232]">
                Mess<span className="text-[#D96B43]">Mitra</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E3EFE9] text-[#114232]">
                Ideathon 2026 • IIT BHU
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAbout}
              className="text-xs font-bold text-[#114232] hover:bg-[#F8F9F5] px-3 py-2 rounded-xl border border-[#E2E8F0] flex items-center space-x-1.5 transition-colors"
            >
              <Info className="w-4 h-4 text-[#88AB8E]" />
              <span className="hidden sm:inline">About Problem & Solution</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Registration Section */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Platform Mission & 3 Pillars Intro */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#E3EFE9] text-[#114232] text-xs font-bold inline-flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#114232]" />
                Smart Mess Management & Food Waste Reduction
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 tracking-tight leading-tight">
                Less Waste.<br />
                Better Meals.<br />
                <span className="text-[#114232]">Complete Transparency.</span>
              </h1>
              <p className="text-sm text-[#596A7A] mt-3 leading-relaxed">
                MessMitra replaces guesswork in hostel mess kitchens with student intent registration, dynamic batch preparation recommendations, and transparent 4-stage doubt resolution.
              </p>
            </div>

            {/* 3 Pillars Summary Cards */}
            <div className="space-y-2.5">
              <div className="p-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#114232] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900">1. Students</h4>
                  <p className="text-[11px] text-gray-600">
                    Reserve daily meals, view live food photos, and track concerns in real time.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D96B43] flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900">2. Mess Staff & Maharaj</h4>
                  <p className="text-[11px] text-gray-600">
                    View expected diners, get smart cooking batch sheets, and update food photos.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900">3. Mess Committee & Admins</h4>
                  <p className="text-[11px] text-gray-600">
                    Set campus student ID rules, resolve student grievances, and audit quality.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Demo Credentials */}
            <div className="p-4 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Quick Demo Access:
                </span>
                <span className="text-[10px] text-gray-400">1-Click Sign In</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => quickSignInAs('21075024', 'student')}
                  className="p-2 bg-[#E3EFE9] text-[#114232] rounded-xl text-xs font-bold text-center hover:bg-[#d4e6db] transition-colors"
                >
                  Student (Aayush)
                </button>
                <button
                  type="button"
                  onClick={() => quickSignInAs('mess.rajputana@itbhu.ac.in', 'manager')}
                  className="p-2 bg-[#FFEDD5] text-[#C2410C] rounded-xl text-xs font-bold text-center hover:bg-[#fcd3b6] transition-colors"
                >
                  Maharaj Ramesh
                </button>
                <button
                  type="button"
                  onClick={() => quickSignInAs('FAC-BHU-2018', 'admin')}
                  className="p-2 bg-blue-50 text-blue-900 rounded-xl text-xs font-bold text-center hover:bg-blue-100 transition-colors"
                >
                  Warden Tripathi
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Registration & Login Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden">
            
            {/* Top Switcher: Register vs Login */}
            <div className="flex border-b border-gray-100 bg-[#FAFBF9]">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-4 text-xs font-bold text-center transition-all border-b-2 ${
                  mode === 'register'
                    ? 'border-[#114232] text-[#114232] bg-white shadow-2xs'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Create New Account (Registration)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-4 text-xs font-bold text-center transition-all border-b-2 ${
                  mode === 'login'
                    ? 'border-[#114232] text-[#114232] bg-white shadow-2xs'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In to Existing Account
              </button>
            </div>

            <div className="p-6 sm:p-8">
              
              {/* Error banner */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {mode === 'register' ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  
                  {/* Stakeholder Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      I am registering as:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('student')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                          selectedRole === 'student'
                            ? 'bg-[#114232] text-white border-[#114232] shadow-sm'
                            : 'bg-[#F8F9F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Student</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('manager')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                          selectedRole === 'manager'
                            ? 'bg-[#D96B43] text-white border-[#D96B43] shadow-sm'
                            : 'bg-[#F8F9F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Mess Manager</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('admin')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                          selectedRole === 'admin'
                            ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                            : 'bg-[#F8F9F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Administrator</span>
                      </button>
                    </div>
                  </div>

                  {/* College / Institution Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Select University / Educational Institution
                    </label>
                    <div className="relative">
                      <select
                        value={selectedInstId}
                        onChange={(e) => {
                          setSelectedInstId(e.target.value);
                          setStudentId('');
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-[#114232]"
                      >
                        {institutions.map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name} ({inst.shortCode})
                          </option>
                        ))}
                      </select>
                      <Building2 className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                    {selectedRole === 'student' && (
                      <p className="text-[11px] text-[#596A7A] mt-1">
                        ID Format rule set by admin: <span className="font-semibold text-gray-800">{targetInst.studentIdFormatDesc}</span>
                      </p>
                    )}
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={
                          selectedRole === 'student' ? 'e.g. Aayush Singh' :
                          selectedRole === 'manager' ? 'e.g. Chef Ramesh Sharma' :
                          'e.g. Dr. V. K. Tripathi'
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* ROLE SPECIFIC FIELDS */}

                  {/* 1. STUDENT REGISTRATION FIELDS */}
                  {selectedRole === 'student' && (
                    <div className="space-y-4 pt-1">
                      
                      {/* Student ID with Dynamic Regex Validation */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {targetInst.studentIdLabel} (Validated by Admin Rule)
                          </label>
                          <span className="text-[10px] text-gray-500 font-mono">
                            Pattern: {targetInst.studentIdRegex}
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder={`e.g. ${targetInst.studentIdExample}`}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                              !studentId 
                                ? 'border-gray-300 focus:ring-2 focus:ring-[#114232]' 
                                : studentIdValidation?.isValid 
                                ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500 text-gray-900' 
                                : 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400 text-gray-900'
                            }`}
                          />
                          {studentId && (
                            <div className="absolute right-3 top-2.5">
                              {studentIdValidation?.isValid ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-rose-500" />
                              )}
                            </div>
                          )}
                        </div>

                        {studentId && (
                          <p className={`text-[11px] mt-1 flex items-center ${
                            studentIdValidation?.isValid ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'
                          }`}>
                            {studentIdValidation?.message}
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Student Mobile Number (10 Digits)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      {/* Hostel & Room Number */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Hostel Mess
                          </label>
                          <select
                            value={selectedHostel || targetInst.hostels[0]}
                            onChange={(e) => setSelectedHostel(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                          >
                            {targetInst.hostels.map(h => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Room Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={roomNumber}
                              onChange={(e) => setRoomNumber(e.target.value)}
                              placeholder="e.g. A-214"
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#114232]"
                            />
                            <Home className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3.5" />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 2. MESS MANAGER REGISTRATION FIELDS */}
                  {selectedRole === 'manager' && (
                    <div className="space-y-4 pt-1">
                      
                      {/* Mess License / FSSAI */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Mess License / FSSAI Registration Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={messLicense}
                            onChange={(e) => setMessLicense(e.target.value)}
                            placeholder="e.g. FSSAI-UP-2026-884920"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold focus:ring-2 focus:ring-[#D96B43]"
                          />
                          <FileBadge className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Official food safety license or institute mess tender registration code.
                        </p>
                      </div>

                      {/* Official Phone */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Legit Official Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 9415288301"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#D96B43]"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      {/* Official Email */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Official Mess Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. mess.supervisor@itbhu.ac.in"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#D96B43]"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      {/* Assigned Hostel */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Assigned Hostel Mess Kitchen
                        </label>
                        <select
                          value={managerHostel || targetInst.hostels[0]}
                          onChange={(e) => setManagerHostel(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#D96B43]"
                        >
                          {targetInst.hostels.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>

                    </div>
                  )}

                  {/* 3. ADMINISTRATOR REGISTRATION FIELDS */}
                  {selectedRole === 'admin' && (
                    <div className="space-y-4 pt-1">
                      
                      {/* College ID / Faculty ID */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Official College Faculty / Administrator ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={adminStaffId}
                            onChange={(e) => setAdminStaffId(e.target.value)}
                            placeholder="e.g. FAC-BHU-2018 or WARDEN-44"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-900"
                          />
                          <FileBadge className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Used to verify legitimate campus administrative authority over the mess committee.
                        </p>
                      </div>

                      {/* Official College Email */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Official Institutional College Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. warden.rajputana@itbhu.ac.in"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-blue-900"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Committee Role / Designation
                        </label>
                        <input
                          type="text"
                          required
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. Mess Warden / Dean Student Affairs"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-blue-900"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Official Contact Phone
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 9450012099"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-blue-900"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start space-x-2">
                        <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <span>
                          <strong>Administrative In-Charge Privileges:</strong> You will be able to customize student ID conditions, inspect all student grievances, set cut-offs, and monitor campus waste.
                        </span>
                      </div>

                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={Boolean(selectedRole === 'student' && studentId && !studentIdValidation?.isValid)}
                      className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
                        selectedRole === 'student' ? 'bg-[#114232] hover:bg-[#0D382B]' :
                        selectedRole === 'manager' ? 'bg-[#D96B43] hover:bg-[#C2410C]' :
                        'bg-blue-900 hover:bg-blue-950'
                      }`}
                    >
                      <span>
                        Complete Registration as {selectedRole === 'student' ? 'Student' : selectedRole === 'manager' ? 'Mess Maharaj' : 'Administrator'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">
                      Sign In to Your MessMitra Account
                    </h3>
                    <p className="text-xs text-[#596A7A] mt-0.5">
                      Log in using your Student ID, Mess Manager Email, or Administrator Staff ID.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Select Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setLoginRole('student')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 ${
                          loginRole === 'student' ? 'bg-[#114232] text-white border-[#114232]' : 'bg-[#F8F9F5] text-gray-700 border-gray-200'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginRole('manager')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 ${
                          loginRole === 'manager' ? 'bg-[#D96B43] text-white border-[#D96B43]' : 'bg-[#F8F9F5] text-gray-700 border-gray-200'
                        }`}
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Manager</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginRole('admin')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 ${
                          loginRole === 'admin' ? 'bg-blue-900 text-white border-blue-900' : 'bg-[#F8F9F5] text-gray-700 border-gray-200'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {loginRole === 'student' ? 'Student ID / Roll Number' : loginRole === 'manager' ? 'Mess Manager Email' : 'Faculty / Staff ID or Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={
                        loginRole === 'student' ? 'e.g. 21075024' :
                        loginRole === 'manager' ? 'e.g. mess.rajputana@itbhu.ac.in' :
                        'e.g. FAC-BHU-2018'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold focus:ring-2 focus:ring-[#114232]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#114232] hover:bg-[#0D382B] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <span className="text-xs text-gray-500">Don't have an account yet? </span>
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-xs font-bold text-[#114232] hover:underline"
                    >
                      Register Now
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#114232]">MessMitra</span>
            <span>•</span>
            <span>Space and beyond : Ideathon 2026</span>
            <span>•</span>
            <span>Team Blast [Aayush Singh] • IIT (BHU) Varanasi</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Scalable Multi-Institutional Cloud Architecture
          </div>
        </div>
      </footer>

    </div>
  );
};
