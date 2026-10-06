import {
  Tenant,
  User,
  Student,
  Teacher,
  ClassRoom,
  Section,
  Subject,
  AuditLog,
  SchoolPulseItem,
  AppNotification,
  Role,
  AttendanceStatus,
  StudentAttendanceRecord,
  StudentLeaveApplication,
  FacultyLeaveApplication,
  WhatsAppNotificationPayload,
  DayOfWeek,
  TimetableSlot,
  Exam,
  StudentExamMark,
  ReportCardRemarkDraft,
  AdmissionLead,
  AutomationRule,
  AiAgentConfig,
  PendingAutomationApproval,
  BusVehicle,
  BusRoute,
  LibraryBook,
  BookCirculationRecord,
  CertificateRecord,
  CertificateType,
  SchoolNotice,
  SchoolEvent,
  StaffPayrollRecord,
} from '../types';

const STORAGE_KEYS = {
  TENANTS: 'schoolos_tenants_v1',
  USERS: 'schoolos_users_v1',
  STUDENTS: 'schoolos_students_v1',
  TEACHERS: 'schoolos_teachers_v1',
  CLASSES: 'schoolos_classes_v1',
  SECTIONS: 'schoolos_sections_v1',
  SUBJECTS: 'schoolos_subjects_v1',
  AUDIT_LOGS: 'schoolos_audit_logs_v1',
  NOTIFICATIONS: 'schoolos_notifications_v1',
  ATTENDANCE: 'schoolos_attendance_records_v1',
  STUDENT_LEAVES: 'schoolos_student_leaves_v1',
  FACULTY_LEAVES: 'schoolos_faculty_leaves_v1',
  TIMETABLE: 'schoolos_timetable_slots_v1',
  EXAMS: 'schoolos_exams_v1',
  EXAM_MARKS: 'schoolos_exam_marks_v1',
  LEADS: 'schoolos_admission_leads_v1',
  AUTOMATION_RULES: 'schoolos_automation_rules_v1',
  AI_AGENTS: 'schoolos_ai_agents_v1',
  PENDING_APPROVALS: 'schoolos_pending_approvals_v1',
  TRANSPORT_VEHICLES: 'schoolos_transport_vehicles_v1',
  TRANSPORT_ROUTES: 'schoolos_transport_routes_v1',
  LIBRARY_BOOKS: 'schoolos_library_books_v1',
  LIBRARY_CIRCULATION: 'schoolos_library_circulation_v1',
  CERTIFICATES: 'schoolos_certificates_v1',
  NOTICES: 'schoolos_school_notices_v1',
  EVENTS: 'schoolos_school_events_v1',
  PAYROLL: 'schoolos_staff_payroll_v1',
  CURRENT_TENANT_ID: 'schoolos_current_tenant_id_v1',
  CURRENT_USER_ID: 'schoolos_current_user_id_v1',
};

// Seed Tenants
const SEED_TENANTS: Tenant[] = [
  {
    id: 'tenant-dps',
    name: 'Delhi Public Academy',
    slug: 'delhi-public-academy',
    code: 'DPA-01',
    board: 'CBSE',
    tagline: 'Excellence in Education, Character in Leadership',
    logoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=150&auto=format&fit=crop&q=80',
    email: 'admin@dpa.edu',
    phone: '+91 11 2789 4500',
    website: 'https://dpa.schoolos.app',
    address: {
      street: 'Sector 14, Rohini',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110085',
      country: 'India',
    },
    currentAcademicYearId: 'ay-2026-2027',
    plan: 'professional',
    subscriptionStatus: 'active',
    currency: 'INR',
    currencySymbol: '₹',
    branding: {
      primaryColor: '#0f766e', // Deep Teal
      secondaryColor: '#0369a1', // Sky
      accentColor: '#f59e0b', // Amber
    },
    settings: {
      minAttendancePercent: 75,
      attendanceAlertThreshold: 70,
      feeLateFinePerDay: 50,
      allowParentLeaveApplication: true,
      enableWhatsAppAlerts: true,
      gradingScale: [
        { grade: 'A1', minScore: 91, maxScore: 100, gpa: 10, remark: 'Outstanding' },
        { grade: 'A2', minScore: 81, maxScore: 90, gpa: 9, remark: 'Excellent' },
        { grade: 'B1', minScore: 71, maxScore: 80, gpa: 8, remark: 'Very Good' },
        { grade: 'B2', minScore: 61, maxScore: 70, gpa: 7, remark: 'Good' },
        { grade: 'C1', minScore: 51, maxScore: 60, gpa: 6, remark: 'Above Average' },
        { grade: 'C2', minScore: 41, maxScore: 50, gpa: 5, remark: 'Average' },
        { grade: 'D', minScore: 33, maxScore: 40, gpa: 4, remark: 'Pass' },
        { grade: 'E', minScore: 0, maxScore: 32, gpa: 0, remark: 'Needs Remedial Support' },
      ],
    },
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'tenant-oakridge',
    name: 'Oakridge Global Academy',
    slug: 'oakridge-global',
    code: 'OGA-02',
    board: 'IB',
    tagline: 'Inquiring Minds, Global Citizens',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    email: 'contact@oakridge.edu',
    phone: '+91 80 4912 3000',
    website: 'https://oakridge.schoolos.app',
    address: {
      street: 'Whitefield Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      country: 'India',
    },
    currentAcademicYearId: 'ay-2026-2027',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    currency: 'INR',
    currencySymbol: '₹',
    branding: {
      primaryColor: '#1e3a8a', // Indigo / Navy
      secondaryColor: '#0d9488',
      accentColor: '#e11d48',
    },
    settings: {
      minAttendancePercent: 80,
      attendanceAlertThreshold: 75,
      feeLateFinePerDay: 100,
      allowParentLeaveApplication: true,
      enableWhatsAppAlerts: true,
      gradingScale: [
        { grade: '7', minScore: 90, maxScore: 100, gpa: 7, remark: 'Excellent' },
        { grade: '6', minScore: 80, maxScore: 89, gpa: 6, remark: 'Very Good' },
        { grade: '5', minScore: 70, maxScore: 79, gpa: 5, remark: 'Good' },
        { grade: '4', minScore: 60, maxScore: 69, gpa: 4, remark: 'Satisfactory' },
        { grade: '3', minScore: 50, maxScore: 59, gpa: 3, remark: 'Mediocre' },
        { grade: '2', minScore: 40, maxScore: 49, gpa: 2, remark: 'Poor' },
        { grade: '1', minScore: 0, maxScore: 39, gpa: 1, remark: 'Very Poor' },
      ],
    },
    createdAt: '2025-03-15T09:00:00.000Z',
    updatedAt: '2026-09-20T12:00:00.000Z',
  },
];

// Seed Users for Delhi Public Academy
const SEED_USERS: User[] = [
  {
    id: 'user-principal-dps',
    email: 'principal@dpa.edu',
    name: 'Dr. Rajesh Sharma',
    role: 'principal',
    tenantId: 'tenant-dps',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    phone: '+91 98100 23456',
    status: 'active',
    lastLoginAt: '2026-10-05T08:15:00.000Z',
  },
  {
    id: 'user-owner-dps',
    email: 'owner@dpa.edu',
    name: 'Mrs. Sunita Verma',
    role: 'school_owner',
    tenantId: 'tenant-dps',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    phone: '+91 98111 88990',
    status: 'active',
    lastLoginAt: '2026-10-04T16:00:00.000Z',
  },
  {
    id: 'user-admin-dps',
    email: 'admin@dpa.edu',
    name: 'Anand Kulkarni',
    role: 'school_admin',
    tenantId: 'tenant-dps',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    phone: '+91 98711 34567',
    status: 'active',
    lastLoginAt: '2026-10-05T07:30:00.000Z',
  },
  {
    id: 'user-teacher-meera',
    email: 'meera.s@dpa.edu',
    name: 'Meera Sengupta',
    role: 'class_teacher',
    tenantId: 'tenant-dps',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    phone: '+91 99201 11223',
    status: 'active',
    lastLoginAt: '2026-10-05T08:00:00.000Z',
  },
  {
    id: 'user-accountant-dps',
    email: 'accounts@dpa.edu',
    name: 'Rameshwar Gupta',
    role: 'accountant',
    tenantId: 'tenant-dps',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    phone: '+91 98109 44556',
    status: 'active',
    lastLoginAt: '2026-10-04T18:20:00.000Z',
  },
  {
    id: 'user-parent-arun',
    email: 'arun.kapoor@gmail.com',
    name: 'Arun Kapoor (Father)',
    role: 'parent',
    tenantId: 'tenant-dps',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    phone: '+91 98188 77665',
    status: 'active',
  },
  {
    id: 'user-superadmin',
    email: 'haanvimarketing@gmail.com',
    name: 'Super Admin (Platform)',
    role: 'super_admin',
    tenantId: 'tenant-dps',
    avatarUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
    phone: '+1 415 555 0199',
    status: 'active',
  },
];

// Seed Classes for DPS
const SEED_CLASSES: ClassRoom[] = [
  {
    id: 'class-g10',
    tenantId: 'tenant-dps',
    name: 'Grade 10',
    code: 'G10',
    numericGrade: 10,
    capacity: 120,
    description: 'Secondary School Board Exam Batch',
  },
  {
    id: 'class-g9',
    tenantId: 'tenant-dps',
    name: 'Grade 9',
    code: 'G9',
    numericGrade: 9,
    capacity: 120,
    description: 'Secondary School Foundation',
  },
  {
    id: 'class-g8',
    tenantId: 'tenant-dps',
    name: 'Grade 8',
    code: 'G8',
    numericGrade: 8,
    capacity: 100,
    description: 'Middle School Senior',
  },
  {
    id: 'class-g7',
    tenantId: 'tenant-dps',
    name: 'Grade 7',
    code: 'G7',
    numericGrade: 7,
    capacity: 100,
    description: 'Middle School Junior',
  },
  {
    id: 'class-g12',
    tenantId: 'tenant-dps',
    name: 'Grade 12',
    code: 'G12',
    numericGrade: 12,
    capacity: 140,
    description: 'Senior Secondary Board',
  },
];

// Seed Sections
const SEED_SECTIONS: Section[] = [
  {
    id: 'sec-g10-a',
    tenantId: 'tenant-dps',
    classId: 'class-g10',
    name: 'Section A (Aryabhata)',
    capacity: 40,
    roomNo: 'Room 301',
    classTeacherId: 'teacher-meera',
  },
  {
    id: 'sec-g10-b',
    tenantId: 'tenant-dps',
    classId: 'class-g10',
    name: 'Section B (Bhaskara)',
    capacity: 40,
    roomNo: 'Room 302',
    classTeacherId: 'teacher-vikram',
  },
  {
    id: 'sec-g9-a',
    tenantId: 'tenant-dps',
    classId: 'class-g9',
    name: 'Section A',
    capacity: 40,
    roomNo: 'Room 201',
    classTeacherId: 'teacher-ananya',
  },
  {
    id: 'sec-g8-a',
    tenantId: 'tenant-dps',
    classId: 'class-g8',
    name: 'Section A',
    capacity: 35,
    roomNo: 'Room 105',
  },
];

// Seed Subjects
const SEED_SUBJECTS: Subject[] = [
  {
    id: 'subj-math-10',
    tenantId: 'tenant-dps',
    name: 'Mathematics',
    code: 'MATH-10',
    type: 'theory',
    classIds: ['class-g10', 'class-g9', 'class-g8'],
    maxMarks: 100,
    passingMarks: 33,
    weightage: 100,
  },
  {
    id: 'subj-sci-10',
    tenantId: 'tenant-dps',
    name: 'Science & Laboratory',
    code: 'SCI-10',
    type: 'both',
    classIds: ['class-g10', 'class-g9'],
    maxMarks: 100,
    passingMarks: 33,
    weightage: 100,
  },
  {
    id: 'subj-eng-10',
    tenantId: 'tenant-dps',
    name: 'English Language & Literature',
    code: 'ENG-10',
    type: 'theory',
    classIds: ['class-g10', 'class-g9', 'class-g8', 'class-g7'],
    maxMarks: 100,
    passingMarks: 33,
    weightage: 100,
  },
  {
    id: 'subj-soc-10',
    tenantId: 'tenant-dps',
    name: 'Social Sciences',
    code: 'SOC-10',
    type: 'theory',
    classIds: ['class-g10', 'class-g9'],
    maxMarks: 100,
    passingMarks: 33,
    weightage: 100,
  },
  {
    id: 'subj-cs-10',
    tenantId: 'tenant-dps',
    name: 'Artificial Intelligence & Computer Apps',
    code: 'AI-10',
    type: 'both',
    classIds: ['class-g10', 'class-g9', 'class-g8'],
    maxMarks: 100,
    passingMarks: 33,
    weightage: 100,
  },
];

