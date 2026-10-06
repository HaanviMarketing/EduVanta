import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Home,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Shield,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Student, ClassRoom, Section } from '../../types';

interface StudentDetailModalProps {
  student: Student | null;
  classes: ClassRoom[];
  sections: Section[];
  onClose: () => void;
  onUpdateStatus?: (studentId: string, status: Student['riskStatus']) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  classes,
  sections,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'success' | 'overview' | 'attendance' | 'academics' | 'fees'>('success');

  if (!student) return null;

  const currentClass = classes.find((c) => c.id === student.classId);
  const currentSection = sections.find((s) => s.id === student.sectionId);

  const getRiskBadge = (risk: Student['riskStatus']) => {
    switch (risk) {
      case 'needs_attention':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Needs Attention
          </span>
        );
      case 'monitor':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Monitor
          </span>
        );
      case 'improving':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Improving
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            Stable
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={student.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={student.firstName}
              className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold tracking-tight">
                  {student.firstName} {student.lastName}
                </h2>
                {getRiskBadge(student.riskStatus)}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-medium">
                <span>Adm No: <strong className="text-white font-mono">{student.admissionNo}</strong></span>
                <span>·</span>
                <span>Roll: <strong className="text-white font-mono">{student.rollNo}</strong></span>
                <span>·</span>
                <span>Class: <strong className="text-white">{currentClass?.name} - {currentSection?.name}</strong></span>
                {student.house && (
                  <>
                    <span>·</span>
                    <span className="text-teal-300">{student.house}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-semibold bg-slate-50">
          <button
            onClick={() => setActiveTab('success')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'success'
                ? 'border-teal-700 text-teal-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Success Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Parents
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'attendance'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Attendance ({student.attendancePercentage}%)
          </button>
          <button
            onClick={() => setActiveTab('academics')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'academics'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Academics ({student.academicAverage}%)
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'fees'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fee Ledger ({student.feeBalance > 0 ? `₹${student.feeBalance} Due` : 'Paid'})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
          {/* Tab 1: Student Success Engine */}
          {activeTab === 'success' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-teal-950 text-sm">
                    <Shield className="w-4 h-4 text-teal-700" />
                    <span>Explainable Student Success Indicator</span>
                  </div>
                  {getRiskBadge(student.riskStatus)}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  SchoolOS evaluates operational trends across attendance, subject assessments, and engagement without permanent categorization.
                </p>
              </div>

              {/* Reasons */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Detected Observations & Operational Factors:
                </h4>
                <ul className="space-y-2 text-slate-700">
                  {student.riskReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/70">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Action Recommendations:
                </h4>
                <div className="space-y-2">
                  {student.recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{action}</span>
                      </div>
                      <button className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-semibold text-[11px] transition-colors">
                        Execute
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Overview & Parents */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
                  Personal Details
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Gender</span>
                    <span className="capitalize font-medium">{student.gender}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Date of Birth</span>
                    <span className="font-medium">{student.dob}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Blood Group</span>
                    <span className="font-medium">{student.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">National ID / Aadhaar</span>
                    <span className="font-mono">{student.governmentId || 'Not registered'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Admission Date</span>
                    <span className="font-medium">{student.admissionDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Previous School</span>
                    <span>{student.previousSchool || 'Direct Entry'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
                  Parent & Guardian Information
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                    <div className="font-semibold text-slate-900">
                      {student.parentGuardian.fatherName} (Father)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.parentGuardian.fatherPhone}</span>
                    </div>
                    {student.parentGuardian.fatherEmail && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.parentGuardian.fatherEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                    <div className="font-semibold text-slate-900">
                      {student.parentGuardian.motherName} (Mother)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.parentGuardian.motherPhone}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                    <div className="font-semibold text-rose-900">Emergency Contact</div>
                    <div className="flex items-center gap-1.5 text-rose-700">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{student.parentGuardian.emergencyContactPhone}</span>
                    </div>
                  </div>

                  <div className="text-slate-600">
                    <span className="text-slate-400 block mb-0.5">Residence:</span>
                    <span>{student.parentGuardian.residentialAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Attendance */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">Cumulative Attendance Rate</div>
                  <div className="text-slate-500">Board Exam Minimum Statutory Threshold: 75%</div>
                </div>
                <div className="text-2xl font-mono font-bold text-teal-800">
                  {student.attendancePercentage}%
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    student.attendancePercentage >= 75 ? 'bg-teal-600' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, student.attendancePercentage)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-400 text-[11px]">Total Working Days</div>
                  <div className="text-base font-bold text-slate-800 mt-1">114</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-400 text-[11px]">Days Present</div>
                  <div className="text-base font-bold text-teal-700 mt-1">
                    {Math.round((student.attendancePercentage / 100) * 114)}
                  </div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-400 text-[11px]">Days Absent / Leave</div>
                  <div className="text-base font-bold text-rose-600 mt-1">
                    {114 - Math.round((student.attendancePercentage / 100) * 114)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Academics */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">Term 1 Assessment Aggregate</div>
                  <div className="text-slate-500">Continuous Comprehensive Evaluation (CCE)</div>
                </div>
                <div className="text-2xl font-mono font-bold text-teal-800">
                  {student.academicAverage}%
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">Max Marks</th>
                      <th className="p-2.5">Scored</th>
                      <th className="p-2.5">Grade</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-medium">Mathematics</td>
                      <td className="p-2.5 font-mono">100</td>
                      <td className="p-2.5 font-mono font-semibold">{Math.round(student.academicAverage * 0.95)}</td>
                      <td className="p-2.5 font-bold text-teal-800">A2</td>
                      <td className="p-2.5 text-emerald-600">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Science & Lab</td>
                      <td className="p-2.5 font-mono">100</td>
                      <td className="p-2.5 font-mono font-semibold">{Math.round(student.academicAverage * 0.9)}</td>
                      <td className="p-2.5 font-bold text-teal-800">B1</td>
                      <td className="p-2.5 text-emerald-600">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">English Literature</td>
                      <td className="p-2.5 font-mono">100</td>
                      <td className="p-2.5 font-mono font-semibold">{Math.round(student.academicAverage * 1.05)}</td>
                      <td className="p-2.5 font-bold text-teal-800">A1</td>
                      <td className="p-2.5 text-emerald-600">Pass</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Fee Ledger */}
          {activeTab === 'fees' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">Total Outstanding Balance</div>
                  <div className="text-slate-500">Annual Tuition & Transport Billing</div>
                </div>
                <div className={`text-2xl font-mono font-bold ${student.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ₹{student.feeBalance.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-white">
                  <div>
                    <div className="font-semibold text-slate-800">Term 1 Tuition Fee</div>
                    <div className="text-slate-400 text-[11px]">Due: 15 Apr 2026</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
                    Paid · ₹35,000
                  </span>
                </div>

                <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-white">
                  <div>
                    <div className="font-semibold text-slate-800">Term 2 Tuition Fee</div>
                    <div className="text-slate-400 text-[11px]">Due: 15 Sep 2026</div>
                  </div>
                  {student.feeBalance > 0 ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-semibold rounded text-[11px]">
                      Overdue · ₹{student.feeBalance.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
                      Paid · ₹35,000
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Student ID: {student.id}</span>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Student 360</span>
          </button>
        </div>
      </div>
    </div>
  );
};
