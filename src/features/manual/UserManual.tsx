import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Printer,
  Shield,
  Users,
  GraduationCap,
  DollarSign,
  Bus,
  FileCheck2,
  Bell,
  Zap,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Laptop,
  HelpCircle,
  Sparkles,
  Award,
  Calendar,
  Layers,
  Download,
  FileDown,
} from 'lucide-react';

interface ManualSection {
  id: string;
  title: string;
  category: 'getting_started' | 'roles' | 'modules' | 'automation' | 'faq';
  icon: any;
  summary: string;
  content: React.ReactNode;
}

export const UserManual: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const sections: ManualSection[] = [
    {
      id: 'intro',
      title: '1. Platform Overview & Architecture',
      category: 'getting_started',
      icon: Layers,
      summary: 'Learn about Eduvanta multi-tenant design, security isolation, and core concepts.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <p>
            <strong>Eduvanta</strong> is an enterprise-grade, AI-native School Operating System designed to unify Student Information Systems (SIS), Enterprise Resource Planning (ERP), Academics, Fee Management, Transport, Library, and Autonomous Automation into a single multi-tenant platform.
          </p>
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
            <h4 className="font-bold text-teal-950 text-sm">Key Architectural Pillars:</h4>
            <ul className="list-disc list-inside space-y-1 text-teal-900">
              <li><strong>Multi-School Isolation:</strong> Each school branch operates in its own sandboxed data perimeter with custom currencies (₹ INR, $ USD, AED), board standards (CBSE, ICSE, IB, State), and grading scales.</li>
              <li><strong>Zero Mock Workflows:</strong> All operational modules—from fees to timetable to GPS tracking—are fully connected to live relational records.</li>
              <li><strong>Role-Based Access Control (RBAC):</strong> Eight discrete persona levels ensuring strict data privacy and administrative delegation.</li>
            </ul>
          </div>
          <p>
            Administrators and staff can navigate anywhere in the platform in less than 2 keystrokes using the global <strong>Command Palette (⌘K or Ctrl+K)</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'roles',
      title: '2. Role-Based Workflows & Personas',
      category: 'roles',
      icon: Users,
      summary: 'Standard operating procedures for Principals, Teachers, Accountants, Parents, and Admins.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <p>
            Eduvanta adapts its interface dynamically according to the logged-in user role. You can test each persona anytime using the <strong>Role Switcher</strong> in the top navigation bar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">🏫 Principal & Vice Principal</span>
              <p className="text-slate-600">Review School Pulse alerts, approve statutory attendance warnings, publish official circulars, and inspect teacher remarks.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">👩‍🏫 Teaching Faculty</span>
              <p className="text-slate-600">Access the Teacher Workspace for 1-click morning attendance, timetable period tracking, exam mark entry, and homework assignments.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">💳 Accountant & Bursar</span>
              <p className="text-slate-600">Track quarterly fee collections, process online UPI/card payments, generate tuition tax receipts (80C), and disburse staff salaries.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">👨‍👩‍👧 Parents & Students</span>
              <p className="text-slate-600">Dedicated Parent Portal with child switcher, real-time biometric attendance tracker, instant online fee settlement, and leave requests.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'students_sis',
      title: '3. Student 360 & SIS Directory',
      category: 'modules',
      icon: GraduationCap,
      summary: 'Manage student enrollments, academic health, risk factors, and biometric history.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <p>
            The <strong>Student Directory</strong> acts as the central single source of truth for every learner enrolled in your institution:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Student 360 Modal:</strong> Click any student row to view their holistic profile, contact details, parent guardians, historical grades, risk indicators, and uploaded documents.</li>
            <li><strong>Early Warning Risk Engine:</strong> Automatically flags students whose attendance falls below statutory thresholds (&lt; 75%) or whose marks regress by &gt; 10%.</li>
            <li><strong>Instant WhatsApp Communication:</strong> 1-click shortcut to dispatch attendance reminders, fee notices, or academic commendations to parents.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'fees_payroll',
      title: '4. Fee Management & Staff Payroll',
      category: 'modules',
      icon: DollarSign,
      summary: 'Manage fee structures, collection installments, staff compensation, EPF, and tax receipts.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <h4 className="font-bold text-slate-900 text-sm">Fee Management Module:</h4>
          <p>
            Configure annual or multi-installment fee plans (Term 1, Term 2, Lab, Transport). Parents can pay instantly online via simulated UPI/Card gateway, generating an instant printable tax invoice.
          </p>
          <h4 className="font-bold text-slate-900 text-sm mt-3">Staff Payroll & Compensation:</h4>
          <p>
            Automated statutory salary processing incorporating:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li><strong>Allowances:</strong> Basic Pay + House Rent Allowance (HRA at 30%) + Dearness Allowance (DA at 15%) + Special Allowances.</li>
            <li><strong>Statutory Deductions:</strong> Employee Provident Fund (EPF at 12%), Tax Deducted at Source (TDS), and Professional Tax.</li>
            <li><strong>Printable Payslips:</strong> 1-click printable salary payslips formatted to official standards with finance seals.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'transport_fleet',
      title: '5. Transport & Fleet Management',
      category: 'modules',
      icon: Bus,
      summary: 'Real-time GPS bus tracking, transit routes, driver rosters, and emergency SOS alerts.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <p>
            Keep parents and school administrators informed regarding transit safety:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Live GPS Telemetry:</strong> Simulated real-time bus tracking along designated transit corridors with speed monitoring and next-stop countdowns.</li>
            <li><strong>Driver SOS Broadcast:</strong> Emergency broadcast trigger that alerts the school administrative command room immediately in case of breakdowns or distress.</li>
            <li><strong>Compliance Roster:</strong> Track driver licensing, conductor contacts, government vehicle fitness certificate validity, and commercial insurance expiries.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'certificates',
      title: '6. Official Documents & Certificates',
      category: 'modules',
      icon: FileCheck2,
      summary: 'Generate board-compliant Transfer Certificates (TC), Bonafide, Character, and 80C letters.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <p>
            Schools must legally provide certified official records upon pupil withdrawal or parent request:
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong>Transfer Certificate (TC / SLC):</strong> Conforms strictly to CBSE & ICSE statutory requirements featuring 15 standard clauses including date of birth in words, promotion status, dues cleared, and conduct.
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong>Bonafide Student Certificate:</strong> Certified regular enrollment letter for passport, visa, and scholarship applications.
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong>Section 80C Fee Certificate:</strong> Official annual tuition fee receipt for parent Income Tax exemption rebate.
            </div>
          </div>
          <p className="text-slate-500 italic">
            All certificates feature ornate double-bordered parchment formatting ready for direct physical printing with school seals.
          </p>
        </div>
      ),
    },
    {
      id: 'automation',
      title: '7. AI Autonomous Agents & Copilot',
      category: 'automation',
      icon: Zap,
      summary: 'Understand the Sentinel Agent, Fee Recovery Agent, Remedial Agent, and Approvals Queue.',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <p>
            Unlike passive software, Eduvanta continuously audits your institutional operations in the background:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Attendance Sentinel Agent:</strong> Identifies attendance regressions before they breach statutory board thresholds (&lt; 75%) and drafts formal notices.</li>
            <li><strong>Fee Recovery Agent:</strong> Tracks overdue fee balances past 15 days and stages courteous recovery reminders with direct payment links.</li>
            <li><strong>Academic Intervention Agent:</strong> Detects unit-test dips (&gt; 10%) and recommends zero-period remedial class assignments.</li>
            <li><strong>Human-in-the-Loop Safeguard:</strong> Autonomous agents never act without administrative authority. All proposed actions stage into the <em>Pending Approvals Queue</em> for 1-click approval or rejection.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'shortcuts',
      title: '8. Keyboard Shortcuts & Productivity',
      category: 'faq',
      icon: Laptop,
      summary: 'Speed navigation shortcuts and productivity hotkeys.',
      content: (
        <div className="space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span>Open Global Command Palette</span>
              <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[10px] font-bold shadow-2xs">
                ⌘ + K / Ctrl + K
              </kbd>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span>Dismiss Modals / Overlays</span>
              <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[10px] font-bold shadow-2xs">
                ESC
              </kbd>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span>Print Active Certificate / Payslip</span>
              <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[10px] font-bold shadow-2xs">
                ⌘ + P / Ctrl + P
              </kbd>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span>Switch Active School or Persona</span>
              <span className="font-semibold text-teal-800">Top Navigation Bar</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  // Export to PDF: Triggers the browser's PDF export dialog formatted for documentation
  const handleExportToPdf = () => {
    setExportFeedback('Opening PDF Export Dialog... Select "Save as PDF" as the destination printer.');
    setTimeout(() => {
      window.print();
      setTimeout(() => setExportFeedback(null), 5000);
    }, 200);
  };

  // Download Standalone Offline HTML/PDF Document
  const handleDownloadStandaloneHandbook = () => {
    const handbookHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Eduvanta — Official Administrator & User Manual (2026-2027)</title>
  <style>
    @page { margin: 20mm; size: A4; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 30px auto; padding: 0 20px; }
    .header { text-align: center; border-bottom: 3px solid #0f766e; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { font-size: 26px; color: #0f766e; margin: 0 0 8px 0; }
    .header p { color: #64748b; margin: 4px 0; font-size: 14px; }
    .badge { display: inline-block; background: #ccfbf1; color: #115e59; font-weight: bold; padding: 3px 8px; border-radius: 4px; font-size: 11px; margin-bottom: 8px; }
    .chapter { page-break-after: always; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
    .chapter:last-child { page-break-after: auto; }
    h2 { color: #0f172a; font-size: 18px; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
    p, li { font-size: 13px; color: #334155; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin: 12px 0; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">OFFICIAL SYSTEM DOCUMENTATION</div>
    <h1>Eduvanta — AI-Native School Operating System</h1>
    <p>Comprehensive Administrator Guide, Operational Workflows, and User Manual</p>
    <p><strong>Academic Year:</strong> 2026-2027 &bull; <strong>Platform Version:</strong> 3.0 Enterprise SaaS</p>
  </div>

  <div class="chapter">
    <h2>Chapter 1: Platform Overview & Architecture</h2>
    <p><strong>Eduvanta</strong> is an enterprise-grade School Operating System combining Student Information Systems (SIS), Enterprise Resource Planning (ERP), Academics, Fee Management, Transport GPS, Library, and Autonomous Automation into one intelligent multi-tenant platform.</p>
    <div class="box">
      <strong>Core Architectural Pillars:</strong>
      <ul>
        <li><strong>Multi-School Isolation:</strong> Dedicated schemas and parameters per tenant school.</li>
        <li><strong>Zero Mock Workflows:</strong> All data seamlessly connects across fees, exams, roll calls, and bus telemetry.</li>
        <li><strong>Role-Based Access Control:</strong> 8 discrete persona access levels from Super Admin to Parents.</li>
      </ul>
    </div>
  </div>

  <div class="chapter">
    <h2>Chapter 2: Access Control & Persona Workflows</h2>
    <table>
      <thead>
        <tr><th>Role Persona</th><th>Key Responsibilities</th><th>Primary Modules</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Super Admin</strong></td><td>Multi-school SaaS management, school onboarding, MRR/ARR billing</td><td>Super Admin SaaS Portal, Onboarding Wizard</td></tr>
        <tr><td><strong>Principal / Owner</strong></td><td>Institutional governance, statutory compliance audit, risk oversight</td><td>Executive Dashboard, School Pulse, Circulars</td></tr>
        <tr><td><strong>Teaching Faculty</strong></td><td>Daily roll call, curriculum timetable, exam marks, homework assigner</td><td>Teacher Workspace, Timetable, Exams</td></tr>
        <tr><td><strong>Accountant / Bursar</strong></td><td>Fee collections, concessions, tax invoices, staff payroll</td><td>Fee Management, Staff Payroll</td></tr>
        <tr><td><strong>Parent / Student</strong></td><td>Child progress, live attendance, fee settlement, leave requests</td><td>Dedicated Parent & Student Portal</td></tr>
      </tbody>
    </table>
  </div>

  <div class="chapter">
    <h2>Chapter 3: Core ERP & Academic Operations</h2>
    <p><strong>Student 360:</strong> Unified ledger of student demographics, academic decile curves, attendance percentages, and medical/document archives.</p>
    <p><strong>Timetable Builder:</strong> Period conflict detection preventing dual booking of teachers or classrooms.</p>
    <p><strong>Examinations & Reports:</strong> Board-compliant report cards with automated letter grades, GPA, and AI teacher remarks.</p>
  </div>

  <div class="chapter">
    <h2>Chapter 4: Financial Operations & Campus Logistics</h2>
    <p><strong>Fee Management:</strong> Term-wise installment schedules, payment gateways (UPI, Cards), and official receipts.</p>
    <p><strong>Staff Payroll:</strong> Automated statutory calculations (Basic, HRA 30%, DA 15%, EPF 12%, TDS) with official printable payslips.</p>
    <p><strong>Transport & Fleet:</strong> Live GPS bus telemetry corridor, driver SOS broadcast alerts, and regulatory fitness certificate tracking.</p>
    <p><strong>Library Hub:</strong> Accession register, rack/shelf inventory, and 14-day circulation loans with automatic late fines.</p>
  </div>

  <div class="chapter">
    <h2>Chapter 5: Statutory Compliance & Official Documents</h2>
    <p><strong>Transfer Certificate (TC / SLC):</strong> 15-clause CBSE/ICSE board standard format with date of birth in words, promotion status, and dues cleared.</p>
    <p><strong>Bonafide Certificate:</strong> Verified enrollment documentation for Passports, Visas, and Olympiads.</p>
    <p><strong>Section 80C Fee Letter:</strong> Annual tuition fee certification for parent Income Tax deductions.</p>
  </div>

  <div class="chapter">
    <h2>Chapter 6: AI Autonomous Agents & Copilot</h2>
    <p><strong>Attendance Sentinel Agent:</strong> Audits roll calls, predicts statutory breaches (&lt;75%), and drafts parent letters.</p>
    <p><strong>Fee Recovery Agent:</strong> Identifies invoices overdue &gt;15 days and drafts recovery notifications.</p>
    <p><strong>Academic Intervention Agent:</strong> Flags &gt;10% test score regressions and recommends zero-period remedial classes.</p>
    <p><strong>Human-in-the-Loop:</strong> All agent actions require administrator approval in the Pending Approvals Queue.</p>
  </div>

  <div style="text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8;">
    &copy; 2026 Eduvanta Inc. All rights reserved. Generated directly from the Eduvanta Cloud Environment.
  </div>
</body>
</html>`;

    const blob = new Blob([handbookHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Eduvanta_User_Manual_2026.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportFeedback('Exported offline Eduvanta Handbook! Open the downloaded file and choose "Print to PDF" for instant physical or digital PDF distribution.');
    setTimeout(() => setExportFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Eduvanta User Manual & System Guide</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official operational documentation, role-based workflows, module walkthroughs, and keyboard shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadStandaloneHandbook}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Download offline handbook HTML file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Offline Guide</span>
          </button>

          <button
            onClick={handleExportToPdf}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Export complete documentation as PDF"
          >
            <FileDown className="w-4 h-4" />
            <span>Export to PDF</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Banner */}
      {exportFeedback && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in print:hidden">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* Screen Interactive View (Hidden during Print) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        {/* Left: Navigation Menu */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search guide chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection.id === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex items-start gap-3 ${
                    isActive
                      ? 'bg-teal-50 border border-teal-200 text-teal-950 font-bold shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-teal-800' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{section.title}</div>
                    <div className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                      {section.summary}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Section Content Card */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              Chapter {activeSection.title.split('.')[0]}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">{activeSection.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{activeSection.summary}</p>
          </div>

          {activeSection.content}

          {/* Quick Help Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Need live assistance? Open the <strong>AI Copilot</strong> anytime.</span>
            </div>
            <button
              onClick={() => {
                const nextIdx = (sections.findIndex((s) => s.id === activeSection.id) + 1) % sections.length;
                setActiveSectionId(sections[nextIdx].id);
              }}
              className="text-teal-800 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Next Topic</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Print / PDF Document Layout: Renders all chapters sequentially when exporting to PDF */}
      <div className="hidden print:block space-y-8 p-4 bg-white text-slate-900">
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
          <div className="text-xs uppercase font-bold text-slate-500 tracking-widest">
            OFFICIAL SYSTEM MANUAL
          </div>
          <h1 className="text-3xl font-black text-slate-950 mt-1">
            Eduvanta — AI-Native School Operating System
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete Institutional Operations Handbook &bull; Version 3.0 &bull; Academic Year 2026-2027
          </p>
        </div>

        {sections.map((section, idx) => (
          <div key={section.id} className="pb-8 border-b border-slate-200 page-break-after-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {section.title}
            </h2>
            <p className="text-xs text-slate-500 mb-4">{section.summary}</p>
            <div className="text-xs leading-relaxed">{section.content}</div>
          </div>
        ))}

        <div className="text-center pt-8 text-[11px] text-slate-400">
          Generated from Eduvanta Cloud SaaS &bull; Official Documentation &bull; Page 1 of 8
        </div>
      </div>
    </div>
  );
};