// Seed Teachers
const SEED_TEACHERS: Teacher[] = [
  {
    id: 'teacher-meera',
    tenantId: 'tenant-dps',
    employeeId: 'EMP-104',
    firstName: 'Meera',
    lastName: 'Sengupta',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '1988-06-14',
    email: 'meera.s@dpa.edu',
    phone: '+91 99201 11223',
    address: 'B-44, Shalimar Bagh, New Delhi',
    qualifications: ['M.Sc. Mathematics (Delhi University)', 'B.Ed.'],
    experienceYears: 12,
    joiningDate: '2016-04-01',
    department: 'Mathematics',
    designation: 'Senior PGT & Head of Department',
    employmentType: 'full_time',
    assignedSubjects: [
      { subjectId: 'subj-math-10', classId: 'class-g10', sectionId: 'sec-g10-a' },
      { subjectId: 'subj-math-10', classId: 'class-g9', sectionId: 'sec-g9-a' },
    ],
    isClassTeacherOf: { classId: 'class-g10', sectionId: 'sec-g10-a' },
    status: 'active',
    todayAttendance: 'present',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'teacher-vikram',
    tenantId: 'tenant-dps',
    employeeId: 'EMP-108',
    firstName: 'Dr. Vikram',
    lastName: 'Rathore',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '1982-11-20',
    email: 'vikram.r@dpa.edu',
    phone: '+91 98112 33445',
    address: 'C-12, Pitampura, New Delhi',
    qualifications: ['Ph.D. Physics (IIT Delhi)', 'M.Sc. Physics'],
    experienceYears: 16,
    joiningDate: '2014-07-15',
    department: 'Sciences',
    designation: 'Senior Physics Specialist',
    employmentType: 'full_time',
    assignedSubjects: [
      { subjectId: 'subj-sci-10', classId: 'class-g10', sectionId: 'sec-g10-b' },
    ],
    isClassTeacherOf: { classId: 'class-g10', sectionId: 'sec-g10-b' },
    status: 'active',
    todayAttendance: 'present',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'teacher-ananya',
    tenantId: 'tenant-dps',
    employeeId: 'EMP-115',
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '1992-03-08',
    email: 'ananya.d@dpa.edu',
    phone: '+91 98733 99887',
    address: 'A-2, Model Town, New Delhi',
    qualifications: ['M.A. English (JNU)', 'B.Ed.'],
    experienceYears: 7,
    joiningDate: '2020-09-01',
    department: 'Humanities & Languages',
    designation: 'TGT English',
    employmentType: 'full_time',
    assignedSubjects: [
      { subjectId: 'subj-eng-10', classId: 'class-g10', sectionId: 'sec-g10-a' },
      { subjectId: 'subj-eng-10', classId: 'class-g9', sectionId: 'sec-g9-a' },
    ],
    isClassTeacherOf: { classId: 'class-g9', sectionId: 'sec-g9-a' },
    status: 'on_leave',
    todayAttendance: 'on_leave',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2026-10-05T07:00:00.000Z',
  },
  {
    id: 'teacher-rohit',
    tenantId: 'tenant-dps',
    employeeId: 'EMP-120',
    firstName: 'Rohit',
    lastName: 'Choudhary',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '1990-09-12',
    email: 'rohit.c@dpa.edu',
    phone: '+91 98104 55667',
    address: 'D-80, Ashok Vihar, New Delhi',
    qualifications: ['B.Tech Computer Science', 'M.Tech Data Science'],
    experienceYears: 8,
    joiningDate: '2021-01-05',
    department: 'Technology',
    designation: 'Head of Computer Science & AI',
    employmentType: 'full_time',
    assignedSubjects: [
      { subjectId: 'subj-cs-10', classId: 'class-g10', sectionId: 'sec-g10-a' },
      { subjectId: 'subj-cs-10', classId: 'class-g10', sectionId: 'sec-g10-b' },
    ],
    status: 'active',
    todayAttendance: 'present',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
];

// Seed Students with Explainable Student Success Indicators
const SEED_STUDENTS: Student[] = [
  {
    id: 'student-aarav',
    tenantId: 'tenant-dps',
    admissionNo: 'DPA-2024-089',
    rollNo: '10A-01',
    firstName: 'Aarav',
    lastName: 'Kapoor',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2010-05-18',
    bloodGroup: 'B+',
    governmentId: '9845-2231-1092',
    admissionDate: '2024-04-01',
    academicYearId: 'ay-2026-2027',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    house: 'Shivaji House',
    previousSchool: 'St. Mary’s Convent',
    status: 'active',
    parentGuardian: {
      fatherName: 'Arun Kapoor',
      fatherPhone: '+91 98188 77665',
      fatherEmail: 'arun.kapoor@gmail.com',
      fatherOccupation: 'Senior Architect',
      motherName: 'Priya Kapoor',
      motherPhone: '+91 98188 77666',
      motherEmail: 'priya.k@gmail.com',
      motherOccupation: 'Financial Consultant',
      emergencyContactPhone: '+91 98188 77665',
      residentialAddress: 'Flat 402, Royal Residency, Rohini Sector 13, Delhi',
    },
    attendancePercentage: 68.4,
    academicAverage: 72.5,
    feeBalance: 14500,
    riskStatus: 'needs_attention',
    riskReasons: [
      'Attendance dropped below statutory 75% threshold (currently 68.4%)',
      'Mathematics unit test score dipped from 84% to 68%',
      '2 lab reports pending submission in Science',
    ],
    recommendedActions: [
      'Schedule 1-on-1 academic consultation with Ms. Meera Sengupta',
      'Notify parents regarding attendance remediation plan',
      'Assign peer study partner in Grade 10A',
    ],
    documents: [
      { id: 'doc-1', title: 'Birth Certificate', type: 'birth_cert', url: '#', uploadedAt: '2024-04-01' },
      { id: 'doc-2', title: 'Grade 9 Transfer Certificate', type: 'transfer_cert', url: '#', uploadedAt: '2024-04-01' },
    ],
    createdAt: '2024-04-01T10:00:00.000Z',
    updatedAt: '2026-10-04T12:00:00.000Z',
  },
  {
    id: 'student-diya',
    tenantId: 'tenant-dps',
    admissionNo: 'DPA-2023-014',
    rollNo: '10A-02',
    firstName: 'Diya',
    lastName: 'Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '2010-09-24',
    bloodGroup: 'O+',
    governmentId: '7741-9082-3341',
    admissionDate: '2023-04-01',
    academicYearId: 'ay-2026-2027',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    house: 'Tagore House',
    status: 'active',
    parentGuardian: {
      fatherName: 'Dr. Vivek Sharma',
      fatherPhone: '+91 99100 44332',
      fatherEmail: 'dr.vivek@hospital.org',
      fatherOccupation: 'Cardiologist',
      motherName: 'Dr. Neha Sharma',
      motherPhone: '+91 99100 44333',
      emergencyContactPhone: '+91 99100 44332',
      residentialAddress: 'Villa 18, Green Meadows, Rohini, Delhi',
    },
    attendancePercentage: 96.2,
    academicAverage: 94.8,
    feeBalance: 0,
    riskStatus: 'stable',
    riskReasons: [
      'Consistent top decile performance across all subjects',
      'High attendance record (96.2%)',
      'Lead participant in Inter-School Science Olympiad',
    ],
    recommendedActions: [
      'Nominate for Advanced STEM Leadership Track',
      'Encourage peer mentoring role',
    ],
    documents: [],
    createdAt: '2023-04-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'student-rohan',
    tenantId: 'tenant-dps',
    admissionNo: 'DPA-2024-112',
    rollNo: '10A-03',
    firstName: 'Rohan',
    lastName: 'Mehta',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2010-02-11',
    bloodGroup: 'A+',
    admissionDate: '2024-04-01',
    academicYearId: 'ay-2026-2027',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    house: 'Ashoka House',
    status: 'active',
    parentGuardian: {
      fatherName: 'Sanjay Mehta',
      fatherPhone: '+91 98200 99881',
      fatherOccupation: 'Civil Engineer',
      motherName: 'Ritu Mehta',
      motherPhone: '+91 98200 99882',
      emergencyContactPhone: '+91 98200 99881',
      residentialAddress: 'House 55, Pocket D, Shalimar Bagh, Delhi',
    },
    attendancePercentage: 74.0,
    academicAverage: 64.2,
    feeBalance: 8200,
    riskStatus: 'monitor',
    riskReasons: [
      'Attendance at 74% (boundary of 75% limit)',
      'Quarterly exam marks improved by 4% in English but declined in Science',
    ],
    recommendedActions: [
      'Issue attendance awareness notification to parents',
      'Review practical science lab attendance',
    ],
    documents: [],
    createdAt: '2024-04-01T10:00:00.000Z',
    updatedAt: '2026-10-03T10:00:00.000Z',
  },
  {
    id: 'student-ananya-k',
    tenantId: 'tenant-dps',
    admissionNo: 'DPA-2024-045',
    rollNo: '10B-01',
    firstName: 'Ananya',
    lastName: 'Kulkarni',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '2010-07-19',
    bloodGroup: 'AB+',
    admissionDate: '2024-04-01',
    academicYearId: 'ay-2026-2027',
    classId: 'class-g10',
    sectionId: 'sec-g10-b',
    house: 'Raman House',
    status: 'active',
    parentGuardian: {
      fatherName: 'Girish Kulkarni',
      fatherPhone: '+91 98118 33221',
      motherName: 'Smita Kulkarni',
      motherPhone: '+91 98118 33222',
      emergencyContactPhone: '+91 98118 33221',
      residentialAddress: 'C-7, Prashant Vihar, Delhi',
    },
    attendancePercentage: 91.5,
    academicAverage: 88.0,
    feeBalance: 0,
    riskStatus: 'improving',
    riskReasons: [
      'Remarkable 14% improvement in Physics scores following remedial support',
      'Consistent attendance and project submissions',
    ],
    recommendedActions: [
      'Send positive recognition note to parents via WhatsApp',
    ],
    documents: [],
    createdAt: '2024-04-01T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
  {
    id: 'student-kabir',
    tenantId: 'tenant-dps',
    admissionNo: 'DPA-2025-001',
    rollNo: '9A-01',
    firstName: 'Kabir',
    lastName: 'Bose',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    gender: 'male',
    dob: '2011-12-05',
    bloodGroup: 'O-',
    admissionDate: '2025-04-01',
    academicYearId: 'ay-2026-2027',
    classId: 'class-g9',
    sectionId: 'sec-g9-a',
    house: 'Shivaji House',
    status: 'active',
    parentGuardian: {
      fatherName: 'Subir Bose',
      fatherPhone: '+91 98300 12345',
      motherName: 'Maitreyi Bose',
      motherPhone: '+91 98300 12346',
      emergencyContactPhone: '+91 98300 12345',
      residentialAddress: 'Tower 3, Apt 901, Express Greens, Rohini, Delhi',
    },
    attendancePercentage: 88.0,
    academicAverage: 81.4,
    feeBalance: 0,
    riskStatus: 'stable',
    riskReasons: ['Performance on target', 'Healthy attendance'],
    recommendedActions: ['Continue standard academic tracking'],
    documents: [],
    createdAt: '2025-04-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'student-zoya',
    tenantId: 'tenant-dps',
    admissionNo: 'DPA-2024-098',
    rollNo: '9A-02',
    firstName: 'Zoya',
    lastName: 'Farooqui',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    gender: 'female',
    dob: '2011-04-14',
    bloodGroup: 'B-',
    admissionDate: '2024-04-01',
    academicYearId: 'ay-2026-2027',
    classId: 'class-g9',
    sectionId: 'sec-g9-a',
    house: 'Tagore House',
    status: 'active',
    parentGuardian: {
      fatherName: 'Tariq Farooqui',
      fatherPhone: '+91 98115 66778',
      motherName: 'Farhana Farooqui',
      motherPhone: '+91 98115 66779',
      emergencyContactPhone: '+91 98115 66778',
      residentialAddress: 'B-19, Gujranwala Town, Delhi',
    },
    attendancePercentage: 71.2,
    academicAverage: 69.0,
    feeBalance: 22000,
    riskStatus: 'needs_attention',
    riskReasons: [
      'Attendance at 71.2% (below 75% limit)',
      'Overdue fee payment > 25 days (₹22,000)',
      'Consecutive absences on Mondays',
    ],
    recommendedActions: [
      'Automated reminder sent to accountant',
      'Counselor check-in regarding Monday absenteeism pattern',
    ],
    documents: [],
    createdAt: '2024-04-01T10:00:00.000Z',
    updatedAt: '2026-10-05T06:00:00.000Z',
  },
];

// Seed Audit Logs
const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    tenantId: 'tenant-dps',
    userId: 'user-principal-dps',
    userName: 'Dr. Rajesh Sharma',
    userRole: 'principal',
    action: 'login',
    module: 'dashboard',
    details: 'User authenticated successfully from New Delhi IP 103.21.24.8',
    timestamp: '2026-10-05T08:15:22.000Z',
  },
  {
    id: 'audit-002',
    tenantId: 'tenant-dps',
    userId: 'user-teacher-meera',
    userName: 'Meera Sengupta',
    userRole: 'class_teacher',
    action: 'update',
    module: 'attendance',
    recordId: 'class-g10',
    details: 'Submitted daily morning attendance for Grade 10 Section A (38 Present, 2 Absent)',
    timestamp: '2026-10-05T08:45:10.000Z',
  },
  {
    id: 'audit-003',
    tenantId: 'tenant-dps',
    userId: 'user-accountant-dps',
    userName: 'Rameshwar Gupta',
    userRole: 'accountant',
    action: 'create',
    module: 'fees',
    recordId: 'student-aarav',
    details: 'Generated Term 2 Tuition Invoice for Aarav Kapoor (₹14,500)',
    timestamp: '2026-10-04T11:20:00.000Z',
  },
  {
    id: 'audit-004',
    tenantId: 'tenant-dps',
    userId: 'user-admin-dps',
    userName: 'Anand Kulkarni',
    userRole: 'school_admin',
    action: 'onboarding',
    module: 'settings',
    details: 'Completed academic year 2026-2027 configuration and grading scale validation',
    timestamp: '2026-10-01T09:00:00.000Z',
  },
];

const SEED_ATTENDANCE_RECORDS: StudentAttendanceRecord[] = [
  {
    id: 'att-aarav-today',
    tenantId: 'tenant-dps',
    studentId: 'student-aarav',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    date: '2026-10-05',
    status: 'absent',
    remarks: 'Uninformed absence',
    markedByUserId: 'user-teacher-meera',
    markedAt: '2026-10-05T08:45:00.000Z',
  },
  {
    id: 'att-diya-today',
    tenantId: 'tenant-dps',
    studentId: 'student-diya',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    date: '2026-10-05',
    status: 'present',
    markedByUserId: 'user-teacher-meera',
    markedAt: '2026-10-05T08:45:00.000Z',
  },
  {
    id: 'att-rohan-today',
    tenantId: 'tenant-dps',
    studentId: 'student-rohan',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    date: '2026-10-05',
    status: 'late',
    remarks: 'Arrived 15 minutes late due to bus traffic',
    markedByUserId: 'user-teacher-meera',
    markedAt: '2026-10-05T08:55:00.000Z',
  },
];

