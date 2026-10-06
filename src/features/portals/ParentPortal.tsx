import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Download,
  Clock,
  BookOpen,
  FileText,
  Send,
  Sparkles,
  Phone,
  Mail,
  User,
  ShieldAlert,
  ArrowRight,
  Check,
  X,
  Printer,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Student, Exam, StudentExamMark, StudentLeaveApplication } from '../../types';
import { ReportCardModal } from '../exams/ReportCardModal';

export const ParentPortal: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'fees' | 'academics' | 'homework'>('overview');

  // Selected Student (Parents may have multiple children enrolled)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Fee Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(15000);
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Leave Application State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveType, setLeaveType] = useState<'sick' | 'family' | 'medical' | 'other'>('sick');
  const [leaveSuccessMsg, setLeaveSuccessMsg] = useState<string | null>(null);

  // Report Card Modal State
  const [reportCardExam, setReportCardExam] = useState<Exam | null>(null);

  if (!currentTenant) return null;

  const students = repo.getStudents(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);
  const exams = repo.getExams(currentTenant.id);

  // Pick student associated with parent or default to first student (e.g. Aarav Sharma)
  const currentStudent =
    students.find((s) => s.id === selectedStudentId) ||
    students.find((s) => s.firstName.toLowerCase().includes('aarav')) ||
    students[0];

  const studentClass = classes.find((c) => c.id === currentStudent?.classId);
  const studentSection = sections.find((s) => s.id === currentStudent?.sectionId);

  // Retrieve attendance records & leaves
  const allLeaves = repo.getStudentLeaveApplications(currentTenant.id);
  const leaves = allLeaves.filter((l) => l.studentId === currentStudent?.id);

  // Format Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currentTenant.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !leaveStartDate || !leaveEndDate || !leaveReason) return;

    repo.createStudentLeaveApplication(
      currentTenant.id,
      {
        studentId: currentStudent.id,
        applicantName: currentStudent.parentGuardian.fatherName || 'Parent Guardian',
        applicantRole: 'parent',
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        leaveType,
        reason: leaveReason,
      }
    );

    setIsLeaveModalOpen(false);
    setLeaveReason('');
    setLeaveStartDate('');
    setLeaveEndDate('');
    setLeaveSuccessMsg('Leave request submitted to the Class Teacher for approval.');
    setTimeout(() => setLeaveSuccessMsg(null), 5000);
  };

  const handleSimulatePayment = () => {
    if (!currentStudent) return;
    // Reduce student fee balance in storage
    const newBal = Math.max(0, currentStudent.feeBalance - payAmount);
    repo.updateStudent(
      currentTenant.id,
      currentStudent.id,
      {
        feeBalance: newBal,
      },
      currentUser || undefined
    );

    setIsPayModalOpen(false);
    setPaymentSuccessMsg(`Payment of ${formatCurrency(payAmount)} processed successfully! Receipt #RCP-2026-8812.`);
    setTimeout(() => setPaymentSuccessMsg(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Student Switcher */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-teal-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-xl text-teal-300 shadow-inner">
              {currentStudent?.firstName[0]}
              {currentStudent?.lastName[0]}
            </div>
            <div>
              <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parent & Student Portal</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {currentStudent?.firstName} {currentStudent?.lastName}
              </h1>
              <p className="text-xs text-teal-100/80 mt-1 flex items-center gap-2">
                <span>{studentClass?.name} - {studentSection?.name}</span>
                <span>&bull;</span>
                <span>Roll No: {currentStudent?.rollNo}</span>
                <span>&bull;</span>
                <span>Adm No: {currentStudent?.admissionNo}</span>
              </p>
            </div>
          </div>

          {/* Child Switcher for multi-kid families */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-teal-200 hidden sm:inline">Active Child:</span>
            <select
              value={currentStudent?.id}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold rounded-lg px-3 py-2 focus:outline-hidden"
            >
              {students.slice(0, 4).map((st) => (
                <option key={st.id} value={st.id} className="text-slate-900 font-medium">
                  {st.firstName} {st.lastName} ({classes.find((c) => c.id === st.classId)?.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Success Notification Banners */}
      {paymentSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {leaveSuccessMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{leaveSuccessMsg}</span>
        </div>
      )}

      {/* Core KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attendance Rate</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {currentStudent?.attendancePercentage}%
            </div>
            <span
              className={`text-[11px] font-bold block mt-1 ${
                (currentStudent?.attendancePercentage || 0) < 75 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {(currentStudent?.attendancePercentage || 0) < 75
                ? '⚠️ Below 75% Statutory Board Minimum'
                : '✓ Statutory Criteria Met'}
            </span>
          </div>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="mt-3 text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Apply for Student Leave</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Term Fee Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tuition Balance</span>
              <CreditCard className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(currentStudent?.feeBalance || 0)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              {(currentStudent?.feeBalance || 0) > 0 ? 'Term 2 fees past due' : 'All school dues cleared'}
            </span>
          </div>
          {(currentStudent?.feeBalance || 0) > 0 ? (
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="mt-3 px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <span>Pay Fees Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="mt-3 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>No Pending Dues</span>
            </span>
          )}
        </div>

        {/* Academic Standing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Academic Average</span>
              <GraduationCap className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {currentStudent?.academicAverage}%
            </div>
            <span className="text-[11px] text-teal-800 font-bold block mt-1">Grade: A2 &bull; Passed Term 1</span>
          </div>
          <button
            onClick={() => {
              if (exams.length > 0) setReportCardExam(exams[0]);
            }}
            className="mt-3 text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View Board Report Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Class Teacher */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Class Teacher</span>
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">Dr. Sunita Rao</div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Senior PGT &bull; Mathematics</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-teal-800 font-medium">
            <Phone className="w-3.5 h-3.5" />
            <span>School Ext: 204</span>
          </div>
        </div>
      </div>

      {/* Portal Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Today & Homework</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'attendance'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Attendance & Leave Requests</span>
        </button>

        <button
          onClick={() => setActiveTab('academics')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'academics'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Examinations & Term Marks</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'fees'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fee Ledger & Receipts</span>
        </button>
      </div>

      {/* Tab 1: Overview & Homework */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule (Monday)</h3>
                <p className="text-xs text-slate-500">Periods and classroom timetable for Grade 10-A</p>
              </div>
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg">
                Currently: Period 3
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { period: 'Period 1 (8:30 - 9:15 AM)', subject: 'Mathematics', teacher: 'Dr. Sunita Rao', room: 'Room 204' },
                { period: 'Period 2 (9:15 - 10:00 AM)', subject: 'Physics & Lab', teacher: 'Dr. Rajesh Sharma', room: 'Physics Lab 1' },
                { period: 'Period 3 (10:15 - 11:00 AM)', subject: 'English Literature', teacher: 'Mrs. Neha Gupta', room: 'Room 204' },
                { period: 'Period 4 (11:00 - 11:45 AM)', subject: 'Chemistry', teacher: 'Mr. Arvind Saxena', room: 'Chem Lab' },
                { period: 'Period 5 (12:30 - 1:15 PM)', subject: 'Computer Science', teacher: 'Mrs. Priya Nair', room: 'Computer Lab 2' },
                { period: 'Period 6 (1:15 - 2:00 PM)', subject: 'Physical Education', teacher: 'Coach R. Singh', room: 'Main Sports Ground' },
              ].map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-teal-800 text-white font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{slot.subject}</span>
                      <span className="text-[11px] text-slate-500">{slot.teacher} &bull; {slot.room}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{slot.period.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Homework & Deadlines */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Homework & Assignments</h3>
            <div className="space-y-3">
              {[
                { subject: 'Mathematics', title: 'Exercise 4.2 Quadratic Equations', due: 'Tomorrow, 8:30 AM', status: 'pending' },
                { subject: 'English', title: 'Essay: The Merchant of Venice Act III', due: 'Wednesday, 10:00 AM', status: 'submitted' },
                { subject: 'Physics', title: 'Ohm’s Law Lab Report & Graph', due: 'Thursday, 9:00 AM', status: 'pending' },
              ].map((hw, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-teal-800">{hw.subject}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        hw.status === 'submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hw.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{hw.title}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Due: {hw.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance & Leave Requests */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Attendance Record</h3>
              <p className="text-xs text-slate-500">
                Official statutory register synchronized daily at 8:45 AM after morning roll call.
              </p>
            </div>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>+ Apply for Student Leave</span>
            </button>
          </div>

          {/* Past Leave Requests */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
              Submitted Leave Applications
            </div>
            <div className="p-4 space-y-3">
              {leaves.length > 0 ? (
                leaves.map((lv: StudentLeaveApplication) => (
                  <div key={lv.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block capitalize">{lv.leaveType} Leave</span>
                      <p className="text-[11px] text-slate-500">
                        {lv.startDate} to {lv.endDate} &bull; Reason: {lv.reason}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lv.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lv.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lv.status.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  No active leave requests. Click "+ Apply for Student Leave" to submit.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Examinations & Term Marks */}
      {activeTab === 'academics' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Term Examinations & Official Marks</h3>
              <p className="text-xs text-slate-500">Board-compliant marksheet with teacher diagnostic remarks.</p>
            </div>
            {exams.length > 0 && (
              <button
                onClick={() => setReportCardExam(exams[0])}
                className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Report Card</span>
              </button>
            )}
          </div>

          {/* Marks Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Max Marks</th>
                  <th className="py-3 px-4">Marks Obtained</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { sub: 'English Literature', max: 100, obt: 91, grade: 'A1', remark: 'Excellent critical essays and textual analysis' },
                  { sub: 'Mathematics', max: 100, obt: 72, grade: 'B1', remark: 'Good analytical skills; needs extra practice in Coordinate Geometry' },
                  { sub: 'Physics', max: 100, obt: 84, grade: 'A2', remark: 'Diligent experimental work in laboratory sessions' },
                  { sub: 'Chemistry', max: 100, obt: 80, grade: 'A2', remark: 'Consistent performance in organic reactions' },
                  { sub: 'Computer Science', max: 100, obt: 88, grade: 'A1', remark: 'Proficient in Python logic and data structures' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.sub}</td>
                    <td className="py-3 px-4">{row.max}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.obt}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{row.obt}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-50 text-teal-800">
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 italic text-[11px]">{row.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Fee Ledger & Online Pay */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fee Accounts & Transaction History</h3>
              <p className="text-xs text-slate-500">Official tuition invoice receipts with GST breakdown.</p>
            </div>
            {(currentStudent?.feeBalance || 0) > 0 && (
              <button
                onClick={() => setIsPayModalOpen(true)}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Outstanding Balance ({formatCurrency(currentStudent?.feeBalance || 0)})</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Receipt / Invoice #</th>
                  <th className="py-3 px-4">Fee Description</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">INV-2026-T2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Quarterly Tuition & Laboratory Fee (Term 2)</td>
                  <td className="py-3 px-4 text-rose-600 font-semibold">10 Oct 2026</td>
                  <td className="py-3 px-4 font-bold text-slate-900">₹15,000</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      PAST DUE
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setIsPayModalOpen(true)}
                      className="px-2.5 py-1 bg-teal-800 text-white rounded text-[11px] font-bold hover:bg-teal-700"
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">RCP-2026-T1</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Quarterly Tuition Fee (Term 1)</td>
                  <td className="py-3 px-4 text-slate-500">15 Jul 2026</td>
                  <td className="py-3 px-4 font-bold text-slate-900">₹15,000</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      PAID
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-teal-800 font-bold hover:underline text-[11px]">Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Online Fee Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">SchoolOS Instant Payment Gateway</span>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                <div className="flex justify-between font-bold text-xs text-slate-900">
                  <span>Student: {currentStudent?.firstName} {currentStudent?.lastName}</span>
                  <span className="text-teal-800">{studentClass?.name}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Invoice: INV-2026-T2 (Term 2 Tuition)</span>
                  <span>Amount: ₹15,000</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'card', label: 'Credit/Debit' },
                    { id: 'netbanking', label: 'NetBanking' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id as any)}
                      className={`p-2 rounded-lg border text-center font-semibold text-xs transition-colors ${
                        payMethod === m.id
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {payMethod === 'upi' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-2">
                  <div className="w-28 h-28 mx-auto bg-white border border-slate-300 rounded-lg flex items-center justify-center font-mono text-[10px] text-slate-400 shadow-inner">
                    [QR CODE: UPI-DPS]
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">UPI ID: fee.dps@icici</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Authorize ₹15,000 Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Submit Student Leave Request</span>
              </div>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Reason Category
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="sick">Medical / Illness</option>
                  <option value="family">Family Function / Event</option>
                  <option value="other">Other Unavoidable Absence</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Specific Reason & Explanation *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail reason for absence to be forwarded to class teacher..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Teacher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Official Report Card Modal */}
      {reportCardExam && currentStudent && (
        <ReportCardModal
          student={currentStudent}
          exam={reportCardExam}
          marks={repo.getExamMarks(currentTenant.id, reportCardExam.id).filter((m) => m.studentId === currentStudent.id)}
          onClose={() => setReportCardExam(null)}
        />
      )}
    </div>
  );
};
