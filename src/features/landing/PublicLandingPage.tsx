import React, { useState } from 'react';
import {
  Shield,
  GraduationCap,
  Users,
  DollarSign,
  Bus,
  FileCheck2,
  Bell,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  Building,
  Check,
  X,
  Radio,
  BookOpen,
  Calendar,
  Lock,
  ChevronRight,
  Sliders,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';

interface PublicLandingPageProps {
  onGoToDashboard: () => void;
  onOpenManual?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGoToDashboard,
  onOpenManual,
}) => {
  const { tenants, switchTenant, refreshData } = useAuth();

  // Active tour tab
  const [activeTourTab, setActiveTourTab] = useState<
    'sis' | 'timetable' | 'fees' | 'transport' | 'certificates' | 'ai'
  >('sis');

  // Pricing frequency state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // ROI Calculator states
  const [roiStudentCount, setRoiStudentCount] = useState<number>(1200);
  const [roiAnnualFee, setRoiAnnualFee] = useState<number>(65000);

  // Self-Serve Free Trial / Sign-up Modal
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [selectedPlanForSignup, setSelectedPlanForSignup] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolBoard, setSchoolBoard] = useState('CBSE');
  const [studentStrength, setStudentStrength] = useState('1200');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState<string | null>(null);

  // Computed ROI
  const calculatedHoursSavedPerMonth = Math.round(roiStudentCount * 0.15);
  const calculatedFeeRecoveryBoost = Math.round((roiStudentCount * roiAnnualFee * 0.035) / 100000); // in Lakhs
  const annualSubscriptionCost = billingCycle === 'annual' ? 227988 : 287988; // Growth plan
  const annualMonetaryBenefit = calculatedFeeRecoveryBoost * 100000 + calculatedHoursSavedPerMonth * 12 * 450;
  const roiMultiplier = Math.max(2.5, Math.round((annualMonetaryBenefit / annualSubscriptionCost) * 10) / 10);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !adminEmail || !adminFullName) return;

    setIsProvisioning(true);
    const code = schoolCode || schoolName.replace(/[^A-Za-z0-9]/g, '').slice(0, 5).toUpperCase();
    const slug = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);

    setTimeout(() => {
      const created = repo.createTenant({
        name: schoolName,
        code,
        slug,
        board: schoolBoard === 'State' ? 'State Board' : (schoolBoard as any),
        currency: 'INR',
        currencySymbol: '₹',
        plan: selectedPlanForSignup === 'pro' ? 'growth' : selectedPlanForSignup,
        subscriptionStatus: 'active',
        currentAcademicYearId: 'ay-2026-2027',
        phone: adminPhone || '+91 98111 22334',
        email: adminEmail,
        address: {
          street: 'Plot 14, Institutional Area',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110075',
          country: 'India',
        },
        branding: {
          primaryColor: '#0f766e',
          secondaryColor: '#0f172a',
          accentColor: '#14b8a6',
        },
        settings: {
          minAttendancePercent: 75,
          attendanceAlertThreshold: 75,
          feeLateFinePerDay: 100,
          allowParentLeaveApplication: true,
          enableWhatsAppAlerts: true,
          gradingScale: [
            { grade: 'A1', minScore: 91, maxScore: 100, gpa: 10, remark: 'Outstanding' },
            { grade: 'A2', minScore: 81, maxScore: 90, gpa: 9, remark: 'Excellent' },
            { grade: 'B1', minScore: 71, maxScore: 80, gpa: 8, remark: 'Very Good' },
            { grade: 'B2', minScore: 61, maxScore: 70, gpa: 7, remark: 'Good' },
            { grade: 'C1', minScore: 51, maxScore: 60, gpa: 6, remark: 'Satisfactory' },
            { grade: 'D', minScore: 33, maxScore: 50, gpa: 4, remark: 'Marginal' },
            { grade: 'E', minScore: 0, maxScore: 32, gpa: 0, remark: 'Needs Remedial' },
          ],
        },
      });

      refreshData();
      setIsProvisioning(false);
      setProvisionSuccessMsg(`Campus "${created.name}" provisioned successfully! Switching to your workspace...`);

      setTimeout(() => {
        switchTenant(created.id);
        onGoToDashboard();
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-xs">
            EV
          </div>
          <div>
            <div className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-1.5">
              <span>Eduvanta</span>
              <span className="text-[10px] font-mono text-teal-800 font-bold bg-teal-50 border border-teal-200/60 px-1.5 py-0.2 rounded">
                SaaS v3.0
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              Autonomous School Operating System
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#tour" className="hover:text-teal-800 transition-colors">
            Product Tour
          </a>
          <a href="#roi" className="hover:text-teal-800 transition-colors">
            ROI Calculator
          </a>
          <a href="#pricing" className="hover:text-teal-800 transition-colors">
            Pricing Plans
          </a>
          {onOpenManual && (
            <button
              onClick={onOpenManual}
              className="hover:text-teal-800 transition-colors cursor-pointer"
            >
              System Documentation
            </button>
          )}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onGoToDashboard}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            Sign In to Campus
          </button>
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-8 pt-16 sm:pt-24 pb-16 max-w-6xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-800">
          <span>Enterprise Autonomous School OS</span>
          <span aria-hidden="true">&bull;</span>
          <span>Trusted by 42+ Campus Chains</span>
          <span aria-hidden="true">&bull;</span>
          <span>CBSE, ICSE & IB Compliant</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
          Run Your School. <br className="hidden sm:inline" />
          <span className="text-teal-800 underline decoration-teal-300 decoration-wavy decoration-2">
            Don't Run After the Data.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Eliminate fragmented spreadsheets and clunky software. Eduvanta unifies Student 360,
          Automated Fee Invoicing, Master Timetable, Live Bus GPS, Board Examination Cards, and
          Autonomous Sentinel Agents into one unified multi-tenant platform.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Start 14-Day Free School Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Explore Live Interactive Campus Demo</span>
          </button>
        </div>

        {/* Proof Points Strip (Zero-Pill Unboxed Text) */}
        <div className="pt-10 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3">
            <span className="text-2xl font-black text-slate-950 font-mono">42+</span>
            <span className="text-xs text-slate-500 block mt-0.5">Enrolled Campuses</span>
          </div>
          <div className="p-3">
            <span className="text-2xl font-black text-teal-800 font-mono">99.8%</span>
            <span className="text-xs text-slate-500 block mt-0.5">Board Attendance Compliance</span>
          </div>
          <div className="p-3">
            <span className="text-2xl font-black text-slate-950 font-mono">₹14.8 Cr+</span>
            <span className="text-xs text-slate-500 block mt-0.5">Tuition Fees Disbursed</span>
          </div>
          <div className="p-3">
            <span className="text-2xl font-black text-emerald-700 font-mono">0</span>
            <span className="text-xs text-slate-500 block mt-0.5">Cross-Tenant Data Leaks</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Product Tour */}
      <section id="tour" className="py-16 bg-white border-y border-slate-200 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] uppercase font-bold text-teal-800 tracking-wider">
              Comprehensive Modular Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              One Operating System. Every Operational Department.
            </h2>
            <p className="text-xs text-slate-500">
              Switch through live module snapshots below to explore how Eduvanta transforms day-to-day operations.
            </p>
          </div>

          {/* Interactive Tour Segmented Controls */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100 rounded-xl max-w-3xl mx-auto">
            {[
              { id: 'sis', label: 'Student 360 & SIS', icon: GraduationCap },
              { id: 'timetable', label: 'Master Timetable', icon: Calendar },
              { id: 'fees', label: 'Fees & Instant UPI', icon: DollarSign },
              { id: 'transport', label: 'Live Bus GPS & SOS', icon: Bus },
              { id: 'certificates', label: 'Official TC & Documents', icon: FileCheck2 },
              { id: 'ai', label: 'Autonomous Sentinel', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTourTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTourTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-800' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Snapshot Display Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {activeTourTab === 'sis' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Student 360 & Holistic Directory</h3>
                    <p className="text-xs text-slate-400">
                      Predictive early risk indicators, medical records, and academic trajectory deciles.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-bold">MODULE: SIS-CORE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Early Warning Detection</span>
                    <p className="font-semibold text-white">Automated Statutory Attendance Bar</p>
                    <p className="text-slate-400 text-[11px]">
                      Flags students dipping below 75% before board registration deadlines with suggested remedial plans.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Family & Guardian Graph</span>
                    <p className="font-semibold text-white">Direct WhatsApp Linkage</p>
                    <p className="text-slate-400 text-[11px]">
                      Integrated parent records allowing 1-click dispatch of circulars, fee links, and exam results.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Document Locker</span>
                    <p className="font-semibold text-white">Secure Encrypted Vault</p>
                    <p className="text-slate-400 text-[11px]">
                      Birth certificates, previous transfer certificates, and medical immunization forms.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'timetable' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Master Timetable & Period Conflict Engine</h3>
                    <p className="text-xs text-slate-400">
                      Instant algorithmic conflict detection across educators, lab rooms, and classes.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-bold">MODULE: ACADEMICS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Period Clash Guardian</span>
                    <p className="font-semibold text-white">0% Double Booking</p>
                    <p className="text-slate-400 text-[11px]">
                      Prevents scheduling the same physics lab or teacher into multiple overlapping sections simultaneously.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Faculty Workload Balance</span>
                    <p className="font-semibold text-white">Weekly Cap Monitoring</p>
                    <p className="text-slate-400 text-[11px]">
                      Tracks teaching hours per week to prevent educator burnout and ensure equitable distribution.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Sub-Period Substitution</span>
                    <p className="font-semibold text-white">1-Click Sick Leave Subbing</p>
                    <p className="text-slate-400 text-[11px]">
                      Instantly finds free teachers with matching subject qualifications when a teacher takes casual leave.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'fees' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Fee Management & Instant Online Reconciliation</h3>
                    <p className="text-xs text-slate-400">
                      Multi-installment schedules, UPI auto-links, and official Section 80C tax invoices.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-bold">MODULE: FINANCE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Direct UPI Settlement</span>
                    <p className="font-semibold text-white">Zero Gateway Drop-Off</p>
                    <p className="text-slate-400 text-[11px]">
                      Parents settle tuition instantly via Google Pay, PhonePe, or Cards with immediate automatic receipt delivery.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Statutory 80C Tax Letters</span>
                    <p className="font-semibold text-white">Income Tax Compliant</p>
                    <p className="text-slate-400 text-[11px]">
                      One-click certified tuition fee certificates formatted specifically for parents claiming annual 80C tax rebates.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Automated Dues Recovery</span>
                    <p className="font-semibold text-white">18% Faster Recovery</p>
                    <p className="text-slate-400 text-[11px]">
                      Courteous automated WhatsApp payment links recover past-due fees without awkward physical confrontations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'transport' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Live GPS Telemetry & Emergency SOS Control</h3>
                    <p className="text-xs text-slate-400">
                      Real-time bus tracking along transit corridors, stop countdowns, and safety compliance.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-bold">MODULE: LOGISTICS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Real-Time Telemetry</span>
                    <p className="font-semibold text-white">Speed & Corridor Monitoring</p>
                    <p className="text-slate-400 text-[11px]">
                      Live route progress, next-stop ETA countdowns, and direct driver cabin communication shortcuts.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Administrative SOS Beacon</span>
                    <p className="font-semibold text-white">Instant Distress Broadcast</p>
                    <p className="text-slate-400 text-[11px]">
                      One-click distress trigger broadcasts emergency alerts to school admin and route supervisors immediately.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Regulatory Compliance</span>
                    <p className="font-semibold text-white">Fitness & Insurance Tracking</p>
                    <p className="text-slate-400 text-[11px]">
                      Monitors commercial insurance policies, driver licenses, and government vehicle fitness expirations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'certificates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Official Statutory Documents & Certificates</h3>
                    <p className="text-xs text-slate-400">
                      CBSE/ICSE Transfer Certificates (TC), Bonafide verification, and character certificates.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-bold">MODULE: COMPLIANCE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Statutory Board Format</span>
                    <p className="font-semibold text-white">15 Standard Clauses</p>
                    <p className="text-slate-400 text-[11px]">
                      Generates board-compliant TCs with date of birth in words, promotion status, dues cleared, and conduct.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Parchment Print Engine</span>
                    <p className="font-semibold text-white">Double-Bordered Styling</p>
                    <p className="text-slate-400 text-[11px]">
                      Ornate institutional layout with watermark, affiliation headers, and three-tier signature blocks.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Serial Registry Ledger</span>
                    <p className="font-semibold text-white">Audit Proof Archives</p>
                    <p className="text-slate-400 text-[11px]">
                      Maintains immutable serial numbers (e.g. TC/2026/014) to satisfy government and board inspections.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'ai' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Autonomous AI Sentinel & Approvals Queue</h3>
                    <p className="text-xs text-slate-400">
                      Background intelligence that monitors attendance drops, unpaid dues, and marks regression.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-bold">MODULE: AI-AUTOMATION</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Attendance Sentinel</span>
                    <p className="font-semibold text-white">Statutory Breach Guard</p>
                    <p className="text-slate-400 text-[11px]">
                      Detects downward attendance trends early and automatically stages formal warning letters to parents.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Human-in-the-Loop Safeguard</span>
                    <p className="font-semibold text-white">Zero Autonomous Blunders</p>
                    <p className="text-slate-400 text-[11px]">
                      Every action recommended by AI agents stages into the Pending Approvals Queue for 1-click review.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Academic Remedial Agent</span>
                    <p className="font-semibold text-white">Diagnostic Learning Bridge</p>
                    <p className="text-slate-400 text-[11px]">
                      Analyzes unit test dips and automatically suggests zero-period remedial class enrollments.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Interactive ROI Calculator */}
      <section id="roi" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center space-y-1 max-w-lg mx-auto">
            <span className="text-[11px] uppercase font-bold text-teal-800 tracking-wider">
              Institutional Business Case
            </span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Calculate Your Campus ROI with Eduvanta
            </h2>
            <p className="text-xs text-slate-500">
              Adjust the sliders below to estimate time saved and uncollected fee recoveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Left */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-slate-700">Total Enrolled Students:</span>
                  <span className="font-mono text-teal-800 text-sm font-black">{roiStudentCount.toLocaleString()} Students</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={roiStudentCount}
                  onChange={(e) => setRoiStudentCount(Number(e.target.value))}
                  className="w-full accent-teal-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>200</span>
                  <span>2,500</span>
                  <span>5,000+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-slate-700">Average Annual Tuition Fee per Student:</span>
                  <span className="font-mono text-teal-800 text-sm font-black">₹{roiAnnualFee.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="150000"
                  step="5000"
                  value={roiAnnualFee}
                  onChange={(e) => setRoiAnnualFee(Number(e.target.value))}
                  className="w-full accent-teal-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹20,000</span>
                  <span>₹85,000</span>
                  <span>₹1,50,000</span>
                </div>
              </div>
            </div>

            {/* Calculated Results Right */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Estimated Net Return on Investment
                </span>
                <div className="text-3xl font-black text-teal-900 mt-1 font-mono">
                  {roiMultiplier}x Annual ROI
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Administrative Hours Saved:</span>
                  <span className="font-bold text-slate-900 font-mono">~{calculatedHoursSavedPerMonth} hrs / month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Past-Due Fee Recovery Boost:</span>
                  <span className="font-bold text-emerald-700 font-mono">+₹{calculatedFeeRecoveryBoost} Lakhs / year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Paper & Printing Reduction:</span>
                  <span className="font-bold text-slate-900 font-mono">82% Elimination</span>
                </div>
              </div>

              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="w-full py-2.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Unlock These Savings for Your Campus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SaaS Pricing & Subscription Plans */}
      <section id="pricing" className="py-16 bg-white border-y border-slate-200 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] uppercase font-bold text-teal-800 tracking-wider">
              Transparent Institutional Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Predictable Pricing. Zero Hidden Fees.
            </h2>
            <p className="text-xs text-slate-500">
              All plans include free migration assistance, staff training sessions, and automated data backups.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-6 bg-teal-800 rounded-full p-1 transition-colors cursor-pointer"
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1 ${billingCycle === 'annual' ? 'text-teal-800' : 'text-slate-400'}`}>
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1: Starter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-950">Starter Campus</h3>
                  <p className="text-xs text-slate-500 mt-0.5">For growing primary & middle schools up to 500 students.</p>
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-950 font-mono">
                    ₹{billingCycle === 'annual' ? '7,999' : '9,999'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                  {[
                    'Up to 500 Enrolled Students',
                    'Complete SIS & Student 360',
                    'Daily Attendance & Leaves',
                    'Master Timetable Builder',
                    'Term Examination Marksheets',
                    'Email Support with 24h SLA',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanForSignup('starter');
                  setIsSignupModalOpen(true);
                }}
                className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Choose Starter
              </button>
            </div>

            {/* Plan 2: Growth (Featured) */}
            <div className="bg-slate-900 text-white rounded-2xl border-2 border-teal-600 p-6 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-600 text-slate-950 text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Growth Campus</h3>
                  <p className="text-xs text-slate-300 mt-0.5">For senior secondary schools up to 2,000 students.</p>
                </div>
                <div>
                  <span className="text-3xl font-black text-white font-mono">
                    ₹{billingCycle === 'annual' ? '18,999' : '23,999'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"> / month</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-200">
                  {[
                    'Up to 2,000 Enrolled Students',
                    'Everything in Starter Campus',
                    'Fee Management & Instant UPI Invoices',
                    'Live GPS Bus Telemetry & SOS Alerts',
                    'Library Hub & Accession Catalog',
                    'Statutory Transfer Certificates (TC)',
                    'Autonomous Attendance Sentinel Agent',
                    'Priority 4-hour Support SLA',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanForSignup('pro');
                  setIsSignupModalOpen(true);
                }}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
              >
                Start Free 14-Day Pilot
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-950">Enterprise Trust</h3>
                  <p className="text-xs text-slate-500 mt-0.5">For educational trusts & multi-campus institutional chains.</p>
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-950 font-mono">
                    ₹{billingCycle === 'annual' ? '35,999' : '44,999'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                  {[
                    'Unlimited Students & Staff',
                    'Multi-Branch Tenant Governance',
                    'Custom Board Grading Schemes',
                    'Staff Payroll & Statutory EPF/TDS',
                    'Full Automation Studio (All 3 AI Agents)',
                    'Custom Domain (e.g. portal.dps.edu)',
                    'Dedicated 24/7 Account Executive',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanForSignup('enterprise');
                  setIsSignupModalOpen(true);
                }}
                className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Choose Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Self-Serve Sign-Up Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Provision New School Campus</span>
              </div>
              <button
                onClick={() => setIsSignupModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {provisionSuccessMsg ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Campus Setup In Progress</h3>
                <p className="text-xs text-slate-600">{provisionSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Institution / School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Greenwood International Academy"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      Affiliation Board
                    </label>
                    <select
                      value={schoolBoard}
                      onChange={(e) => setSchoolBoard(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    >
                      <option value="CBSE">CBSE (New Delhi)</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="IB">International Baccalaureate</option>
                      <option value="Cambridge">Cambridge IGCSE</option>
                      <option value="State">State Education Board</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      Estimated Students
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1200"
                      value={studentStrength}
                      onChange={(e) => setStudentStrength(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      Administrator Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. R. K. Sharma"
                      value={adminFullName}
                      onChange={(e) => setAdminFullName(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      Official Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="principal@greenwood.edu"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Selected SaaS Plan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'starter', label: 'Starter' },
                      { id: 'pro', label: 'Growth (Pro)' },
                      { id: 'enterprise', label: 'Enterprise' },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setSelectedPlanForSignup(p.id as any)}
                        className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          selectedPlanForSignup === p.id
                            ? 'bg-teal-50 border-teal-800 text-teal-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSignupModalOpen(false)}
                    className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProvisioning}
                    className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isProvisioning ? 'Provisioning...' : 'Complete Free Onboarding'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-teal-800 text-white flex items-center justify-center font-black text-xs">
              EV
            </div>
            <span className="font-bold text-slate-900">Eduvanta Cloud SaaS</span>
            <span aria-hidden="true">&bull;</span>
            <span>&copy; {new Date().getFullYear()} Eduvanta Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            {onOpenManual && (
              <button onClick={onOpenManual} className="hover:text-teal-800 cursor-pointer">
                User Manual
              </button>
            )}
            <button onClick={onGoToDashboard} className="hover:text-teal-800 cursor-pointer">
              Launch School Workspace
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