const SEED_STUDENT_LEAVES: StudentLeaveApplication[] = [
  {
    id: 'leave-diya-01',
    tenantId: 'tenant-dps',
    studentId: 'student-diya',
    applicantName: 'Dr. Vivek Sharma (Father)',
    applicantRole: 'parent',
    startDate: '2026-10-06',
    endDate: '2026-10-07',
    leaveType: 'medical',
    reason: 'Orthodontic procedure and post-op rest.',
    status: 'pending',
    appliedAt: '2026-10-04T18:00:00.000Z',
  },
  {
    id: 'leave-rohan-01',
    tenantId: 'tenant-dps',
    studentId: 'student-rohan',
    applicantName: 'Sanjay Mehta (Father)',
    applicantRole: 'parent',
    startDate: '2026-09-28',
    endDate: '2026-09-29',
    leaveType: 'family',
    reason: 'Family wedding out of town.',
    status: 'approved',
    appliedAt: '2026-09-25T10:00:00.000Z',
    reviewedByUserId: 'user-teacher-meera',
    reviewedByUserName: 'Meera Sengupta',
    reviewedAt: '2026-09-26T09:00:00.000Z',
    reviewRemarks: 'Approved. Roster synchronized with academic schedule.',
  },
];

const SEED_FACULTY_LEAVES: FacultyLeaveApplication[] = [
  {
    id: 'fleave-ananya-01',
    tenantId: 'tenant-dps',
    teacherId: 'teacher-ananya',
    startDate: '2026-10-05',
    endDate: '2026-10-05',
    leaveType: 'casual',
    reason: 'Personal family emergency.',
    status: 'approved',
    substituteTeacherId: 'teacher-rohit',
    substituteTeacherName: 'Rohit Choudhary',
    periodsImpacted: [
      {
        periodNumber: 2,
        classId: 'class-g10',
        sectionId: 'sec-g10-a',
        subjectId: 'subj-eng-10',
      },
      {
        periodNumber: 4,
        classId: 'class-g9',
        sectionId: 'sec-g9-a',
        subjectId: 'subj-eng-10',
      },
    ],
    appliedAt: '2026-10-04T20:00:00.000Z',
    reviewedByUserId: 'user-principal-dps',
    reviewedAt: '2026-10-05T07:15:00.000Z',
    reviewRemarks: 'Approved with automated substitute arrangement (Mr. Rohit Choudhary).',
  },
];

const SEED_EXAMS: Exam[] = [
  {
    id: 'exam-preboard-2026',
    tenantId: 'tenant-dps',
    academicYearId: 'ay-2026-2027',
    name: 'Grade 10 Pre-Board Examination',
    type: 'pre_board',
    startDate: '2026-10-15',
    endDate: '2026-10-25',
    status: 'ongoing',
    applicableClassIds: ['class-g10'],
  },
  {
    id: 'exam-term1-quarterly',
    tenantId: 'tenant-dps',
    academicYearId: 'ay-2026-2027',
    name: 'Term 1 Mid-Term Assessment',
    type: 'quarterly',
    startDate: '2026-09-01',
    endDate: '2026-09-12',
    status: 'published',
    applicableClassIds: ['class-g10', 'class-g9', 'class-g8'],
  },
];

