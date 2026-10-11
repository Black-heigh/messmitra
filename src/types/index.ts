export type UserRole = 'student' | 'manager' | 'admin';

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type ConcernStatus = 'submitted' | 'under_review' | 'action_taken' | 'resolved';

export type ConcernCategory = 
  | 'food_quality' 
  | 'hygiene' 
  | 'quantity' 
  | 'timing' 
  | 'menu_variety' 
  | 'staff_behavior' 
  | 'cleanliness'
  | 'other';

export interface Institution {
  id: string;
  name: string;
  shortCode: string; // e.g. "IIT-BHU", "NIT-T"
  logo?: string;
  studentIdLabel: string; // e.g. "Roll Number", "Scholar ID"
  studentIdFormatDesc: string; // e.g. "8-digit roll number (e.g., 21075024)"
  studentIdRegex: string; // e.g. "^[0-9]{8}$"
  studentIdExample: string;
  hostels: string[];
  active: boolean;
  mealTimings: {
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
  };
  cutoffHours: {
    breakfast: string; // e.g. "21:00 (prev day)"
    lunch: string;     // e.g. "09:30"
    snacks: string;    // e.g. "15:00"
    dinner: string;    // e.g. "17:30"
  };
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  studentId?: string;
  hostel?: string;
  roomNumber?: string;
  phoneNumber?: string;
  messLicense?: string;
  adminStaffId?: string;
  designation?: string;
  avatarUrl?: string;
  semesterFee?: number;
  estimatedValueConsumed?: number; // percentage, e.g. 76
  totalMealsServed?: number;
  registeredAt?: string;
}

export interface IngredientSupplier {
  ingredient: string; // e.g. "Rice", "Cooking Oil", "Paneer"
  brand: string;      // e.g. "India Gate Classic", "Fortune Soya", "Amul Fresh"
  supplier: string;   // e.g. "Ganga Agro Distributors"
  certifications?: string; // e.g. "FSSAI Grade A, AGMARK"
}

export interface DishItem {
  id: string;
  name: string;
  category: 'main' | 'bread' | 'rice' | 'dal' | 'dessert' | 'beverage' | 'side';
  popularityPercent: number; // e.g. 92
  isSpecial?: boolean;
}

export interface MealMenu {
  id: string;
  institutionId: string;
  hostelId: string;
  date: string; // YYYY-MM-DD
  dayName: string; // Monday, Tuesday, etc.
  mealType: MealType;
  title: string;
  timing: string;
  cutoffTime: string;
  isCutoffPassed: boolean;
  photoUrl?: string;
  dishes: DishItem[];
  suppliers: IngredientSupplier[];
  predictedAttendance: number;
  actualAttendance?: number;
  suggestedPrep: {
    riceKg: number;
    dalLiters: number;
    rotiPieces: number;
    sabziKg: number;
    saladCurdKg: number;
    portions: number;
  };
}

export interface MealRegistration {
  id: string;
  institutionId: string;
  mealMenuId: string;
  studentUid: string;
  studentId: string;
  studentName: string;
  hostel: string;
  date: string;
  mealType: MealType;
  status: 'eating' | 'skipping';
  checkedIn: boolean;
  timestamp: string;
}

export interface ConcernProgressStep {
  step: number;
  title: string;
  statusKey: ConcernStatus;
  date?: string;
  note?: string;
  completed: boolean;
}

export interface Concern {
  id: string;
  institutionId: string;
  studentUid: string;
  studentName: string;
  studentId: string;
  hostel: string;
  category: ConcernCategory;
  title: string;
  description: string;
  mealType?: MealType;
  mealDate?: string;
  dishAffected?: string;
  photoUrl?: string;
  status: ConcernStatus;
  assignedTo?: string; // Mess staff or supervisor name
  committeeReviewNote?: string;
  resolutionSummary?: string;
  resolutionTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeftoverLog {
  id: string;
  institutionId: string;
  hostelId: string;
  date: string;
  mealType: MealType;
  wasteWeightKg: number;
  primaryDishes: string[];
  disposalMethod: 'composting' | 'biogas' | 'ngo_donation' | 'animal_feed';
  notes?: string;
  loggedBy: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  targetUid: string;
  institutionId: string;
  title: string;
  message: string;
  type: 'concern_update' | 'meal_reminder' | 'waste_alert' | 'menu_change' | 'general';
  read: boolean;
  relatedConcernId?: string;
  createdAt: string;
}

export interface AttendanceAnalyticsPoint {
  day: string;
  mealType: MealType;
  predicted: number;
  actual: number;
  wasteKg: number;
}
