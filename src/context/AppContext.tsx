import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Institution, 
  UserProfile, 
  MealMenu, 
  MealRegistration, 
  Concern, 
  LeftoverLog, 
  NotificationItem, 
  UserRole,
  ConcernStatus
} from '../types';
import { 
  INITIAL_INSTITUTIONS, 
  INITIAL_USERS, 
  INITIAL_MENUS, 
  INITIAL_CONCERNS, 
  INITIAL_LEFTOVER_LOGS, 
  INITIAL_NOTIFICATIONS,
  HISTORICAL_ATTENDANCE
} from '../data/mockData';

interface AppContextType {
  institutions: Institution[];
  currentInstitution: Institution;
  setInstitutionById: (id: string) => void;
  updateInstitution: (updated: Institution) => void;
  createInstitution: (newInst: Omit<Institution, 'id' | 'createdAt'>) => Institution;

  users: UserProfile[];
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;
  loginUser: (identifier: string, role?: UserRole) => { success: boolean; error?: string };

  registerStudent: (data: {
    institutionId: string;
    studentId: string;
    name: string;
    email?: string;
    phoneNumber: string;
    hostel: string;
    roomNumber: string;
  }) => { success: boolean; error?: string; user?: UserProfile };

  registerManager: (data: {
    institutionId: string;
    name: string;
    email: string;
    phoneNumber: string;
    hostel: string;
    messLicense: string;
  }) => { success: boolean; error?: string; user?: UserProfile };

  registerAdmin: (data: {
    institutionId: string;
    name: string;
    email: string;
    phoneNumber: string;
    adminStaffId: string;
    designation: string;
  }) => { success: boolean; error?: string; user?: UserProfile };

  validateStudentId: (studentId: string, institutionId?: string) => { isValid: boolean; message: string };

  menus: MealMenu[];
  updateMenu: (updated: MealMenu) => void;

  registrations: MealRegistration[];
  registerMealIntent: (menuId: string, status: 'eating' | 'skipping') => void;
  getUserMealRegistration: (menuId: string) => MealRegistration | undefined;

  concerns: Concern[];
  submitConcern: (concernData: {
    title: string;
    description: string;
    category: Concern['category'];
    mealType?: Concern['mealType'];
    mealDate?: string;
    dishAffected?: string;
    photoUrl?: string;
  }) => Concern;
  updateConcernStatus: (
    concernId: string, 
    status: ConcernStatus, 
    details?: {
      assignedTo?: string;
      committeeReviewNote?: string;
      resolutionSummary?: string;
    }
  ) => void;