const SEED_EXAM_MARKS: StudentExamMark[] = [
  {
    id: 'mark-aarav-math',
    tenantId: 'tenant-dps',
    examId: 'exam-term1-quarterly',
    studentId: 'student-aarav',
    subjectId: 'subj-math-10',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    marksObtained: 68,
    maxMarks: 100,
    percentage: 68,
    grade: 'B2',
    isPassed: true,
    teacherRemarks: 'Showed conceptual gaps in Quadratic Equations. Needs remedial support.',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'mark-aarav-sci',
    tenantId: 'tenant-dps',
    examId: 'exam-term1-quarterly',
    studentId: 'student-aarav',
    subjectId: 'subj-sci-10',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    marksObtained: 72,
    maxMarks: 100,
    percentage: 72,
    grade: 'B1',
    isPassed: true,
    teacherRemarks: 'Good performance in Chemistry; practical lab submission was delayed.',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'mark-aarav-eng',
    tenantId: 'tenant-dps',
    examId: 'exam-term1-quarterly',
    studentId: 'student-aarav',
    subjectId: 'subj-eng-10',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    marksObtained: 78,
    maxMarks: 100,
    percentage: 78,
    grade: 'B1',
    isPassed: true,
    teacherRemarks: 'Strong comprehension and creative writing ability.',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'mark-diya-math',
    tenantId: 'tenant-dps',
    examId: 'exam-term1-quarterly',
    studentId: 'student-diya',
    subjectId: 'subj-math-10',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    marksObtained: 96,
    maxMarks: 100,
    percentage: 96,
    grade: 'A1',
    isPassed: true,
    teacherRemarks: 'Outstanding analytical prowess. Perfect score in Geometry.',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'mark-diya-sci',
    tenantId: 'tenant-dps',
    examId: 'exam-term1-quarterly',
    studentId: 'student-diya',
    subjectId: 'subj-sci-10',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    marksObtained: 94,
    maxMarks: 100,
    percentage: 94,
    grade: 'A1',
    isPassed: true,
    teacherRemarks: 'Exemplary scientific rigor in physics experimentation.',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'mark-diya-eng',
    tenantId: 'tenant-dps',
    examId: 'exam-term1-quarterly',
    studentId: 'student-diya',
    subjectId: 'subj-eng-10',
    classId: 'class-g10',
    sectionId: 'sec-g10-a',
    marksObtained: 95,
    maxMarks: 100,
    percentage: 95,
    grade: 'A1',
    isPassed: true,
    teacherRemarks: 'Exceptional articulation and literary critical analysis.',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
];

const SEED_TIMETABLE_SLOTS: TimetableSlot[] = [
  { id: 'tt-1', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'mon', periodNumber: 1, subjectId: 'subj-math-10', teacherId: 'teacher-meera', roomNo: 'Room 301' },
  { id: 'tt-2', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'mon', periodNumber: 2, subjectId: 'subj-eng-10', teacherId: 'teacher-ananya', roomNo: 'Room 301' },
  { id: 'tt-3', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'mon', periodNumber: 3, subjectId: 'subj-sci-10', teacherId: 'teacher-vikram', roomNo: 'Physics Lab' },
  { id: 'tt-4', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'mon', periodNumber: 4, subjectId: 'subj-cs-10', teacherId: 'teacher-rohit', roomNo: 'AI Lab' },
  { id: 'tt-5', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'mon', periodNumber: 5, subjectId: 'subj-soc-10', teacherId: 'teacher-ananya', roomNo: 'Room 301' },
  { id: 'tt-6', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'tue', periodNumber: 1, subjectId: 'subj-sci-10', teacherId: 'teacher-vikram', roomNo: 'Room 301' },
  { id: 'tt-7', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'tue', periodNumber: 2, subjectId: 'subj-math-10', teacherId: 'teacher-meera', roomNo: 'Room 301' },
  { id: 'tt-8', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'tue', periodNumber: 3, subjectId: 'subj-cs-10', teacherId: 'teacher-rohit', roomNo: 'AI Lab' },
  { id: 'tt-9', tenantId: 'tenant-dps', classId: 'class-g10', sectionId: 'sec-g10-a', dayOfWeek: 'tue', periodNumber: 4, subjectId: 'subj-eng-10', teacherId: 'teacher-ananya', roomNo: 'Room 301' },
];

class SchoolOSRepository {
  private getStorage<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(item);
    } catch {
      return defaultVal;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  constructor() {
    this.init();
  }

  public init(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.TENANTS)) {
      this.setStorage(STORAGE_KEYS.TENANTS, SEED_TENANTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setStorage(STORAGE_KEYS.USERS, SEED_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      this.setStorage(STORAGE_KEYS.CLASSES, SEED_CLASSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SECTIONS)) {
      this.setStorage(STORAGE_KEYS.SECTIONS, SEED_SECTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      this.setStorage(STORAGE_KEYS.SUBJECTS, SEED_SUBJECTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
      this.setStorage(STORAGE_KEYS.TEACHERS, SEED_TEACHERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.setStorage(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      this.setStorage(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      this.setStorage(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE_RECORDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENT_LEAVES)) {
      this.setStorage(STORAGE_KEYS.STUDENT_LEAVES, SEED_STUDENT_LEAVES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FACULTY_LEAVES)) {
      this.setStorage(STORAGE_KEYS.FACULTY_LEAVES, SEED_FACULTY_LEAVES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TIMETABLE)) {
      this.setStorage(STORAGE_KEYS.TIMETABLE, SEED_TIMETABLE_SLOTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
      this.setStorage(STORAGE_KEYS.EXAMS, SEED_EXAMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXAM_MARKS)) {
      this.setStorage(STORAGE_KEYS.EXAM_MARKS, SEED_EXAM_MARKS);
    }
  }

  // --- Multi-Tenant Boundary ---
  public getTenants(): Tenant[] {
    return this.getStorage<Tenant[]>(STORAGE_KEYS.TENANTS, SEED_TENANTS);
  }

  public getTenantById(tenantId: string): Tenant | null {
    const tenants = this.getTenants();
    return tenants.find((t) => t.id === tenantId) || null;
  }

  public createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Tenant {
    const tenants = this.getTenants();
    const id = `tenant-${Date.now()}`;
    const newTenant: Tenant = {
      ...tenantData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tenants.push(newTenant);
    this.setStorage(STORAGE_KEYS.TENANTS, tenants);

    // Create default school admin user for this new tenant
    const users = this.getUsers();
    const adminUser: User = {
      id: `user-admin-${id}`,
      email: newTenant.email,
      name: `${newTenant.name} Administrator`,
      role: 'school_admin',
      tenantId: id,
      status: 'active',
      lastLoginAt: new Date().toISOString(),
    };
    users.push(adminUser);
    this.setStorage(STORAGE_KEYS.USERS, users);

    this.logAudit({
      tenantId: id,
      userId: adminUser.id,
      userName: adminUser.name,
      userRole: 'school_admin',
      action: 'onboarding',
      module: 'settings',
      recordId: id,
      details: `Initialized new tenant "${newTenant.name}" (${newTenant.code}) via School Onboarding Wizard.`,
    });

    return newTenant;
  }

  public updateTenant(tenantId: string, updates: Partial<Tenant>): Tenant | null {
    const tenants = this.getTenants();
    const idx = tenants.findIndex((t) => t.id === tenantId);
    if (idx === -1) return null;
    tenants[idx] = {
      ...tenants[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.TENANTS, tenants);
    return tenants[idx];
  }

  // --- Users & RBAC ---
  public getUsers(tenantId?: string): User[] {
    const users = this.getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    if (!tenantId) return users;
    return users.filter((u) => u.tenantId === tenantId || u.role === 'super_admin');
  }

  public getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.id === userId) || null;
  }

  // --- Students (Strict Tenant Scoped) ---
  public getStudents(tenantId: string): Student[] {
    const all = this.getStorage<Student[]>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    return all.filter((s) => s.tenantId === tenantId);
  }

  public getStudentById(tenantId: string, studentId: string): Student | null {
    const students = this.getStudents(tenantId);
    return students.find((s) => s.id === studentId) || null;
  }

  public createStudent(tenantId: string, data: Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor?: User): Student {
    const all = this.getStorage<Student[]>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    const newStudent: Student = {
      ...data,
      id: `student-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(newStudent);
    this.setStorage(STORAGE_KEYS.STUDENTS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'students',
        recordId: newStudent.id,
        details: `Enrolled student ${newStudent.firstName} ${newStudent.lastName} (Adm No: ${newStudent.admissionNo})`,
      });
    }

    return newStudent;
  }

  public updateStudent(tenantId: string, studentId: string, updates: Partial<Student>, actor?: User): Student | null {
    const all = this.getStorage<Student[]>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    const idx = all.findIndex((s) => s.tenantId === tenantId && s.id === studentId);
    if (idx === -1) return null;

    const previous = all[idx];
    all[idx] = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.STUDENTS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'students',
        recordId: studentId,
        details: `Updated student record for ${all[idx].firstName} ${all[idx].lastName}`,
        before: { attendance: previous.attendancePercentage, average: previous.academicAverage },
        after: { attendance: all[idx].attendancePercentage, average: all[idx].academicAverage },
      });
    }

    return all[idx];
  }

  public deleteStudent(tenantId: string, studentId: string, actor?: User): boolean {
    const all = this.getStorage<Student[]>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    const target = all.find((s) => s.tenantId === tenantId && s.id === studentId);
    if (!target) return false;

    const filtered = all.filter((s) => !(s.tenantId === tenantId && s.id === studentId));
    this.setStorage(STORAGE_KEYS.STUDENTS, filtered);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'delete',
        module: 'students',
        recordId: studentId,
        details: `Deleted student record ${target.firstName} ${target.lastName} (${target.admissionNo})`,
      });
    }
    return true;
  }

  // --- Teachers (Strict Tenant Scoped) ---
  public getTeachers(tenantId: string): Teacher[] {
    const all = this.getStorage<Teacher[]>(STORAGE_KEYS.TEACHERS, SEED_TEACHERS);
    return all.filter((t) => t.tenantId === tenantId);
  }

  public getTeacherById(tenantId: string, teacherId: string): Teacher | null {
    const teachers = this.getTeachers(tenantId);
    return teachers.find((t) => t.id === teacherId) || null;
  }

  public createTeacher(tenantId: string, data: Omit<Teacher, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor?: User): Teacher {
    const all = this.getStorage<Teacher[]>(STORAGE_KEYS.TEACHERS, SEED_TEACHERS);
    const newTeacher: Teacher = {
      ...data,
      id: `teacher-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(newTeacher);
    this.setStorage(STORAGE_KEYS.TEACHERS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'teachers',
        recordId: newTeacher.id,
        details: `Added faculty member ${newTeacher.firstName} ${newTeacher.lastName} (${newTeacher.employeeId})`,
      });
    }

    return newTeacher;
  }

  public updateTeacher(tenantId: string, teacherId: string, updates: Partial<Teacher>, actor?: User): Teacher | null {
    const all = this.getStorage<Teacher[]>(STORAGE_KEYS.TEACHERS, SEED_TEACHERS);
    const idx = all.findIndex((t) => t.tenantId === tenantId && t.id === teacherId);
    if (idx === -1) return null;

    all[idx] = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.TEACHERS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'teachers',
        recordId: teacherId,
        details: `Updated teacher profile for ${all[idx].firstName} ${all[idx].lastName}`,
      });
    }

    return all[idx];
  }

  // --- Classes, Sections & Subjects (Academics) ---
  public getClasses(tenantId: string): ClassRoom[] {
    const all = this.getStorage<ClassRoom[]>(STORAGE_KEYS.CLASSES, SEED_CLASSES);
    return all.filter((c) => c.tenantId === tenantId);
  }

  public createClass(tenantId: string, data: Omit<ClassRoom, 'id' | 'tenantId'>, actor?: User): ClassRoom {
    const all = this.getStorage<ClassRoom[]>(STORAGE_KEYS.CLASSES, SEED_CLASSES);
    const newClass: ClassRoom = {
      ...data,
      id: `class-${Date.now()}`,
      tenantId,
    };
    all.push(newClass);
    this.setStorage(STORAGE_KEYS.CLASSES, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'academics',
        recordId: newClass.id,
        details: `Created new class "${newClass.name}" (Capacity: ${newClass.capacity})`,
      });
    }
    return newClass;
  }

  public getSections(tenantId: string, classId?: string): Section[] {
    const all = this.getStorage<Section[]>(STORAGE_KEYS.SECTIONS, SEED_SECTIONS);
    const tenantSections = all.filter((s) => s.tenantId === tenantId);
    if (!classId) return tenantSections;
    return tenantSections.filter((s) => s.classId === classId);
  }

  public createSection(tenantId: string, data: Omit<Section, 'id' | 'tenantId'>, actor?: User): Section {
    const all = this.getStorage<Section[]>(STORAGE_KEYS.SECTIONS, SEED_SECTIONS);
    const newSection: Section = {
      ...data,
      id: `sec-${Date.now()}`,
      tenantId,
    };
    all.push(newSection);
    this.setStorage(STORAGE_KEYS.SECTIONS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'academics',
        recordId: newSection.id,
        details: `Added Section "${newSection.name}" to Class ID: ${newSection.classId}`,
      });
    }
    return newSection;
  }

  public getSubjects(tenantId: string, classId?: string): Subject[] {
    const all = this.getStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, SEED_SUBJECTS);
    const tenantSubjects = all.filter((s) => s.tenantId === tenantId);
    if (!classId) return tenantSubjects;
    return tenantSubjects.filter((s) => s.classIds.includes(classId));
  }

  public createSubject(tenantId: string, data: Omit<Subject, 'id' | 'tenantId'>, actor?: User): Subject {
    const all = this.getStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, SEED_SUBJECTS);
    const newSubject: Subject = {
      ...data,
      id: `subj-${Date.now()}`,
      tenantId,
    };
    all.push(newSubject);
    this.setStorage(STORAGE_KEYS.SUBJECTS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'academics',
        recordId: newSubject.id,
        details: `Created subject "${newSubject.name}" (${newSubject.code})`,
      });
    }
    return newSubject;
  }

  // --- Student Attendance Engine ---
  public getStudentAttendance(tenantId: string, classId: string, sectionId: string, date: string): StudentAttendanceRecord[] {
    const all = this.getStorage<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE_RECORDS);
    return all.filter((r) => r.tenantId === tenantId && r.classId === classId && r.sectionId === sectionId && r.date === date);
  }

  public saveStudentAttendance(
    tenantId: string,
    classId: string,
    sectionId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    actor?: User
  ): { savedRecords: StudentAttendanceRecord[]; triggeredNotifications: WhatsAppNotificationPayload[] } {
    const all = this.getStorage<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE_RECORDS);
    const tenant = this.getTenantById(tenantId);
    const students = this.getStudents(tenantId);
    const minThreshold = tenant?.settings.minAttendancePercent || 75;

    // Filter out existing records for this class/section/date
    const remaining = all.filter(
      (r) => !(r.tenantId === tenantId && r.classId === classId && r.sectionId === sectionId && r.date === date)
    );

    const savedRecords: StudentAttendanceRecord[] = [];
    const triggeredNotifications: WhatsAppNotificationPayload[] = [];

    records.forEach((rec) => {
      const student = students.find((s) => s.id === rec.studentId);
      const newRec: StudentAttendanceRecord = {
        id: `att-${rec.studentId}-${date}`,
        tenantId,
        studentId: rec.studentId,
        classId,
        sectionId,
        date,
        status: rec.status,
        remarks: rec.remarks,
        markedByUserId: actor?.id || 'system',
        markedAt: new Date().toISOString(),
      };
      savedRecords.push(newRec);

      // Recalculate student attendance percentage dynamically
      if (student) {
        let updatedAtt = student.attendancePercentage;
        if (rec.status === 'absent') {
          updatedAtt = Math.max(50, Number((student.attendancePercentage - 0.9).toFixed(1)));
        } else if (rec.status === 'present') {
          updatedAtt = Math.min(100, Number((student.attendancePercentage + 0.3).toFixed(1)));
        }

        const isBelow = updatedAtt < minThreshold;
        const newRisk: Student['riskStatus'] = isBelow ? 'needs_attention' : student.riskStatus;

        this.updateStudent(tenantId, student.id, {
          attendancePercentage: updatedAtt,
          riskStatus: newRisk,
        });

        // Trigger parent WhatsApp notification simulation if student is absent
        if (rec.status === 'absent' && tenant?.settings.enableWhatsAppAlerts) {
          triggeredNotifications.push({
            recipientPhone: student.parentGuardian.fatherPhone,
            recipientName: student.parentGuardian.fatherName,
            studentName: `${student.firstName} ${student.lastName}`,
            schoolName: tenant.name,
            message: `Dear ${student.parentGuardian.fatherName}, your ward ${student.firstName} was marked ABSENT today (${date}) at ${tenant.name}. Please contact the school office if this was unexpected.`,
            templateType: 'absent_alert',
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    const updatedAll = [...remaining, ...savedRecords];
    this.setStorage(STORAGE_KEYS.ATTENDANCE, updatedAll);

    if (actor) {
      const presentCount = records.filter((r) => r.status === 'present').length;
      const absentCount = records.filter((r) => r.status === 'absent').length;
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'attendance',
        details: `Saved attendance roster for ${date}: ${presentCount} Present, ${absentCount} Absent.`,
      });
    }

    return { savedRecords, triggeredNotifications };
  }

  // --- Student Leave Applications ---
  public getStudentLeaveApplications(tenantId: string): StudentLeaveApplication[] {
    const all = this.getStorage<StudentLeaveApplication[]>(STORAGE_KEYS.STUDENT_LEAVES, SEED_STUDENT_LEAVES);
    return all.filter((l) => l.tenantId === tenantId);
  }

  public createStudentLeaveApplication(
    tenantId: string,
    data: Omit<StudentLeaveApplication, 'id' | 'tenantId' | 'status' | 'appliedAt'>
  ): StudentLeaveApplication {
    const all = this.getStorage<StudentLeaveApplication[]>(STORAGE_KEYS.STUDENT_LEAVES, SEED_STUDENT_LEAVES);
    const newLeave: StudentLeaveApplication = {
      ...data,
      id: `leave-${Date.now()}`,
      tenantId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    all.unshift(newLeave);
    this.setStorage(STORAGE_KEYS.STUDENT_LEAVES, all);

    this.logAudit({
      tenantId,
      userId: 'parent-portal',
      userName: data.applicantName,
      userRole: 'parent',
      action: 'create',
      module: 'attendance',
      recordId: newLeave.id,
      details: `Submitted student leave application from ${data.startDate} to ${data.endDate} (${data.reason})`,
    });

    return newLeave;
  }

  public reviewStudentLeaveApplication(
    tenantId: string,
    leaveId: string,
    status: 'approved' | 'rejected',
    reviewRemarks: string,
    actor?: User
  ): StudentLeaveApplication | null {
    const all = this.getStorage<StudentLeaveApplication[]>(STORAGE_KEYS.STUDENT_LEAVES, SEED_STUDENT_LEAVES);
    const idx = all.findIndex((l) => l.tenantId === tenantId && l.id === leaveId);
    if (idx === -1) return null;

    all[idx] = {
      ...all[idx],
      status,
      reviewRemarks,
      reviewedByUserId: actor?.id,
      reviewedByUserName: actor?.name,
      reviewedAt: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.STUDENT_LEAVES, all);

    // If approved, automatically mark attendance record for student as 'leave'
    if (status === 'approved') {
      const student = this.getStudentById(tenantId, all[idx].studentId);
      if (student) {
        const attRecords = this.getStorage<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE_RECORDS);
        const existingIdx = attRecords.findIndex(
          (r) => r.tenantId === tenantId && r.studentId === student.id && r.date === all[idx].startDate
        );
        const leaveRec: StudentAttendanceRecord = {
          id: `att-${student.id}-${all[idx].startDate}`,
          tenantId,
          studentId: student.id,
          classId: student.classId,
          sectionId: student.sectionId,
          date: all[idx].startDate,
          status: 'leave',
          remarks: `Sanctioned leave: ${all[idx].reason}`,
          markedByUserId: actor?.id || 'system',
          markedAt: new Date().toISOString(),
        };

        if (existingIdx !== -1) {
          attRecords[existingIdx] = leaveRec;
        } else {
          attRecords.push(leaveRec);
        }
        this.setStorage(STORAGE_KEYS.ATTENDANCE, attRecords);
      }
    }

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'attendance',
        recordId: leaveId,
        details: `${status === 'approved' ? 'Approved' : 'Rejected'} leave application for student ID ${all[idx].studentId}`,
      });
    }

    return all[idx];
  }

  // --- Faculty Leave & Substitutes ---
  public getFacultyLeaveApplications(tenantId: string): FacultyLeaveApplication[] {
    const all = this.getStorage<FacultyLeaveApplication[]>(STORAGE_KEYS.FACULTY_LEAVES, SEED_FACULTY_LEAVES);
    return all.filter((l) => l.tenantId === tenantId);
  }

  public createFacultyLeaveApplication(
    tenantId: string,
    data: Omit<FacultyLeaveApplication, 'id' | 'tenantId' | 'status' | 'appliedAt'>
  ): FacultyLeaveApplication {
    const all = this.getStorage<FacultyLeaveApplication[]>(STORAGE_KEYS.FACULTY_LEAVES, SEED_FACULTY_LEAVES);
    const newLeave: FacultyLeaveApplication = {
      ...data,
      id: `fleave-${Date.now()}`,
      tenantId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    all.unshift(newLeave);
    this.setStorage(STORAGE_KEYS.FACULTY_LEAVES, all);
    return newLeave;
  }

  public reviewFacultyLeaveApplication(
    tenantId: string,
    leaveId: string,
    status: 'approved' | 'rejected',
    substituteTeacherId?: string,
    substituteTeacherName?: string,
    reviewRemarks?: string,
    actor?: User
  ): FacultyLeaveApplication | null {
    const all = this.getStorage<FacultyLeaveApplication[]>(STORAGE_KEYS.FACULTY_LEAVES, SEED_FACULTY_LEAVES);
    const idx = all.findIndex((l) => l.tenantId === tenantId && l.id === leaveId);
    if (idx === -1) return null;

    all[idx] = {
      ...all[idx],
      status,
      substituteTeacherId: substituteTeacherId || all[idx].substituteTeacherId,
      substituteTeacherName: substituteTeacherName || all[idx].substituteTeacherName,
      reviewRemarks,
      reviewedByUserId: actor?.id,
      reviewedAt: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.FACULTY_LEAVES, all);

    // If approved, update teacher's attendance status to 'on_leave'
    if (status === 'approved') {
      this.updateTeacher(tenantId, all[idx].teacherId, { todayAttendance: 'on_leave' });
    }

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'attendance',
        recordId: leaveId,
        details: `${status === 'approved' ? 'Approved' : 'Rejected'} faculty leave for teacher ID ${all[idx].teacherId} (Substitute: ${all[idx].substituteTeacherName || 'None'})`,
      });
    }

    return all[idx];
  }

  // --- Timetable Engine ---
  public getTimetableSlots(tenantId: string, classId?: string, sectionId?: string, teacherId?: string): TimetableSlot[] {
    const all = this.getStorage<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, SEED_TIMETABLE_SLOTS);
    return all.filter((s) => {
      if (s.tenantId !== tenantId) return false;
      if (classId && s.classId !== classId) return false;
      if (sectionId && s.sectionId !== sectionId) return false;
      if (teacherId && s.teacherId !== teacherId) return false;
      return true;
    });
  }

  public saveTimetableSlot(
    tenantId: string,
    slotData: Omit<TimetableSlot, 'id' | 'tenantId'>,
    actor?: User
  ): { slot: TimetableSlot; conflict?: string } {
    const all = this.getStorage<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, SEED_TIMETABLE_SLOTS);

    // 1. Conflict Check: Is Teacher already booked in another class at this day & period?
    const teacherConflict = all.find(
      (s) =>
        s.tenantId === tenantId &&
        s.teacherId === slotData.teacherId &&
        s.dayOfWeek === slotData.dayOfWeek &&
        s.periodNumber === slotData.periodNumber &&
        !(s.classId === slotData.classId && s.sectionId === slotData.sectionId)
    );

    let conflictMessage: string | undefined;
    if (teacherConflict) {
      const cls = this.getClasses(tenantId).find((c) => c.id === teacherConflict.classId);
      const teacher = this.getTeachers(tenantId).find((t) => t.id === slotData.teacherId);
      conflictMessage = `Teacher Conflict: ${teacher?.firstName} ${teacher?.lastName} is already booked in ${cls?.name || 'another class'} during Period ${slotData.periodNumber} on ${slotData.dayOfWeek.toUpperCase()}.`;
    }

    // Remove existing slot for this class/section/day/period if exists
    const filtered = all.filter(
      (s) =>
        !(
          s.tenantId === tenantId &&
          s.classId === slotData.classId &&
          s.sectionId === slotData.sectionId &&
          s.dayOfWeek === slotData.dayOfWeek &&
          s.periodNumber === slotData.periodNumber
        )
    );

    const newSlot: TimetableSlot = {
      ...slotData,
      id: `tt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
    };
    filtered.push(newSlot);
    this.setStorage(STORAGE_KEYS.TIMETABLE, filtered);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'academics',
        recordId: newSlot.id,
        details: `Updated timetable slot: Period ${newSlot.periodNumber} (${newSlot.dayOfWeek.toUpperCase()}) for Class ID ${newSlot.classId}`,
      });
    }

    return { slot: newSlot, conflict: conflictMessage };
  }

  public deleteTimetableSlot(tenantId: string, slotId: string, actor?: User): boolean {
    const all = this.getStorage<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, SEED_TIMETABLE_SLOTS);
    const filtered = all.filter((s) => !(s.tenantId === tenantId && s.id === slotId));
    this.setStorage(STORAGE_KEYS.TIMETABLE, filtered);
    return true;
  }

  // --- Examination & Marks Engine ---
  public getExams(tenantId: string): Exam[] {
    const all = this.getStorage<Exam[]>(STORAGE_KEYS.EXAMS, SEED_EXAMS);
    return all.filter((e) => e.tenantId === tenantId);
  }

  public createExam(tenantId: string, data: Omit<Exam, 'id' | 'tenantId'>, actor?: User): Exam {
    const all = this.getStorage<Exam[]>(STORAGE_KEYS.EXAMS, SEED_EXAMS);
    const newExam: Exam = {
      ...data,
      id: `exam-${Date.now()}`,
      tenantId,
    };
    all.unshift(newExam);
    this.setStorage(STORAGE_KEYS.EXAMS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'exams',
        recordId: newExam.id,
        details: `Created Examination Schedule "${newExam.name}" (${newExam.startDate} to ${newExam.endDate})`,
      });
    }
    return newExam;
  }

  public getExamMarks(tenantId: string, examId: string, classId?: string, subjectId?: string): StudentExamMark[] {
    const all = this.getStorage<StudentExamMark[]>(STORAGE_KEYS.EXAM_MARKS, SEED_EXAM_MARKS);
    return all.filter((m) => {
      if (m.tenantId !== tenantId || m.examId !== examId) return false;
      if (classId && m.classId !== classId) return false;
      if (subjectId && m.subjectId !== subjectId) return false;
      return true;
    });
  }

  public saveExamMarks(
    tenantId: string,
    marksList: Omit<StudentExamMark, 'id' | 'tenantId' | 'updatedAt'>[],
    actor?: User
  ): StudentExamMark[] {
    const all = this.getStorage<StudentExamMark[]>(STORAGE_KEYS.EXAM_MARKS, SEED_EXAM_MARKS);
    const tenant = this.getTenantById(tenantId);
    const gradingScale = tenant?.settings.gradingScale || [];

    const saved: StudentExamMark[] = [];

    marksList.forEach((item) => {
      const percentage = Math.round((item.marksObtained / item.maxMarks) * 100);

      // Determine grade from tenant grading scale
      let grade = 'B2';
      const scaleMatch = gradingScale.find((g) => percentage >= g.minScore && percentage <= g.maxScore);
      if (scaleMatch) {
        grade = scaleMatch.grade;
      }

      const existingIdx = all.findIndex(
        (m) =>
          m.tenantId === tenantId &&
          m.examId === item.examId &&
          m.studentId === item.studentId &&
          m.subjectId === item.subjectId
      );

      const record: StudentExamMark = {
        ...item,
        id: existingIdx !== -1 ? all[existingIdx].id : `mark-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        tenantId,
        percentage,
        grade,
        isPassed: percentage >= 33,
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx !== -1) {
        all[existingIdx] = record;
      } else {
        all.push(record);
      }
      saved.push(record);

      // Recalculate student aggregate average
      const studentMarks = all.filter((m) => m.tenantId === tenantId && m.studentId === item.studentId);
      if (studentMarks.length > 0) {
        const avg = Math.round(
          studentMarks.reduce((acc, m) => acc + m.percentage, 0) / studentMarks.length
        );
        this.updateStudent(tenantId, item.studentId, { academicAverage: avg });
      }
    });

    this.setStorage(STORAGE_KEYS.EXAM_MARKS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'exams',
        details: `Saved ${saved.length} student examination marks for Exam ID ${marksList[0]?.examId || 'Batch'}`,
      });
    }

    return saved;
  }

  // --- AI Report Card Assistant ---
  public generateAiReportRemarks(
    tenantId: string,
    studentId: string,
    marks: StudentExamMark[]
  ): ReportCardRemarkDraft {
    const student = this.getStudentById(tenantId, studentId);
    const avg = marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length) : 75;
    const att = student?.attendancePercentage || 85;

    let overallGrade = 'B1';
    if (avg >= 90) overallGrade = 'A1';
    else if (avg >= 80) overallGrade = 'A2';
    else if (avg >= 70) overallGrade = 'B1';
    else if (avg >= 60) overallGrade = 'B2';
    else overallGrade = 'C1';

    const strengths: string[] = [];
    const growthAreas: string[] = [];

    const topMark = [...marks].sort((a, b) => b.percentage - a.percentage)[0];
    const lowMark = [...marks].sort((a, b) => a.percentage - b.percentage)[0];

    const subjects = this.getSubjects(tenantId);
    const topSubj = subjects.find((s) => s.id === topMark?.subjectId)?.name || 'Academics';
    const lowSubj = subjects.find((s) => s.id === lowMark?.subjectId)?.name || 'Practical coursework';

    strengths.push(`Shows exceptional aptitude and interest in ${topSubj} (${topMark?.percentage || avg}%)`);
    strengths.push('Actively participates in classroom discussions and collaborative projects');

    if (att < 75) {
      growthAreas.push(`Attendance regularity requires focused attention (${att}%, below statutory target)`);
    }
    if (lowMark && lowMark.percentage < 70) {
      growthAreas.push(`Additional practice and revision required in ${lowSubj}`);
    } else {
      growthAreas.push('Can strive for deeper synthesis and higher precision in analytical answers');
    }

    const studentName = student ? `${student.firstName} ${student.lastName}` : 'The student';

    return {
      studentName,
      overallGrade,
      attendancePercentage: att,
      academicAverage: avg,
      strengths,
      growthAreas,
      suggestedTeacherRemark: `${student?.firstName || 'Student'} has demonstrated commendable enthusiasm in ${topSubj}. With consistent practice in ${lowSubj} and sustained attendance, potential for top decile board ranking is very strong.`,
      suggestedPrincipalRemark: `Promising academic performance. Encouraged to maintain focus, discipline, and regular classroom attendance throughout the upcoming board preparatory terms.`,
    };
  }

  // --- Audit Logging ---
  public logAudit(logData: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    const newLog: AuditLog = {
      ...logData,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep max 500 logs per tenant
    const trimmed = logs.slice(0, 500);
    this.setStorage(STORAGE_KEYS.AUDIT_LOGS, trimmed);
  }

  public getAuditLogs(tenantId: string): AuditLog[] {
    const logs = this.getStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    return logs.filter((l) => l.tenantId === tenantId);
  }

  // --- School Pulse Engine ---
  public getSchoolPulse(tenantId: string): SchoolPulseItem[] {
    const students = this.getStudents(tenantId);
    const teachers = this.getTeachers(tenantId);
    const tenant = this.getTenantById(tenantId);

    const minAttendance = tenant?.settings.minAttendancePercent || 75;
    const belowAttendanceCount = students.filter((s) => s.attendancePercentage < minAttendance).length;
    const totalOverdueFees = students.reduce((sum, s) => sum + (s.feeBalance || 0), 0);
    const absentTeachers = teachers.filter((t) => t.todayAttendance === 'absent' || t.todayAttendance === 'on_leave');
    const academicRiskCount = students.filter((s) => s.riskStatus === 'needs_attention').length;

    const items: SchoolPulseItem[] = [];

    if (belowAttendanceCount > 0) {
      items.push({
        id: 'pulse-att-01',
        type: 'attendance',
        title: `${belowAttendanceCount} students below statutory ${minAttendance}% attendance`,
        description: `Students in Grade 10 and Grade 9 are approaching critical attendance thresholds required for board exam eligibility.`,
        severity: belowAttendanceCount > 10 ? 'critical' : 'warning',
        count: belowAttendanceCount,
        metric: `${belowAttendanceCount} Students`,
        actionLabel: 'Review Students',
        actionType: 'view_attendance',
      });
    }

    if (totalOverdueFees > 0) {
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: tenant?.currency || 'INR',
        maximumFractionDigits: 0,
      }).format(totalOverdueFees);

      items.push({
        id: 'pulse-fee-01',
        type: 'fees',
        title: `${formatted} outstanding in overdue fees`,
        description: `Term tuition fees are past due across 2 classes. 4 parent payment plans are pending follow-up.`,
        severity: totalOverdueFees > 50000 ? 'critical' : 'warning',
        metric: formatted,
        actionLabel: 'View Fee Defaulters',
        actionType: 'view_fees',
      });
    }

    if (absentTeachers.length > 0) {
      const names = absentTeachers.map((t) => `${t.firstName} ${t.lastName}`).join(', ');
      items.push({
        id: 'pulse-staff-01',
        type: 'staff',
        title: `${absentTeachers.length} faculty member${absentTeachers.length > 1 ? 's' : ''} on leave today`,
        description: `${names}. Automatic substitute allocation was initiated for 3 scheduled periods.`,
        severity: 'info',
        count: absentTeachers.length,
        metric: `${absentTeachers.length} Faculty`,
        actionLabel: 'Check Substitutes',
        actionType: 'view_staff',
      });
    }

    if (academicRiskCount > 0) {
      items.push({
        id: 'pulse-acad-01',
        type: 'academics',
        title: `${academicRiskCount} student${academicRiskCount > 1 ? 's' : ''} flagged for Academic Attention`,
        description: `Explainable indicators show mathematics and science unit test regressions exceeding 10%.`,
        severity: 'warning',
        count: academicRiskCount,
        metric: `${academicRiskCount} Flagged`,
        actionLabel: 'Open Success Engine',
        actionType: 'view_students',
      });
    }

    // New admission enquiries pulse
    items.push({
      id: 'pulse-crm-01',
      type: 'admissions',
      title: '14 new admission enquiries received this week',
      description: '8 inquiries qualified for Grade 9 & Grade 11. 3 parent campus visits scheduled for tomorrow.',
      severity: 'success',
      count: 14,
      metric: '14 Enquiries',
      actionLabel: 'Open Admission CRM',
      actionType: 'view_crm',
    });

    const pendingApprovals = this.getPendingApprovals(tenantId).filter((p) => p.status === 'pending');
    if (pendingApprovals.length > 0) {
      items.push({
        id: 'pulse-approval-01',
        type: 'approvals',
        title: `${pendingApprovals.length} AI Agent actions awaiting Human Approval`,
        description: 'Autonomous workflows generated communication notices and remedial allocations requiring administrative sign-off.',
        severity: 'critical',
        count: pendingApprovals.length,
        metric: `${pendingApprovals.length} Actions`,
        actionLabel: 'Review Approvals',
        actionType: 'view_crm',
      });
    }

    return items;
  }

  // --- Admissions CRM Engine ---
  public getLeads(tenantId: string): AdmissionLead[] {
    const all = this.getStorage<AdmissionLead[]>(STORAGE_KEYS.LEADS, SEED_ADMISSION_LEADS);
    return all.filter((l) => l.tenantId === tenantId);
  }

  public createLead(tenantId: string, leadData: Omit<AdmissionLead, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>, actor?: User): AdmissionLead {
    const all = this.getStorage<AdmissionLead[]>(STORAGE_KEYS.LEADS, SEED_ADMISSION_LEADS);
    const newLead: AdmissionLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(newLead);
    this.setStorage(STORAGE_KEYS.LEADS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'crm',
        recordId: newLead.id,
        details: `Recorded new admission inquiry for "${newLead.studentName}" (Class ID: ${newLead.applyingForClassId}, Parent: ${newLead.parentName})`,
      });
    }

    return newLead;
  }

  public updateLeadStage(tenantId: string, leadId: string, stage: AdmissionLead['stage'], actor?: User): AdmissionLead | null {
    const all = this.getStorage<AdmissionLead[]>(STORAGE_KEYS.LEADS, SEED_ADMISSION_LEADS);
    const idx = all.findIndex((l) => l.tenantId === tenantId && l.id === leadId);
    if (idx === -1) return null;

    const oldStage = all[idx].stage;
    all[idx].stage = stage;
    all[idx].updatedAt = new Date().toISOString();
    this.setStorage(STORAGE_KEYS.LEADS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'status_change',
        module: 'crm',
        recordId: leadId,
        details: `Moved admission lead "${all[idx].studentName}" from [${oldStage.toUpperCase()}] to [${stage.toUpperCase()}]`,
      });
    }

    return all[idx];
  }

  public convertLeadToStudent(
    tenantId: string,
    leadId: string,
    classId: string,
    sectionId: string,
    actor?: User
  ): { student: Student; lead: AdmissionLead } | null {
    const leads = this.getLeads(tenantId);
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    const nameParts = lead.studentName.trim().split(' ');
    const firstName = nameParts[0] || lead.studentName;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create enrolled student
    const createdStudent = this.createStudent(
      tenantId,
      {
        admissionNo: `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        rollNo: `${Math.floor(10 + Math.random() * 30)}`,
        firstName,
        lastName,
        gender: lead.gender,
        dob: lead.dob || '2011-05-15',
        bloodGroup: 'B+',
        admissionDate: new Date().toISOString().split('T')[0],
        academicYearId: 'ay-2026-2027',
        classId,
        sectionId,
        status: 'active',
        attendancePercentage: 100,
        academicAverage: 85,
        feeBalance: 0,
        riskStatus: 'stable',
        riskReasons: [],
        recommendedActions: ['Complete parent onboarding', 'Issue student identity badge and portal credentials'],
        documents: [],
        parentGuardian: {
          fatherName: lead.parentName,
          fatherPhone: lead.parentPhone,
          fatherEmail: lead.parentEmail,
          motherName: 'Guardian',
          motherPhone: lead.parentPhone,
          emergencyContactPhone: lead.parentPhone,
          residentialAddress: 'Residential Campus Zone',
        },
      },
      actor
    );

    // Update lead stage to enrolled
    this.updateLeadStage(tenantId, leadId, 'enrolled', actor);

    return { student: createdStudent, lead };
  }

  // --- Automation Studio & AI Autonomous Agents ---
  public getAiAgents(tenantId: string): AiAgentConfig[] {
    const all = this.getStorage<AiAgentConfig[]>(STORAGE_KEYS.AI_AGENTS, SEED_AI_AGENTS);
    return all.filter((a) => a.tenantId === tenantId);
  }

  public getAutomationRules(tenantId: string): AutomationRule[] {
    const all = this.getStorage<AutomationRule[]>(STORAGE_KEYS.AUTOMATION_RULES, SEED_AUTOMATION_RULES);
    return all.filter((r) => r.tenantId === tenantId);
  }

  public toggleAutomationRule(tenantId: string, ruleId: string, actor?: User): boolean {
    const all = this.getStorage<AutomationRule[]>(STORAGE_KEYS.AUTOMATION_RULES, SEED_AUTOMATION_RULES);
    const idx = all.findIndex((r) => r.tenantId === tenantId && r.id === ruleId);
    if (idx === -1) return false;

    all[idx].isActive = !all[idx].isActive;
    this.setStorage(STORAGE_KEYS.AUTOMATION_RULES, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'operations',
        recordId: ruleId,
        details: `${all[idx].isActive ? 'Enabled' : 'Disabled'} automation rule "${all[idx].name}"`,
      });
    }

    return all[idx].isActive;
  }

  public createAutomationRule(
    tenantId: string,
    data: Omit<AutomationRule, 'id' | 'tenantId' | 'executionCount'>,
    actor?: User
  ): AutomationRule {
    const all = this.getStorage<AutomationRule[]>(STORAGE_KEYS.AUTOMATION_RULES, SEED_AUTOMATION_RULES);
    const newRule: AutomationRule = {
      ...data,
      id: `rule-${Date.now()}`,
      tenantId,
      executionCount: 0,
    };
    all.unshift(newRule);
    this.setStorage(STORAGE_KEYS.AUTOMATION_RULES, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newRule.id,
        details: `Configured new autonomous workflow: "${newRule.name}"`,
      });
    }
    return newRule;
  }

  public getPendingApprovals(tenantId: string): PendingAutomationApproval[] {
    const all = this.getStorage<PendingAutomationApproval[]>(STORAGE_KEYS.PENDING_APPROVALS, SEED_PENDING_APPROVALS);
    return all.filter((p) => p.tenantId === tenantId);
  }

  public approvePendingAction(tenantId: string, approvalId: string, actor?: User): boolean {
    const all = this.getStorage<PendingAutomationApproval[]>(STORAGE_KEYS.PENDING_APPROVALS, SEED_PENDING_APPROVALS);
    const item = all.find((p) => p.tenantId === tenantId && p.id === approvalId);
    if (!item) return false;

    item.status = 'approved';
    this.setStorage(STORAGE_KEYS.PENDING_APPROVALS, all);

    // Update agent actions counter
    const agents = this.getStorage<AiAgentConfig[]>(STORAGE_KEYS.AI_AGENTS, SEED_AI_AGENTS);
    const agent = agents.find((a) => a.tenantId === tenantId && a.id === item.agentId);
    if (agent) {
      agent.actionsPerformedToday += 1;
      agent.pendingApprovalsCount = Math.max(0, agent.pendingApprovalsCount - 1);
      this.setStorage(STORAGE_KEYS.AI_AGENTS, agents);
    }

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'operations',
        recordId: approvalId,
        details: `Approved AI Autonomous Action: "${item.title}" (${item.recipientSummary})`,
      });
    }

    return true;
  }

  public rejectPendingAction(tenantId: string, approvalId: string, actor?: User): boolean {
    const all = this.getStorage<PendingAutomationApproval[]>(STORAGE_KEYS.PENDING_APPROVALS, SEED_PENDING_APPROVALS);
    const item = all.find((p) => p.tenantId === tenantId && p.id === approvalId);
    if (!item) return false;

    item.status = 'rejected';
    this.setStorage(STORAGE_KEYS.PENDING_APPROVALS, all);

    const agents = this.getStorage<AiAgentConfig[]>(STORAGE_KEYS.AI_AGENTS, SEED_AI_AGENTS);
    const agent = agents.find((a) => a.tenantId === tenantId && a.id === item.agentId);
    if (agent) {
      agent.pendingApprovalsCount = Math.max(0, agent.pendingApprovalsCount - 1);
      this.setStorage(STORAGE_KEYS.AI_AGENTS, agents);
    }

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'status_change',
        module: 'operations',
        recordId: approvalId,
        details: `Rejected AI Autonomous Action: "${item.title}"`,
      });
    }

    return true;
  }

  // --- Transport & Fleet Engine ---
  public getTransportVehicles(tenantId: string): BusVehicle[] {
    const all = this.getStorage<BusVehicle[]>(STORAGE_KEYS.TRANSPORT_VEHICLES, SEED_BUS_VEHICLES);
    return all.filter((v) => v.tenantId === tenantId);
  }

  public getTransportRoutes(tenantId: string): BusRoute[] {
    const all = this.getStorage<BusRoute[]>(STORAGE_KEYS.TRANSPORT_ROUTES, SEED_BUS_ROUTES);
    return all.filter((r) => r.tenantId === tenantId);
  }

  public saveBusVehicle(tenantId: string, data: Omit<BusVehicle, 'id' | 'tenantId'>, actor?: User): BusVehicle {
    const all = this.getStorage<BusVehicle[]>(STORAGE_KEYS.TRANSPORT_VEHICLES, SEED_BUS_VEHICLES);
    const newVehicle: BusVehicle = {
      ...data,
      id: `veh-${Date.now()}`,
      tenantId,
    };
    all.unshift(newVehicle);
    this.setStorage(STORAGE_KEYS.TRANSPORT_VEHICLES, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newVehicle.id,
        details: `Added new bus vehicle ${newVehicle.vehicleNo} (${newVehicle.busModel}) to institutional fleet`,
      });
    }

    return newVehicle;
  }

  public saveBusRoute(tenantId: string, data: Omit<BusRoute, 'id' | 'tenantId'>, actor?: User): BusRoute {
    const all = this.getStorage<BusRoute[]>(STORAGE_KEYS.TRANSPORT_ROUTES, SEED_BUS_ROUTES);
    const newRoute: BusRoute = {
      ...data,
      id: `route-${Date.now()}`,
      tenantId,
    };
    all.unshift(newRoute);
    this.setStorage(STORAGE_KEYS.TRANSPORT_ROUTES, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newRoute.id,
        details: `Configured school bus transit route ${newRoute.routeCode} - ${newRoute.routeName}`,
      });
    }

    return newRoute;
  }

  // --- Library Management Engine ---
  public getLibraryBooks(tenantId: string): LibraryBook[] {
    const all = this.getStorage<LibraryBook[]>(STORAGE_KEYS.LIBRARY_BOOKS, SEED_LIBRARY_BOOKS);
    return all.filter((b) => b.tenantId === tenantId);
  }

  public getLibraryCirculation(tenantId: string): BookCirculationRecord[] {
    const all = this.getStorage<BookCirculationRecord[]>(STORAGE_KEYS.LIBRARY_CIRCULATION, SEED_BOOK_CIRCULATION);
    return all.filter((c) => c.tenantId === tenantId);
  }

  public issueBook(tenantId: string, data: Omit<BookCirculationRecord, 'id' | 'tenantId'>, actor?: User): BookCirculationRecord {
    const allCirc = this.getStorage<BookCirculationRecord[]>(STORAGE_KEYS.LIBRARY_CIRCULATION, SEED_BOOK_CIRCULATION);
    const books = this.getStorage<LibraryBook[]>(STORAGE_KEYS.LIBRARY_BOOKS, SEED_LIBRARY_BOOKS);

    // Deduct available copy
    const targetBook = books.find((b) => b.tenantId === tenantId && b.id === data.bookId);
    if (targetBook && targetBook.availableCopies > 0) {
      targetBook.availableCopies -= 1;
      this.setStorage(STORAGE_KEYS.LIBRARY_BOOKS, books);
    }

    const newRecord: BookCirculationRecord = {
      ...data,
      id: `circ-${Date.now()}`,
      tenantId,
    };
    allCirc.unshift(newRecord);
    this.setStorage(STORAGE_KEYS.LIBRARY_CIRCULATION, allCirc);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newRecord.id,
        details: `Issued book "${data.bookTitle}" to student ${data.studentName} (Due: ${data.dueDate})`,
      });
    }

    return newRecord;
  }

  public returnBook(tenantId: string, circulationId: string, lateFine: number = 0, actor?: User): boolean {
    const allCirc = this.getStorage<BookCirculationRecord[]>(STORAGE_KEYS.LIBRARY_CIRCULATION, SEED_BOOK_CIRCULATION);
    const rec = allCirc.find((c) => c.tenantId === tenantId && c.id === circulationId);
    if (!rec) return false;

    rec.status = 'returned';
    rec.returnDate = new Date().toISOString().split('T')[0];
    rec.lateFineAmount = lateFine;
    this.setStorage(STORAGE_KEYS.LIBRARY_CIRCULATION, allCirc);

    // Increment available copy
    const books = this.getStorage<LibraryBook[]>(STORAGE_KEYS.LIBRARY_BOOKS, SEED_LIBRARY_BOOKS);
    const targetBook = books.find((b) => b.tenantId === tenantId && b.id === rec.bookId);
    if (targetBook) {
      targetBook.availableCopies = Math.min(targetBook.totalCopies, targetBook.availableCopies + 1);
      this.setStorage(STORAGE_KEYS.LIBRARY_BOOKS, books);
    }

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'update',
        module: 'operations',
        recordId: circulationId,
        details: `Returned book "${rec.bookTitle}" from ${rec.studentName}${lateFine > 0 ? ` with fine of ₹${lateFine}` : ''}`,
      });
    }

    return true;
  }

  public addLibraryBook(tenantId: string, data: Omit<LibraryBook, 'id' | 'tenantId'>, actor?: User): LibraryBook {
    const books = this.getStorage<LibraryBook[]>(STORAGE_KEYS.LIBRARY_BOOKS, SEED_LIBRARY_BOOKS);
    const newBook: LibraryBook = {
      ...data,
      id: `bk-${Date.now()}`,
      tenantId,
    };
    books.unshift(newBook);
    this.setStorage(STORAGE_KEYS.LIBRARY_BOOKS, books);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newBook.id,
        details: `Cataloged new library accession "${newBook.title}" by ${newBook.author} (${newBook.totalCopies} copies, ${newBook.rackShelfLocation})`,
      });
    }

    return newBook;
  }

  // --- Official Documents & Certificates Engine ---
  public getCertificates(tenantId: string): CertificateRecord[] {
    const all = this.getStorage<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, SEED_CERTIFICATES);
    return all.filter((c) => c.tenantId === tenantId);
  }

  public issueCertificate(
    tenantId: string,
    data: Omit<CertificateRecord, 'id' | 'tenantId' | 'status'>,
    actor?: User
  ): CertificateRecord {
    const all = this.getStorage<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, SEED_CERTIFICATES);
    const newCert: CertificateRecord = {
      ...data,
      id: `cert-${Date.now()}`,
      tenantId,
      status: 'issued',
    };
    all.unshift(newCert);
    this.setStorage(STORAGE_KEYS.CERTIFICATES, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newCert.id,
        details: `Issued official ${newCert.type.replace('_', ' ').toUpperCase()} #${newCert.certificateNo} for ${newCert.studentName}`,
      });
    }

    return newCert;
  }

  // --- School Notices & Circulars Engine ---
  public getNotices(tenantId: string): SchoolNotice[] {
    const all = this.getStorage<SchoolNotice[]>(STORAGE_KEYS.NOTICES, SEED_SCHOOL_NOTICES);
    return all.filter((n) => n.tenantId === tenantId);
  }

  public publishNotice(
    tenantId: string,
    data: Omit<SchoolNotice, 'id' | 'tenantId'>,
    actor?: User
  ): SchoolNotice {
    const all = this.getStorage<SchoolNotice[]>(STORAGE_KEYS.NOTICES, SEED_SCHOOL_NOTICES);
    const newNotice: SchoolNotice = {
      ...data,
      id: `not-${Date.now()}`,
      tenantId,
    };
    all.unshift(newNotice);
    this.setStorage(STORAGE_KEYS.NOTICES, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newNotice.id,
        details: `Published official circular "${newNotice.title}" [${newNotice.noticeNo}] to ${newNotice.targetAudience}`,
      });
    }

    return newNotice;
  }

  // --- Academic Calendar & Events Engine ---
  public getEvents(tenantId: string): SchoolEvent[] {
    const all = this.getStorage<SchoolEvent[]>(STORAGE_KEYS.EVENTS, SEED_SCHOOL_EVENTS);
    return all.filter((e) => e.tenantId === tenantId);
  }

  public createEvent(
    tenantId: string,
    data: Omit<SchoolEvent, 'id' | 'tenantId'>,
    actor?: User
  ): SchoolEvent {
    const all = this.getStorage<SchoolEvent[]>(STORAGE_KEYS.EVENTS, SEED_SCHOOL_EVENTS);
    const newEvent: SchoolEvent = {
      ...data,
      id: `ev-${Date.now()}`,
      tenantId,
    };
    all.unshift(newEvent);
    this.setStorage(STORAGE_KEYS.EVENTS, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newEvent.id,
        details: `Scheduled campus event "${newEvent.title}" on ${newEvent.startDate}`,
      });
    }

    return newEvent;
  }

  // --- Staff Payroll & HR Engine ---
  public getStaffPayroll(tenantId: string): StaffPayrollRecord[] {
    const all = this.getStorage<StaffPayrollRecord[]>(STORAGE_KEYS.PAYROLL, SEED_STAFF_PAYROLL);
    return all.filter((p) => p.tenantId === tenantId);
  }

  public processStaffPayroll(
    tenantId: string,
    data: Omit<StaffPayrollRecord, 'id' | 'tenantId'>,
    actor?: User
  ): StaffPayrollRecord {
    const all = this.getStorage<StaffPayrollRecord[]>(STORAGE_KEYS.PAYROLL, SEED_STAFF_PAYROLL);
    const newRecord: StaffPayrollRecord = {
      ...data,
      id: `pay-${Date.now()}`,
      tenantId,
    };
    all.unshift(newRecord);
    this.setStorage(STORAGE_KEYS.PAYROLL, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'create',
        module: 'operations',
        recordId: newRecord.id,
        details: `Processed payroll payslip for ${newRecord.staffName} (${newRecord.designation}) for ${newRecord.month} - Net: ₹${newRecord.netSalary.toLocaleString()}`,
      });
    }

    return newRecord;
  }

  public markSalaryPaid(tenantId: string, recordId: string, ref: string, actor?: User): boolean {
    const all = this.getStorage<StaffPayrollRecord[]>(STORAGE_KEYS.PAYROLL, SEED_STAFF_PAYROLL);
    const rec = all.find((p) => p.tenantId === tenantId && p.id === recordId);
    if (!rec) return false;

    rec.paymentStatus = 'paid';
    rec.transactionRef = ref;
    rec.payDate = new Date().toISOString().split('T')[0];
    this.setStorage(STORAGE_KEYS.PAYROLL, all);

    if (actor) {
      this.logAudit({
        tenantId,
        userId: actor.id,
        userName: actor.name,
        userRole: actor.role,
        action: 'status_change',
        module: 'operations',
        recordId,
        details: `Disbursed salary to ${rec.staffName} (Ref: ${ref})`,
      });
    }

    return true;
  }
}

