/**
 * SchoolOS Domain Types & RBAC Definitions
 * Multi-tenant architecture for AI-Native School Operating System
 */

export type Role =
  | 'super_admin'
  | 'school_owner'
  | 'school_admin'
  | 'principal'
  | 'vice_principal'
  | 'accountant'
  | 'teacher'
  | 'class_teacher'
  | 'parent'
  | 'student'
  | 'staff';

export type ModuleName =
  | 'dashboard'
  | 'pulse'
  | 'students'
  | 'teachers'
  | 'academics'
  | 'attendance'
  | 'exams'
  | 'fees'
  | 'crm'
  | 'operations'
  | 'copilot'
  | 'settings'
  | 'audit_logs';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'export'
  | 'print'
  | 'configure';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  avatarUrl?: string;
  phone?: string;
  campusId?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  customPermissions?: Partial<Record<ModuleName, PermissionAction[]>>;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  code: string; // e.g. DPS-01
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge';
  logoUrl?: string;
  tagline?: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  currentAcademicYearId: string;
  plan: 'starter' | 'growth' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'suspended';
  currency: string;
  currencySymbol: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  settings: {
    minAttendancePercent: number;
    attendanceAlertThreshold: number;
    feeLateFinePerDay: number;
    allowParentLeaveApplication: boolean;
    enableWhatsAppAlerts: boolean;
    gradingScale: {
      grade: string;
      minScore: number;
      maxScore: number;
      gpa: number;
      remark: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string; // e.g. 2026-2027
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Campus {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  city: string;
  isMain: boolean;
}

export interface ClassRoom {
  id: string;
  tenantId: string;
  name: string; // e.g. Grade 10
  code: string; // e.g. G10
  numericGrade: number;
  capacity: number;
  description?: string;
}

export interface Section {
  id: string;
  tenantId: string;
  classId: string;
  name: string; // e.g. Section A
  capacity: number;
  roomNo?: string;
  classTeacherId?: string;
}

export interface Subject {
  id: string;
  tenantId: string;
  name: string; // e.g. Mathematics
  code: string; // e.g. MATH-101
  type: 'theory' | 'practical' | 'both';
  classIds: string[];
  maxMarks: number;
  passingMarks: number;
  weightage: number;
}

export type RiskStatus = 'stable' | 'monitor' | 'needs_attention' | 'improving';

export interface StudentDocument {
  id: string;
  title: string;
  type: 'birth_cert' | 'transfer_cert' | 'marksheet' | 'medical' | 'id_proof';
  url: string;
  uploadedAt: string;
}

export interface Student {
  id: string;
  tenantId: string;
  admissionNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  bloodGroup: string;
  governmentId?: string; // Aadhaar / National ID
  admissionDate: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  house?: string;
  previousSchool?: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  parentGuardian: {
    fatherName: string;
    fatherPhone: string;
    fatherEmail?: string;
    fatherOccupation?: string;
    motherName: string;
    motherPhone: string;
    motherEmail?: string;
    motherOccupation?: string;
    emergencyContactPhone: string;
    residentialAddress: string;
  };
  // Operational Metrics
  attendancePercentage: number;
  academicAverage: number;
  feeBalance: number;
  riskStatus: RiskStatus;
  riskReasons: string[];
  recommendedActions: string[];
  documents: StudentDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  tenantId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  email: string;
  phone: string;
  address: string;
  qualifications: string[];
  experienceYears: number;
  joiningDate: string;
  department: string; // e.g. Sciences, Humanities, Mathematics
  designation: string; // e.g. Senior PGT, TGT, Head of Dept
  employmentType: 'full_time' | 'part_time' | 'contract';
  assignedSubjects: {
    subjectId: string;
    classId: string;
    sectionId: string;
  }[];
  isClassTeacherOf?: {
    classId: string;
    sectionId: string;
  };
  status: 'active' | 'on_leave' | 'resigned';
  todayAttendance: 'present' | 'absent' | 'on_leave' | 'late';
  createdAt: string;
  updatedAt: string;
}

export interface SchoolPulseItem {
  id: string;
  type: 'attendance' | 'fees' | 'academics' | 'staff' | 'admissions' | 'approvals';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  count?: number;
  metric?: string;
  actionLabel: string;
  actionType: 'view_attendance' | 'view_fees' | 'view_students' | 'view_staff' | 'view_crm';
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: 'create' | 'update' | 'delete' | 'login' | 'ai_query' | 'status_change' | 'onboarding';
  module: ModuleName;
  recordId?: string;
  details: string;
  timestamp: string;
  before?: any;
  after?: any;
}

export interface AppNotification {
  id: string;
  tenantId: string;
  userId?: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  channel: 'in_app' | 'email' | 'whatsapp' | 'sms';
  isRead: boolean;
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'leave';

export interface StudentAttendanceRecord {
  id: string;
  tenantId: string;
  studentId: string;
  classId: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedByUserId: string;
  markedAt: string;
}

export interface StudentLeaveApplication {
  id: string;
  tenantId: string;
  studentId: string;
  applicantName: string;
  applicantRole: 'parent' | 'student';
  startDate: string;
  endDate: string;
  leaveType: 'sick' | 'family' | 'medical' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedByUserId?: string;
  reviewedByUserName?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
}

export interface FacultyLeaveApplication {
  id: string;
  tenantId: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  leaveType: 'casual' | 'medical' | 'earned' | 'maternity' | 'duty';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  periodsImpacted: {
    periodNumber: number;
    classId: string;
    sectionId: string;
    subjectId: string;
  }[];
  appliedAt: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
}

export interface WhatsAppNotificationPayload {
  recipientPhone: string;
  recipientName: string;
  studentName: string;
  schoolName: string;
  message: string;
  templateType: 'absent_alert' | 'threshold_warning' | 'leave_approved' | 'fee_due';
  timestamp: string;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export interface TimetableSlot {
  id: string;
  tenantId: string;
  classId: string;
  sectionId: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number; // 1 to 8
  subjectId: string;
  teacherId: string;
  roomNo?: string;
}

export interface Exam {
  id: string;
  tenantId: string;
  academicYearId: string;
  name: string; // e.g. "Term 1 Pre-Board Examination"
  type: 'unit_test' | 'quarterly' | 'half_yearly' | 'pre_board' | 'annual';
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'published';
  applicableClassIds: string[];
}

export interface StudentExamMark {
  id: string;
  tenantId: string;
  examId: string;
  studentId: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  isPassed: boolean;
  teacherRemarks?: string;
  updatedAt: string;
}

export interface ReportCardRemarkDraft {
  studentName: string;
  overallGrade: string;
  attendancePercentage: number;
  academicAverage: number;
  strengths: string[];
  growthAreas: string[];
  suggestedTeacherRemark: string;
  suggestedPrincipalRemark: string;
}

// --- Admissions CRM Types ---
export type LeadStage =
  | 'inquiry'
  | 'campus_tour'
  | 'application_submitted'
  | 'assessment'
  | 'approved'
  | 'enrolled'
  | 'lost';

export type LeadSource = 'website' | 'referral' | 'walk_in' | 'social_media' | 'event' | 'education_fair';

export interface AdmissionLead {
  id: string;
  tenantId: string;
  studentName: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  applyingForClassId: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  source: LeadSource;
  stage: LeadStage;
  leadScore: number; // 0-100 likelihood of conversion
  notes?: string;
  scheduledTourDate?: string;
  assessmentScore?: number;
  createdAt: string;
  updatedAt: string;
}

// --- Automation & AI Agents Types ---
export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  triggerEvent: 'attendance_below_threshold' | 'fee_overdue' | 'exam_marks_regression' | 'leave_applied' | 'lead_created';
  condition: string;
  actionType: 'send_whatsapp' | 'send_email' | 'create_task' | 'flag_student' | 'require_human_approval';
  targetAudience: 'parents' | 'teachers' | 'principal' | 'accountant';
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: string;
}

export interface AiAgentConfig {
  id: string;
  tenantId: string;
  agentName: string;
  role: string;
  description: string;
  status: 'active' | 'paused' | 'standby';
  confidenceScore: number;
  actionsPerformedToday: number;
  pendingApprovalsCount: number;
  iconName: string;
}

export interface PendingAutomationApproval {
  id: string;
  tenantId: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  actionType: 'whatsapp_dispatch' | 'fee_followup' | 'academic_remedial' | 'substitute_booking';
  recipientSummary: string;
  payloadSummary: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// --- Transport & Fleet Types ---
export interface BusRouteStop {
  id: string;
  stopName: string;
  morningPickupTime: string;
  eveningDropTime: string;
  studentIds: string[];
}

export interface BusVehicle {
  id: string;
  tenantId: string;
  vehicleNo: string; // e.g. "DL-01-AB-4021"
  busModel: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  driverLicenseNo: string;
  conductorName: string;
  conductorPhone: string;
  gpsDeviceId: string;
  insuranceExpiryDate: string;
  fitnessCertExpiryDate: string;
  status: 'on_route' | 'idle' | 'maintenance';
}

export interface BusRoute {
  id: string;
  tenantId: string;
  routeName: string;
  routeCode: string; // e.g. "R-01"
  vehicleId: string;
  morningStartTime: string;
  eveningStartTime: string;
  stops: BusRouteStop[];
}

export interface LiveBusTelemetry {
  vehicleId: string;
  routeId: string;
  speedKmH: number;
  currentStopName: string;
  nextStopName: string;
  nextStopEtaMinutes: number;
  status: 'on_time' | 'delayed' | 'halted';
  sosAlert: boolean;
}

// --- Library Management Types ---
export interface LibraryBook {
  id: string;
  tenantId: string;
  isbn: string;
  accessionNo: string;
  title: string;
  author: string;
  category: 'Sciences' | 'Mathematics' | 'Literature' | 'History' | 'Computer Science' | 'Fiction' | 'Reference';
  rackShelfLocation: string; // e.g. "Rack B-4"
  totalCopies: number;
  availableCopies: number;
}

export interface BookCirculationRecord {
  id: string;
  tenantId: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  lateFineAmount: number;
}

// --- Official Certificates & Documents Types ---
export type CertificateType =
  | 'transfer_certificate'
  | 'bonafide_certificate'
  | 'character_certificate'
  | 'fee_tax_80c';

export interface CertificateRecord {
  id: string;
  tenantId: string;
  certificateNo: string; // e.g. "TC/2026/042"
  type: CertificateType;
  studentId: string;
  studentName: string;
  studentClass: string;
  admissionNo: string;
  issueDate: string;
  purpose: string;
  reasonForLeaving?: string;
  conduct: 'Exemplary' | 'Very Good' | 'Good' | 'Satisfactory';
  promotedToNextClass?: boolean;
  duesClearedMonth?: string;
  academicYear: string;
  status: 'issued' | 'draft' | 'cancelled';
  issuedByUserId?: string;
}

// --- Communication & Calendar Types ---
export interface SchoolNotice {
  id: string;
  tenantId: string;
  noticeNo: string; // e.g. "CIR/2026/08"
  title: string;
  content: string;
  targetAudience: 'all' | 'parents' | 'teachers' | 'students';
  priority: 'urgent' | 'important' | 'normal';
  publishDate: string;
  publisherName: string;
  attachmentName?: string;
}

export interface SchoolEvent {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: 'holiday' | 'exam' | 'ptm' | 'sports' | 'cultural' | 'academic';
  isAllDay: boolean;
  location?: string;
}

// --- Human Resources & Staff Payroll Types ---
export interface StaffPayrollRecord {
  id: string;
  tenantId: string;
  staffId: string;
  staffName: string;
  designation: string;
  department: string;
  month: string;
  payDate: string;
  bankAccountNo: string;
  pfNumber: string;
  panNumber: string;

  // Earnings
  basicSalary: number;
  hra: number;
  da: number;
  specialAllowance: number;
  totalGrossSalary: number;

  // Deductions
  providentFund: number;
  tds: number;
  professionalTax: number;
  totalDeductions: number;

  netSalary: number;
  paymentStatus: 'paid' | 'pending' | 'processing';
  paymentMode: 'bank_transfer' | 'cheque' | 'neft';
  transactionRef?: string;
}