  leftoverLogs: LeftoverLog[];
  logLeftover: (log: Omit<LeftoverLog, 'id' | 'timestamp' | 'loggedBy'>) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  historicalAttendance: typeof HISTORICAL_ATTENDANCE;
  isRealtimeSyncing: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INSTITUTIONS: 'messmitra_institutions_v2',
  CURRENT_INSTITUTION_ID: 'messmitra_active_inst_id_v2',
  USERS: 'messmitra_users_v2',
  CURRENT_USER: 'messmitra_current_user_v2',
  MENUS: 'messmitra_menus_v2',
  REGISTRATIONS: 'messmitra_registrations_v2',
  CONCERNS: 'messmitra_concerns_v2',
  LEFTOVERS: 'messmitra_leftovers_v2',
  NOTIFICATIONS: 'messmitra_notifications_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Institutions
  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
      return stored ? JSON.parse(stored) : INITIAL_INSTITUTIONS;
    } catch {
      return INITIAL_INSTITUTIONS;
    }
  });

  const [currentInstId, setCurrentInstId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_INSTITUTION_ID) || 'iit-bhu';
    } catch {
      return 'iit-bhu';
    }
  });

  const currentInstitution = useMemo(() => {
    return institutions.find(i => i.id === currentInstId) || institutions[0] || INITIAL_INSTITUTIONS[0];
  }, [institutions, currentInstId]);

  // 2. Users Collection
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Logged-in User (null when on landing / login screen)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.uid) return parsed;
      }
      return null; // Prompt user to register or login on first visit!
    } catch {
      return null;
    }
  });

  // 3. Menus
  const [menus, setMenus] = useState<MealMenu[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MENUS);
      return stored ? JSON.parse(stored) : INITIAL_MENUS;
    } catch {
      return INITIAL_MENUS;
    }
  });

  // 4. Meal Registrations
  const [registrations, setRegistrations] = useState<MealRegistration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 5. Concerns
  const [concerns, setConcerns] = useState<Concern[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONCERNS);
      return stored ? JSON.parse(stored) : INITIAL_CONCERNS;
    } catch {
      return INITIAL_CONCERNS;
    }
  });

  // 6. Leftovers
  const [leftoverLogs, setLeftoverLogs] = useState<LeftoverLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEFTOVERS);
      return stored ? JSON.parse(stored) : INITIAL_LEFTOVER_LOGS;
    } catch {
      return INITIAL_LEFTOVER_LOGS;
    }
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRealtimeSyncing] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(institutions));
      localStorage.setItem(STORAGE_KEYS.CURRENT_INSTITUTION_ID, currentInstId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
      localStorage.setItem(STORAGE_KEYS.CONCERNS, JSON.stringify(concerns));
      localStorage.setItem(STORAGE_KEYS.LEFTOVERS, JSON.stringify(leftoverLogs));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error("Storage save failed", e);
    }
  }, [institutions, currentInstId, users, currentUser, menus, registrations, concerns, leftoverLogs, notifications]);

  // BroadcastChannel for live cross-tab updates
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('messmitra_sync_bus');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'NEW_CONCERN') {
          setConcerns((prev) => [payload, ...prev.filter(c => c.id !== payload.id)]);
        } else if (type === 'CONCERN_UPDATED') {
          setConcerns((prev) => prev.map(c => c.id === payload.id ? payload : c));
        } else if (type === 'REGISTRATION_UPDATED') {
          setRegistrations((prev) => {
            const exists = prev.some(r => r.id === payload.id);
            return exists ? prev.map(r => r.id === payload.id ? payload : r) : [payload, ...prev];
          });
        } else if (type === 'NEW_NOTIFICATION') {
          setNotifications((prev) => [payload, ...prev]);
        }
      };
      return () => channel.close();
    }
  }, []);

  const broadcastEvent = (type: string, payload: any) => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('messmitra_sync_bus');
        channel.postMessage({ type, payload });
        channel.close();
      }
    } catch {
      // ignore
    }
  };

  // Student ID Validator
  const validateStudentId = (studentId: string, institutionId?: string): { isValid: boolean; message: string } => {
    const inst = institutionId 
      ? institutions.find(i => i.id === institutionId) || currentInstitution 
      : currentInstitution;

    if (!studentId || !studentId.trim()) {
      return { isValid: false, message: `Please enter your ${inst.studentIdLabel}` };
    }

    try {
      const regex = new RegExp(inst.studentIdRegex);
      if (!regex.test(studentId.trim())) {
        return { 
          isValid: false, 
          message: `Invalid format for ${inst.shortCode}. Condition: ${inst.studentIdFormatDesc} (e.g. ${inst.studentIdExample})` 
        };
      }
      return { isValid: true, message: `Valid ${inst.studentIdLabel} for ${inst.shortCode}` };
    } catch {
      return { isValid: true, message: 'Valid format' };
    }
  };

  const setInstitutionById = (id: string) => {
    setCurrentInstId(id);
    const target = institutions.find(i => i.id === id);
    if (target) {
      showToast(`Switched campus to ${target.name}`);
    }
  };

  const updateInstitution = (updated: Institution) => {
    setInstitutions(prev => prev.map(inst => inst.id === updated.id ? updated : inst));
    showToast(`Updated student ID policy and rules for ${updated.shortCode}`);
  };

  const createInstitution = (newInstData: Omit<Institution, 'id' | 'createdAt'>): Institution => {
    const newInst: Institution = {
      ...newInstData,
      id: `inst-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setInstitutions(prev => [...prev, newInst]);
    showToast(`Campus ${newInst.name} successfully registered`);
    return newInst;
  };

  // REGISTER STUDENT
  const registerStudent = (data: {
    institutionId: string;
    studentId: string;
    name: string;
    email?: string;
    phoneNumber: string;
    hostel: string;
    roomNumber: string;
  }) => {
    const inst = institutions.find(i => i.id === data.institutionId) || currentInstitution;
    const validation = validateStudentId(data.studentId, inst.id);
    if (!validation.isValid) {
      return { success: false, error: validation.message };
    }

    if (!data.phoneNumber || data.phoneNumber.trim().length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    if (!data.roomNumber || !data.roomNumber.trim()) {
      return { success: false, error: 'Please enter your room number' };
    }

    // Check if duplicate studentId in same institution
    const existing = users.find(
      u => u.role === 'student' && 
      u.institutionId === inst.id && 
      u.studentId?.toLowerCase() === data.studentId.trim().toLowerCase()
    );

    if (existing) {
      return { 
        success: false, 
        error: `A student with ${inst.studentIdLabel} "${data.studentId}" is already registered. Please login.` 
      };
    }

    const newStudent: UserProfile = {
      uid: `student-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      email: data.email?.trim() || `${data.studentId.toLowerCase()}@${inst.shortCode.toLowerCase()}.edu`,
      role: 'student',
      institutionId: inst.id,
      studentId: data.studentId.trim(),
      hostel: data.hostel,
      roomNumber: data.roomNumber.trim(),
      phoneNumber: data.phoneNumber.trim(),
      semesterFee: 24000,
      estimatedValueConsumed: 76,
      totalMealsServed: 140,
      registeredAt: new Date().toISOString(),
    };

    setUsers(prev => [newStudent, ...prev]);
    setCurrentInstId(inst.id);
    setCurrentUser(newStudent);
    showToast(`Welcome ${newStudent.name}! You are registered as Student.`);
    return { success: true, user: newStudent };
  };

  // REGISTER MESS MANAGER
  const registerManager = (data: {
    institutionId: string;
    name: string;
    email: string;
    phoneNumber: string;
    hostel: string;
    messLicense: string;
  }) => {
    if (!data.messLicense || data.messLicense.trim().length < 4) {
      return { success: false, error: 'Please provide a valid Mess License or FSSAI registration number' };
    }
    if (!data.phoneNumber || data.phoneNumber.trim().length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit official phone number' };
    }

    const inst = institutions.find(i => i.id === data.institutionId) || currentInstitution;

    const newManager: UserProfile = {
      uid: `mgr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'manager',
      institutionId: inst.id,
      hostel: data.hostel,
      messLicense: data.messLicense.trim(),
      phoneNumber: data.phoneNumber.trim(),
      totalMealsServed: 0,
      registeredAt: new Date().toISOString(),
    };

    setUsers(prev => [newManager, ...prev]);
    setCurrentInstId(inst.id);
    setCurrentUser(newManager);
    showToast(`Welcome Maharaj / Manager ${newManager.name}! Mess kitchen access granted.`);
    return { success: true, user: newManager };
  };

  // REGISTER ADMINISTRATOR
  const registerAdmin = (data: {
    institutionId: string;
    name: string;
    email: string;
    phoneNumber: string;
    adminStaffId: string;
    designation: string;
  }) => {
    if (!data.adminStaffId || !data.adminStaffId.trim()) {
      return { success: false, error: 'Please enter your official College Faculty / Staff ID' };
    }
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'Please enter your official institutional email' };
    }
    if (!data.phoneNumber || data.phoneNumber.trim().length < 10) {
      return { success: false, error: 'Please enter a valid phone number' };
    }

    const inst = institutions.find(i => i.id === data.institutionId) || currentInstitution;

    const newAdmin: UserProfile = {
      uid: `adm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'admin',
      institutionId: inst.id,
      adminStaffId: data.adminStaffId.trim(),
      designation: data.designation.trim() || 'Mess Committee Administrator',
      phoneNumber: data.phoneNumber.trim(),
      registeredAt: new Date().toISOString(),
    };

    setUsers(prev => [newAdmin, ...prev]);
    setCurrentInstId(inst.id);
    setCurrentUser(newAdmin);
    showToast(`Administrator rights granted to ${newAdmin.name} for ${inst.shortCode}!`);
    return { success: true, user: newAdmin };
  };

  // LOGIN USER
  const loginUser = (identifier: string, role?: UserRole) => {
    const trimmed = identifier.trim().toLowerCase();

    // Search by studentId, email, or adminStaffId
    const found = users.find(u => {
      const matchId = u.studentId?.toLowerCase() === trimmed;
      const matchEmail = u.email.toLowerCase() === trimmed;
      const matchStaff = u.adminStaffId?.toLowerCase() === trimmed;
      const matchRole = role ? u.role === role : true;
      return (matchId || matchEmail || matchStaff) && matchRole;
    });

    if (found) {
      setCurrentInstId(found.institutionId);
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}! Signed in as ${found.role.toUpperCase()}.`);
      return { success: true };
    }

    return { 
      success: false, 
      error: `No registered account found matching "${identifier}". Please check your details or register a new account.` 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out of MessMitra');
  };

  const updateMenu = (updated: MealMenu) => {
    setMenus(prev => prev.map(m => m.id === updated.id ? updated : m));
    showToast(`Updated menu for ${updated.dayName} ${updated.mealType}`);
  };

  const registerMealIntent = (menuId: string, status: 'eating' | 'skipping') => {
    if (!currentUser) return;
    const menu = menus.find(m => m.id === menuId);
    if (!menu) return;

    const existingIndex = registrations.findIndex(
      r => r.mealMenuId === menuId && r.studentUid === currentUser.uid
    );

    let updatedRegistration: MealRegistration;

    if (existingIndex >= 0) {
      updatedRegistration = {
        ...registrations[existingIndex],
        status,
        timestamp: new Date().toISOString(),
      };
      setRegistrations(prev => prev.map((r, i) => i === existingIndex ? updatedRegistration : r));
    } else {
      updatedRegistration = {
        id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        institutionId: currentInstitution.id,
        mealMenuId: menuId,
        studentUid: currentUser.uid,
        studentId: currentUser.studentId || '21075024',
        studentName: currentUser.name,
        hostel: currentUser.hostel || currentInstitution.hostels[0],
        date: menu.date,
        mealType: menu.mealType,
        status,
        checkedIn: false,
        timestamp: new Date().toISOString(),
      };
      setRegistrations(prev => [updatedRegistration, ...prev]);
    }

    // Dynamic adjustment of predicted attendance
    const delta = status === 'eating' ? 1 : -1;
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        const newPred = Math.max(10, m.predictedAttendance + delta);
        return {
          ...m,
          predictedAttendance: newPred,
          suggestedPrep: {
            riceKg: Math.round(newPred * 0.09),
            dalLiters: Math.round(newPred * 0.058),
            rotiPieces: Math.round(newPred * 2.05),
            sabziKg: Math.round(newPred * 0.071),
            saladCurdKg: Math.round(newPred * 0.051),
            portions: newPred,
          }
        };
      }
      return m;
    }));

    broadcastEvent('REGISTRATION_UPDATED', updatedRegistration);

    if (status === 'eating') {
      showToast(`Marked: You are eating ${menu.mealType}! Your plate is accounted for.`);
    } else {
      showToast(`Marked: Skipping ${menu.mealType}. Mess staff notified to avoid excess prep!`);
    }
  };

  const getUserMealRegistration = (menuId: string) => {
    if (!currentUser) return undefined;
    return registrations.find(r => r.mealMenuId === menuId && r.studentUid === currentUser.uid);
  };

  const submitConcern = (concernData: {
    title: string;
    description: string;
    category: Concern['category'];
    mealType?: Concern['mealType'];
    mealDate?: string;
    dishAffected?: string;
    photoUrl?: string;
  }): Concern => {
    if (!currentUser) throw new Error("Must be logged in to submit a concern");

    const newConcern: Concern = {
      id: `concern-${Date.now().toString().slice(-4)}`,
      institutionId: currentInstitution.id,
      studentUid: currentUser.uid,
      studentName: currentUser.name,
      studentId: currentUser.studentId || currentInstitution.studentIdExample,
      hostel: currentUser.hostel || currentInstitution.hostels[0],
      category: concernData.category,
      title: concernData.title.trim(),
      description: concernData.description.trim(),
      mealType: concernData.mealType,
      mealDate: concernData.mealDate || new Date().toISOString().split('T')[0],
      dishAffected: concernData.dishAffected?.trim(),
      photoUrl: concernData.photoUrl,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConcerns(prev => [newConcern, ...prev]);

    // Send notifications to Managers & Admins of this institution
    const managerNotif: NotificationItem = {
      id: `notif-${Date.now()}-mgr`,
      targetUid: 'manager-ramesh',
      institutionId: currentInstitution.id,
      title: `New Concern: ${newConcern.category.replace('_', ' ').toUpperCase()}`,
      message: `${newConcern.studentName} reported: "${newConcern.title}". Please review.`,
      type: 'concern_update',
      read: false,
      relatedConcernId: newConcern.id,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [managerNotif, ...prev]);
    broadcastEvent('NEW_CONCERN', newConcern);
    broadcastEvent('NEW_NOTIFICATION', managerNotif);

    showToast(`Concern submitted! Track the 4-step progress in real time.`);
    return newConcern;
  };

  const updateConcernStatus = (
    concernId: string, 
    status: ConcernStatus, 
    details?: {
      assignedTo?: string;
      committeeReviewNote?: string;
      resolutionSummary?: string;
    }
  ) => {
    setConcerns(prev => prev.map(c => {
      if (c.id === concernId) {
        const updated: Concern = {
          ...c,
          status,
          assignedTo: details?.assignedTo ?? c.assignedTo,
          committeeReviewNote: details?.committeeReviewNote ?? c.committeeReviewNote,
          resolutionSummary: details?.resolutionSummary ?? c.resolutionSummary,
          resolutionTimestamp: status === 'resolved' ? new Date().toISOString() : c.resolutionTimestamp,
          updatedAt: new Date().toISOString(),
        };

        const studentNotif: NotificationItem = {
          id: `notif-${Date.now()}-${status}`,
          targetUid: c.studentUid,
          institutionId: c.institutionId,
          title: `Concern Update: ${c.title.slice(0, 32)}...`,
          message: status === 'resolved' 
            ? `Your concern has been RESOLVED: ${details?.resolutionSummary || 'Remediation completed.'}` 
            : status === 'action_taken'
            ? `Action assigned to kitchen: ${details?.committeeReviewNote || 'Mess staff working on remedy.'}`
            : `Mess Committee has placed your concern under review.`,
          type: 'concern_update',
          read: false,
          relatedConcernId: c.id,
          createdAt: new Date().toISOString(),
        };

        setNotifications(nPrev => [studentNotif, ...nPrev]);
        broadcastEvent('CONCERN_UPDATED', updated);
        broadcastEvent('NEW_NOTIFICATION', studentNotif);

        return updated;
      }
      return c;
    }));

    showToast(`Concern updated to "${status.replace('_', ' ').toUpperCase()}"`);
  };

  const logLeftover = (logData: Omit<LeftoverLog, 'id' | 'timestamp' | 'loggedBy'>) => {
    const newLog: LeftoverLog = {
      ...logData,
      id: `log-${Date.now()}`,
      loggedBy: currentUser?.name || 'Mess Staff',
      timestamp: new Date().toISOString(),
    };
    setLeftoverLogs(prev => [newLog, ...prev]);

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}-waste`,
      targetUid: 'admin-warden',
      institutionId: currentInstitution.id,
      title: `Waste Logged: ${logData.mealType.toUpperCase()} (${logData.wasteWeightKg} kg)`,
      message: `${logData.wasteWeightKg} kg food waste recorded. Disposal via ${logData.disposalMethod}.`,
      type: 'waste_alert',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [adminNotif, ...prev]);

    showToast(`Logged ${logData.wasteWeightKg} kg leftover food for ${logData.mealType}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const unreadNotificationsCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter(n => !n.read && (n.targetUid === currentUser.uid || currentUser.role === 'admin')).length;
  }, [notifications, currentUser]);

  return (
    <AppContext.Provider
      value={{
        institutions,
        currentInstitution,
        setInstitutionById,
        updateInstitution,
        createInstitution,

        users,
        currentUser,
        setCurrentUser,
        logout,
        loginUser,
        registerStudent,
        registerManager,
        registerAdmin,
        validateStudentId,

        menus,
        updateMenu,

        registrations,
        registerMealIntent,
        getUserMealRegistration,

        concerns,
        submitConcern,
        updateConcernStatus,

        leftoverLogs,
        logLeftover,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,

        historicalAttendance: HISTORICAL_ATTENDANCE,
        isRealtimeSyncing,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