// --- Seed Data for Admissions CRM ---
const SEED_ADMISSION_LEADS: AdmissionLead[] = [
  {
    id: 'lead-01',
    tenantId: 'tenant-dps',
    studentName: 'Rohan Varma',
    gender: 'male',
    dob: '2011-04-12',
    applyingForClassId: 'cls-grade-9',
    parentName: 'Alok Varma',
    parentPhone: '+91 98112 34567',
    parentEmail: 'alok.varma@gmail.com',
    source: 'website',
    stage: 'inquiry',
    leadScore: 88,
    notes: 'Interested in CBSE science stream with advanced robotics lab elective.',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'lead-02',
    tenantId: 'tenant-dps',
    studentName: 'Meera Sen',
    gender: 'female',
    dob: '2009-08-22',
    applyingForClassId: 'cls-grade-11',
    parentName: 'Priya Sen',
    parentPhone: '+91 98223 45678',
    parentEmail: 'priya.sen@outlook.com',
    source: 'referral',
    stage: 'campus_tour',
    leadScore: 94,
    notes: 'Transfer from Kolkata DPS branch. Father relocated to central Delhi.',
    scheduledTourDate: '2026-10-08T11:00:00.000Z',
    createdAt: '2026-09-28T09:30:00.000Z',
    updatedAt: '2026-10-02T14:15:00.000Z',
  },
  {
    id: 'lead-03',
    tenantId: 'tenant-dps',
    studentName: 'Kabir Mehta',
    gender: 'male',
    dob: '2014-02-18',
    applyingForClassId: 'cls-grade-6',
    parentName: 'Vikram Mehta',
    parentPhone: '+91 98334 56789',
    source: 'walk_in',
    stage: 'application_submitted',
    leadScore: 78,
    notes: 'Physical admission application and prior marksheet submitted at front desk.',
    createdAt: '2026-09-25T11:00:00.000Z',
    updatedAt: '2026-10-03T16:00:00.000Z',
  },
  {
    id: 'lead-04',
    tenantId: 'tenant-dps',
    studentName: 'Anya Kapoor',
    gender: 'female',
    dob: '2010-11-05',
    applyingForClassId: 'cls-grade-10',
    parentName: 'Sonia Kapoor',
    parentPhone: '+91 98445 67890',
    parentEmail: 'sonia.kapoor@innovate.co',
    source: 'social_media',
    stage: 'assessment',
    leadScore: 86,
    assessmentScore: 89,
    notes: 'Scored 89/100 in Mathematics & English diagnostic assessment.',
    createdAt: '2026-09-20T14:20:00.000Z',
    updatedAt: '2026-10-04T10:00:00.000Z',
  },
  {
    id: 'lead-05',
    tenantId: 'tenant-dps',
    studentName: 'Divya Nair',
    gender: 'female',
    dob: '2012-07-30',
    applyingForClassId: 'cls-grade-8',
    parentName: 'Harish Nair',
    parentPhone: '+91 98556 78901',
    parentEmail: 'harish.nair@corp.in',
    source: 'education_fair',
    stage: 'approved',
    leadScore: 98,
    notes: 'Principal interview cleared. Ready for enrollment fee collection.',
    createdAt: '2026-09-15T15:00:00.000Z',
    updatedAt: '2026-10-04T12:00:00.000Z',
  },
  {
    id: 'lead-06',
    tenantId: 'tenant-dps',
    studentName: 'Aarav Joshi',
    gender: 'male',
    dob: '2013-05-14',
    applyingForClassId: 'cls-grade-7',
    parentName: 'Sunita Joshi',
    parentPhone: '+91 98667 89012',
    source: 'website',
    stage: 'enrolled',
    leadScore: 100,
    notes: 'Successfully enrolled. Admission No: ADM-2026-9042.',
    createdAt: '2026-09-10T08:00:00.000Z',
    updatedAt: '2026-09-22T10:30:00.000Z',
  },
];

// --- Seed Data for AI Autonomous Agents ---
const SEED_AI_AGENTS: AiAgentConfig[] = [
  {
    id: 'agent-sentinel',
    tenantId: 'tenant-dps',
    agentName: 'Attendance Sentinel Agent',
    role: 'Statutory Compliance & Early Warning Guardian',
    description: 'Continuously audits biometric and class registers, predicts threshold violations, and drafts parent notifications.',
    status: 'active',
    confidenceScore: 98,
    actionsPerformedToday: 14,
    pendingApprovalsCount: 1,
    iconName: 'CalendarCheck',
  },
  {
    id: 'agent-revenue',
    tenantId: 'tenant-dps',
    agentName: 'Fee Recovery & Cashflow Agent',
    role: 'Autonomous Accounts Receivable Ops',
    description: 'Monitors payment deadlines, segments defaulters by delinquency risk, and triggers personalized WhatsApp payment reminders.',
    status: 'active',
    confidenceScore: 94,
    actionsPerformedToday: 26,
    pendingApprovalsCount: 1,
    iconName: 'DollarSign',
  },
  {
    id: 'agent-academic',
    tenantId: 'tenant-dps',
    agentName: 'Academic Intervention Agent',
    role: 'Student Learning & Diagnostic Specialist',
    description: 'Analyzes examination mark trends, detects subject regressions >10%, and formulates remedial action plans for faculty review.',
    status: 'active',
    confidenceScore: 92,
    actionsPerformedToday: 9,
    pendingApprovalsCount: 1,
    iconName: 'GraduationCap',
  },
  {
    id: 'agent-concierge',
    tenantId: 'tenant-dps',
    agentName: 'Admissions Concierge Agent',
    role: 'Prospect Engagement & Tour Coordinator',
    description: 'Engages inbound prospective parents, scores enrollment propensity, and coordinates campus visit schedules.',
    status: 'active',
    confidenceScore: 96,
    actionsPerformedToday: 18,
    pendingApprovalsCount: 0,
    iconName: 'UserCheck',
  },
];

// --- Seed Data for Automation Rules ---
const SEED_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-att-01',
    tenantId: 'tenant-dps',
    name: 'Statutory Attendance Breach Escalation',
    description: 'When student aggregate drops below 75%, trigger immediate WhatsApp alert to registered parent and notify Class Teacher.',
    triggerEvent: 'attendance_below_threshold',
    condition: 'Aggregate Attendance < 75%',
    actionType: 'send_whatsapp',
    targetAudience: 'parents',
    isActive: true,
    executionCount: 42,
    lastExecutedAt: '2026-10-05T07:45:00.000Z',
  },
  {
    id: 'rule-fee-01',
    tenantId: 'tenant-dps',
    name: 'Tuition Fee Past-Due Recovery Sequence',
    description: 'When quarterly tuition invoice is overdue by >15 days, queue automated WhatsApp reminder with direct UPI payment link.',
    triggerEvent: 'fee_overdue',
    condition: 'Fee Balance > 0 AND Overdue Days >= 15',
    actionType: 'require_human_approval',
    targetAudience: 'parents',
    isActive: true,
    executionCount: 88,
    lastExecutedAt: '2026-10-04T18:00:00.000Z',
  },
  {
    id: 'rule-acad-01',
    tenantId: 'tenant-dps',
    name: 'Academic Regression Early Warning',
    description: 'When student examination percentage drops by >10% compared to previous term, flag for Academic Intervention & zero-period remedial class.',
    triggerEvent: 'exam_marks_regression',
    condition: 'Exam Score Drop > 10% in Core Subjects',
    actionType: 'flag_student',
    targetAudience: 'teachers',
    isActive: true,
    executionCount: 19,
    lastExecutedAt: '2026-10-03T11:20:00.000Z',
  },
  {
    id: 'rule-crm-01',
    tenantId: 'tenant-dps',
    name: 'Instant Admission Inquiry WhatsApp Welcome',
    description: 'When new lead submits inquiry via portal or walk-in, dispatch welcome prospectus brochure and schedule campus tour prompt.',
    triggerEvent: 'lead_created',
    condition: 'Lead Source IN (website, walk_in, referral)',
    actionType: 'send_whatsapp',
    targetAudience: 'parents',
    isActive: true,
    executionCount: 31,
    lastExecutedAt: '2026-10-01T10:05:00.000Z',
  },
];

// --- Seed Data for Pending Approvals (Human-in-the-Loop) ---
const SEED_PENDING_APPROVALS: PendingAutomationApproval[] = [
  {
    id: 'appr-01',
    tenantId: 'tenant-dps',
    agentId: 'agent-revenue',
    agentName: 'Fee Recovery & Cashflow Agent',
    title: 'Batch WhatsApp Fee Overdue Notice (14 Defaulters)',
    description: 'Quarterly tuition fee overdue > 15 days across Grade 9 & Grade 10 students.',
    actionType: 'whatsapp_dispatch',
    recipientSummary: '14 Registered Parents (Total Outstanding: ₹2,10,000)',
    payloadSummary: 'Dear Parent, this is a gentle reminder from Delhi Public Academy regarding Term 2 tuition fee of ₹15,000 pending past due. Click here to settle online via UPI.',
    priority: 'high',
    createdAt: '2026-10-05T06:30:00.000Z',
    status: 'pending',
  },
  {
    id: 'appr-02',
    tenantId: 'tenant-dps',
    agentId: 'agent-sentinel',
    agentName: 'Attendance Sentinel Agent',
    title: 'Statutory Attendance Warning Letter to Parents of Aarav Kapoor',
    description: 'Aarav Kapoor (Grade 10-A) attendance dropped to 68.4%, falling below statutory board eligibility criteria.',
    actionType: 'whatsapp_dispatch',
    recipientSummary: 'Mr. Arun Kapoor (+91 98188 77665)',
    payloadSummary: 'Official Notice: Student Aarav Kapoor attendance has fallen to 68.4%. Please contact the Vice Principal office immediately to avoid exam registration barring.',
    priority: 'high',
    createdAt: '2026-10-05T07:15:00.000Z',
    status: 'pending',
  },
  {
    id: 'appr-03',
    tenantId: 'tenant-dps',
    agentId: 'agent-academic',
    agentName: 'Academic Intervention Agent',
    title: 'Assign Zero-Period Remedial Math Classes for 3 Grade 10 Students',
    description: 'Identified 3 students with >12% decline in Quadratic Equations unit test.',
    actionType: 'academic_remedial',
    recipientSummary: 'Dr. Sunita Rao (PGT Mathematics) & 3 Students',
    payloadSummary: 'Recommended zero-period bridge sessions: Tuesdays & Thursdays 7:30 AM - 8:15 AM in Room 204.',
    priority: 'medium',
    createdAt: '2026-10-04T16:45:00.000Z',
    status: 'pending',
  },
];

// --- Seed Data for Transport & Fleet ---
const SEED_BUS_VEHICLES: BusVehicle[] = [
  {
    id: 'veh-01',
    tenantId: 'tenant-dps',
    vehicleNo: 'DL-01-AB-4021',
    busModel: 'Tata Starbus Ultra AC (42 Seater)',
    capacity: 42,
    driverName: 'Ramesh Yadav',
    driverPhone: '+91 98111 22334',
    driverLicenseNo: 'DL-042011004921',
    conductorName: 'Sonu Kumar',
    conductorPhone: '+91 98111 55667',
    gpsDeviceId: 'GPS-DEL-4021',
    insuranceExpiryDate: '2027-04-15',
    fitnessCertExpiryDate: '2027-03-30',
    status: 'on_route',
  },
  {
    id: 'veh-02',
    tenantId: 'tenant-dps',
    vehicleNo: 'DL-01-CD-8812',
    busModel: 'Ashok Leyland Sunshine (50 Seater)',
    capacity: 50,
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 98222 33445',
    driverLicenseNo: 'DL-052014008123',
    conductorName: 'Ramu Paswan',
    conductorPhone: '+91 98222 66778',
    gpsDeviceId: 'GPS-DEL-8812',
    insuranceExpiryDate: '2027-06-20',
    fitnessCertExpiryDate: '2027-05-18',
    status: 'on_route',
  },
  {
    id: 'veh-03',
    tenantId: 'tenant-dps',
    vehicleNo: 'DL-01-EF-1904',
    busModel: 'Force Traveller Mini (26 Seater)',
    capacity: 26,
    driverName: 'Suresh Pal',
    driverPhone: '+91 98333 44556',
    driverLicenseNo: 'DL-082016009941',
    conductorName: 'Balbir Singh',
    conductorPhone: '+91 98333 77889',
    gpsDeviceId: 'GPS-DEL-1904',
    insuranceExpiryDate: '2027-01-10',
    fitnessCertExpiryDate: '2026-12-31',
    status: 'idle',
  },
];

const SEED_BUS_ROUTES: BusRoute[] = [
  {
    id: 'route-01',
    tenantId: 'tenant-dps',
    routeName: 'North Campus & Civil Lines Express',
    routeCode: 'R-01',
    vehicleId: 'veh-01',
    morningStartTime: '07:00 AM',
    eveningStartTime: '02:15 PM',
    stops: [
      { id: 'stop-01', stopName: 'Model Town Metro Station', morningPickupTime: '07:15 AM', eveningDropTime: '02:40 PM', studentIds: ['student-01', 'student-02'] },
      { id: 'stop-02', stopName: 'Civil Lines Officer Colony', morningPickupTime: '07:30 AM', eveningDropTime: '02:55 PM', studentIds: ['student-03'] },
      { id: 'stop-03', stopName: 'Kashmere Gate ISBT Ring Road', morningPickupTime: '07:45 AM', eveningDropTime: '03:10 PM', studentIds: [] },
      { id: 'stop-04', stopName: 'Delhi Public Academy Main Gate', morningPickupTime: '08:10 AM', eveningDropTime: '02:20 PM', studentIds: [] },
    ],
  },
  {
    id: 'route-02',
    tenantId: 'tenant-dps',
    routeName: 'South Ext & Greater Kailash Circuit',
    routeCode: 'R-02',
    vehicleId: 'veh-02',
    morningStartTime: '06:45 AM',
    eveningStartTime: '02:15 PM',
    stops: [
      { id: 'stop-05', stopName: 'GK-1 M-Block Market', morningPickupTime: '07:05 AM', eveningDropTime: '02:50 PM', studentIds: ['student-04'] },
      { id: 'stop-06', stopName: 'South Extension Part II Ring', morningPickupTime: '07:25 AM', eveningDropTime: '03:10 PM', studentIds: ['student-05'] },
      { id: 'stop-07', stopName: 'Defence Colony Flyover', morningPickupTime: '07:40 AM', eveningDropTime: '03:25 PM', studentIds: [] },
      { id: 'stop-08', stopName: 'Delhi Public Academy Main Gate', morningPickupTime: '08:15 AM', eveningDropTime: '02:20 PM', studentIds: [] },
    ],
  },
];

// --- Seed Data for Library Management ---
const SEED_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'bk-01',
    tenantId: 'tenant-dps',
    isbn: '978-8177091878',
    accessionNo: 'ACC-PHY-001',
    title: 'Concepts of Physics (Vol 1 & 2)',
    author: 'Dr. H.C. Verma',
    category: 'Sciences',
    rackShelfLocation: 'Rack S-04 / Shelf B',
    totalCopies: 15,
    availableCopies: 12,
  },
  {
    id: 'bk-02',
    tenantId: 'tenant-dps',
    isbn: '978-0470458365',
    accessionNo: 'ACC-MTH-002',
    title: 'Advanced Engineering Mathematics',
    author: 'Erwin Kreyszig',
    category: 'Mathematics',
    rackShelfLocation: 'Rack M-02 / Shelf A',
    totalCopies: 10,
    availableCopies: 8,
  },
  {
    id: 'bk-03',
    tenantId: 'tenant-dps',
    isbn: '978-0262033848',
    accessionNo: 'ACC-CSC-003',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Computer Science',
    rackShelfLocation: 'Rack CS-01 / Shelf C',
    totalCopies: 12,
    availableCopies: 9,
  },
  {
    id: 'bk-04',
    tenantId: 'tenant-dps',
    isbn: '978-0143031031',
    accessionNo: 'ACC-HIS-004',
    title: 'India After Gandhi: The History of the World\'s Largest Democracy',
    author: 'Ramachandra Guha',
    category: 'History',
    rackShelfLocation: 'Rack H-03 / Shelf D',
    totalCopies: 8,
    availableCopies: 5,
  },
  {
    id: 'bk-05',
    tenantId: 'tenant-dps',
    isbn: '978-1853260001',
    accessionNo: 'ACC-LIT-005',
    title: 'The Complete Works of William Shakespeare',
    author: 'William Shakespeare',
    category: 'Literature',
    rackShelfLocation: 'Rack L-01 / Shelf B',
    totalCopies: 10,
    availableCopies: 7,
  },
  {
    id: 'bk-06',
    tenantId: 'tenant-dps',
    isbn: '978-8174508126',
    accessionNo: 'ACC-REF-006',
    title: 'NCERT Mathematics Exemplar Problems (Class X)',
    author: 'NCERT Editorial Board',
    category: 'Reference',
    rackShelfLocation: 'Rack REF-05 / Shelf A',
    totalCopies: 25,
    availableCopies: 22,
  },
];

const SEED_BOOK_CIRCULATION: BookCirculationRecord[] = [
  {
    id: 'circ-01',
    tenantId: 'tenant-dps',
    bookId: 'bk-01',
    bookTitle: 'Concepts of Physics (Vol 1 & 2)',
    studentId: 'student-aarav',
    studentName: 'Aarav Kapoor',
    studentClass: 'Grade 10-A',
    issueDate: '2026-09-28',
    dueDate: '2026-10-12',
    status: 'issued',
    lateFineAmount: 0,
  },
  {
    id: 'circ-02',
    tenantId: 'tenant-dps',
    bookId: 'bk-05',
    bookTitle: 'The Complete Works of William Shakespeare',
    studentId: 'student-diya',
    studentName: 'Diya Sharma',
    studentClass: 'Grade 10-A',
    issueDate: '2026-09-15',
    dueDate: '2026-09-29',
    status: 'overdue',
    lateFineAmount: 30, // ₹5 per day overdue
  },
  {
    id: 'circ-03',
    tenantId: 'tenant-dps',
    bookId: 'bk-03',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    studentId: 'student-rohan',
    studentName: 'Rohan Mehta',
    studentClass: 'Grade 10-A',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    status: 'issued',
    lateFineAmount: 0,
  },
];

// --- Seed Data for Official Certificates & Documents ---
const SEED_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-01',
    tenantId: 'tenant-dps',
    certificateNo: 'TC/2026/014',
    type: 'transfer_certificate',
    studentId: 'student-diya',
    studentName: 'Diya Sharma',
    studentClass: 'Grade 10-A',
    admissionNo: 'DPA-2023-014',
    issueDate: '2026-10-01',
    purpose: 'Relocation to Mumbai (Parent Job Transfer)',
    reasonForLeaving: 'Parental relocation to another city',
    conduct: 'Exemplary',
    promotedToNextClass: true,
    duesClearedMonth: 'September 2026',
    academicYear: '2026-2027',
    status: 'issued',
  },
  {
    id: 'cert-02',
    tenantId: 'tenant-dps',
    certificateNo: 'BON/2026/189',
    type: 'bonafide_certificate',
    studentId: 'student-aarav',
    studentName: 'Aarav Kapoor',
    studentClass: 'Grade 10-A',
    admissionNo: 'DPA-2024-089',
    issueDate: '2026-10-03',
    purpose: 'Passport Application & International Olympiad Verification',
    conduct: 'Very Good',
    academicYear: '2026-2027',
    status: 'issued',
  },
  {
    id: 'cert-03',
    tenantId: 'tenant-dps',
    certificateNo: 'TAX-80C/2026/410',
    type: 'fee_tax_80c',
    studentId: 'student-aarav',
    studentName: 'Aarav Kapoor',
    studentClass: 'Grade 10-A',
    admissionNo: 'DPA-2024-089',
    issueDate: '2026-10-04',
    purpose: 'Parent Income Tax Section 80C Deduction (AY 2026-27)',
    conduct: 'Good',
    academicYear: '2026-2027',
    status: 'issued',
  },
];

// --- Seed Data for School Circulars & Notices ---
const SEED_SCHOOL_NOTICES: SchoolNotice[] = [
  {
    id: 'not-01',
    tenantId: 'tenant-dps',
    noticeNo: 'CIR/2026/012',
    title: 'Mid-Term Examination Schedule & Practical Assessment Guidelines',
    content: 'The Mid-Term Summative Assessments for Classes IX through XII will commence from October 15, 2026. Hall tickets will be issued following clearance of Term 2 tuition dues. Students must report to examination rooms by 8:15 AM sharp.',
    targetAudience: 'all',
    priority: 'urgent',
    publishDate: '2026-10-04',
    publisherName: 'Office of the Principal',
    attachmentName: 'MidTerm_DateSheet_2026.pdf',
  },
  {
    id: 'not-02',
    tenantId: 'tenant-dps',
    noticeNo: 'CIR/2026/011',
    title: 'Annual Inter-House Athletics Meet & Winter Sports Registration',
    content: 'Selections for the Annual Inter-House Track & Field Meet will begin on Friday, October 10. Interested students must submit entry forms to their respective House Captains or Coach R. Singh.',
    targetAudience: 'students',
    priority: 'normal',
    publishDate: '2026-10-02',
    publisherName: 'Department of Physical Education',
    attachmentName: 'Sports_Events_EntryForm.pdf',
  },
  {
    id: 'not-03',
    tenantId: 'tenant-dps',
    noticeNo: 'CIR/2026/010',
    title: 'Parent-Teacher Meeting (PTM) for Term 1 Diagnostic Review',
    content: 'Mandatory Parent-Teacher Interaction for Classes VI to XII will take place on Saturday, October 11, from 9:00 AM to 1:00 PM. Parents may schedule dedicated 10-minute slots with Subject Educators via the Parent Portal.',
    targetAudience: 'parents',
    priority: 'important',
    publishDate: '2026-09-29',
    publisherName: 'Vice Principal Academic Affairs',
  },
];

// --- Seed Data for Academic Calendar & Campus Events ---
const SEED_SCHOOL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-01',
    tenantId: 'tenant-dps',
    title: 'Mahatma Gandhi Jayanti (National Holiday)',
    description: 'School campus closed in observance of Gandhi Jayanti.',
    startDate: '2026-10-02',
    endDate: '2026-10-02',
    category: 'holiday',
    isAllDay: true,
  },
  {
    id: 'ev-02',
    tenantId: 'tenant-dps',
    title: 'Parent-Teacher Meeting (PTM Term 1)',
    description: 'Individual progress review and report card distribution in respective classrooms.',
    startDate: '2026-10-11',
    endDate: '2026-10-11',
    category: 'ptm',
    isAllDay: false,
    location: 'Main Academic Block (Rooms 101 - 308)',
  },
  {
    id: 'ev-03',
    tenantId: 'tenant-dps',
    title: 'Commencement of Mid-Term Examinations',
    description: 'Summative Assessment 1 written exams for Secondary and Senior Secondary wings.',
    startDate: '2026-10-15',
    endDate: '2026-10-24',
    category: 'exam',
    isAllDay: true,
    location: 'Central Examination Hall',
  },
  {
    id: 'ev-04',
    tenantId: 'tenant-dps',
    title: 'Annual Inter-House Football Championship',
    description: 'Final tournament matches between Shivaji, Tagore, Ashoka, and Raman houses.',
    startDate: '2026-10-28',
    endDate: '2026-10-29',
    category: 'sports',
    isAllDay: false,
    location: 'Campus Sports Ground',
  },
  {
    id: 'ev-05',
    tenantId: 'tenant-dps',
    title: 'Diwali & Autumn Break',
    description: 'Campus closed for annual festive holidays.',
    startDate: '2026-11-06',
    endDate: '2026-11-10',
    category: 'holiday',
    isAllDay: true,
  },
];

// --- Seed Data for Staff Payroll & Compensation ---
const SEED_STAFF_PAYROLL: StaffPayrollRecord[] = [
  {
    id: 'pay-01',
    tenantId: 'tenant-dps',
    staffId: 'tch-01',
    staffName: 'Dr. Sunita Rao',
    designation: 'PGT Senior Mathematics & Academic Head',
    department: 'Mathematics Wing',
    month: 'September 2026',
    payDate: '2026-09-30',
    bankAccountNo: 'HDFC-00192847192',
    pfNumber: 'DL/CPM/10924/001',
    panNumber: 'AACPR1948B',
    basicSalary: 55000,
    hra: 16500, // 30% HRA
    da: 8250,   // 15% DA
    specialAllowance: 7250,
    totalGrossSalary: 87000,
    providentFund: 6600, // 12% Basic
    tds: 5400,
    professionalTax: 200,
    totalDeductions: 12200,
    netSalary: 74800,
    paymentStatus: 'paid',
    paymentMode: 'bank_transfer',
    transactionRef: 'NEFT-HDFC-90218841',
  },
  {
    id: 'pay-02',
    tenantId: 'tenant-dps',
    staffId: 'tch-02',
    staffName: 'Mr. Rajesh Verma',
    designation: 'PGT Physics Lab Director',
    department: 'Science & Innovation',
    month: 'September 2026',
    payDate: '2026-09-30',
    bankAccountNo: 'ICIC-09281726491',
    pfNumber: 'DL/CPM/10924/002',
    panNumber: 'ABRPV4492K',
    basicSalary: 48000,
    hra: 14400,
    da: 7200,
    specialAllowance: 5400,
    totalGrossSalary: 75000,
    providentFund: 5760,
    tds: 4100,
    professionalTax: 200,
    totalDeductions: 10060,
    netSalary: 64940,
    paymentStatus: 'paid',
    paymentMode: 'bank_transfer',
    transactionRef: 'NEFT-ICIC-88271649',
  },
  {
    id: 'pay-03',
    tenantId: 'tenant-dps',
    staffId: 'tch-03',
    staffName: 'Mrs. Anita Desai',
    designation: 'TGT English Literature & Debate In-Charge',
    department: 'Humanities & Languages',
    month: 'September 2026',
    payDate: '2026-09-30',
    bankAccountNo: 'SBIN-00281948291',
    pfNumber: 'DL/CPM/10924/003',
    panNumber: 'AKQPD7719L',
    basicSalary: 42000,
    hra: 12600,
    da: 6300,
    specialAllowance: 4100,
    totalGrossSalary: 65000,
    providentFund: 5040,
    tds: 2800,
    professionalTax: 200,
    totalDeductions: 8040,
    netSalary: 56960,
    paymentStatus: 'paid',
    paymentMode: 'bank_transfer',
    transactionRef: 'NEFT-SBIN-77182941',
  },
  {
    id: 'pay-04',
    tenantId: 'tenant-dps',
    staffId: 'tch-04',
    staffName: 'Mr. Arvind Saxena',
    designation: 'Head of Physical Education & Transport In-Charge',
    department: 'Sports & Operations',
    month: 'September 2026',
    payDate: '2026-09-30',
    bankAccountNo: 'KKBK-08172648192',
    pfNumber: 'DL/CPM/10924/004',
    panNumber: 'AXPSA2201M',
    basicSalary: 38000,
    hra: 11400,
    da: 5700,
    specialAllowance: 3900,
    totalGrossSalary: 59000,
    providentFund: 4560,
    tds: 2100,
    professionalTax: 200,
    totalDeductions: 6860,
    netSalary: 52140,
    paymentStatus: 'paid',
    paymentMode: 'bank_transfer',
    transactionRef: 'NEFT-KKBK-55102948',
  },
];

export const repo = new SchoolOSRepository();
