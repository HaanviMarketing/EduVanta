import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Send,
  Plus,
  AlertTriangle,
  Sparkles,
  Check,
  X,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Student, AttendanceStatus } from '../../types';

export const TeacherPortal: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'rollcall' | 'schedule' | 'homework' | 'leave'>('rollcall');

  // Roll Call State for Class 10-A
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});
  const [isRollCallSaved, setIsRollCallSaved] = useState(false);

  // Homework State
  const [homeworkList, setHomeworkList] = useState([
    { id: 'hw-1', class: 'Grade 10-A', subject: 'Mathematics', title: 'Quadratic Equations Exercise 4.2', due: 'Tomorrow 8:30 AM', submissions: 28 },
    { id: 'hw-2', class: 'Grade 9-B', subject: 'Mathematics', title: 'Linear Equations in Two Variables', due: 'Thursday 9:00 AM', submissions: 22 },
  ]);
  const [isAddHwModalOpen, setIsAddHwModalOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwClass, setHwClass] = useState('Grade 10-A');
  const [hwDue, setHwDue] = useState('Tomorrow');

  // Teacher Leave Request State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [teacherLeaveType, setTeacherLeaveType] = useState('casual');
  const [teacherLeaveDates, setTeacherLeaveDates] = useState('');
  const [teacherLeaveReason, setTeacherLeaveReason] = useState('');
  const [leaveSubmittedMsg, setLeaveSubmittedMsg] = useState<string | null>(null);

  if (!currentTenant) return null;

  const students = repo.getStudents(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);
  const teachers = repo.getTeachers(currentTenant.id);

  // Focus on Grade 10-A as default class teacher assignment
  const targetClass = classes[0];
  const classStudents = students.filter((s) => s.classId === targetClass?.id);

  // Initialize attendance state if empty
  const getStudentStatus = (studentId: string): AttendanceStatus => {
    return attendanceState[studentId] || 'present';
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveRollCall = () => {
    const today = new Date().toISOString().split('T')[0];
    const sectionId = sections.find((s) => s.classId === targetClass?.id)?.id || 'sec-g10-a';
    const recordsToSave = classStudents.map((s) => ({
      studentId: s.id,
      status: getStudentStatus(s.id),
      remarks: getStudentStatus(s.id) === 'present' ? 'Present' : 'Roll call record',
    }));

    repo.saveStudentAttendance(
      currentTenant.id,
      targetClass.id,
      sectionId,
      today,
      recordsToSave,
      currentUser || undefined
    );
    setIsRollCallSaved(true);
    setTimeout(() => setIsRollCallSaved(false), 4000);
  };

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle) return;

    setHomeworkList((prev) => [
      {
        id: `hw-${Date.now()}`,
        class: hwClass,
        subject: 'Mathematics',
        title: hwTitle,
        due: hwDue,
        submissions: 0,
      },
      ...prev,
    ]);

    setIsAddHwModalOpen(false);
    setHwTitle('');
  };

  const handleApplyTeacherLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherLeaveDates || !teacherLeaveReason) return;

    setLeaveSubmittedMsg(
      'Faculty leave request submitted to the Principal. Automated substitute allocation initiated.'
    );
    setIsLeaveModalOpen(false);
    setTeacherLeaveDates('');
    setTeacherLeaveReason('');
    setTimeout(() => setLeaveSubmittedMsg(null), 5000);
  };

  const presentCount = classStudents.filter((s) => getStudentStatus(s.id) === 'present').length;
  const absentCount = classStudents.filter((s) => getStudentStatus(s.id) === 'absent').length;
  const lateCount = classStudents.filter((s) => getStudentStatus(s.id) === 'late').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center font-bold text-xl text-teal-300 shadow-inner">
              SR
            </div>
            <div>
              <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Teacher & Faculty Workspace</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Dr. Sunita Rao
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>Senior PGT Mathematics</span>
                <span>&bull;</span>
                <span>Class Teacher: Grade 10-A</span>
                <span>&bull;</span>
                <span>Emp ID: FAC-1042</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Request Faculty Leave
            </button>
            <button
              onClick={() => setIsAddHwModalOpen(true)}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Homework</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {isRollCallSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Daily Roll Call recorded for {targetClass?.name}! Automated WhatsApp notices queued for {absentCount} absent students.
          </span>
        </div>
      )}

      {leaveSubmittedMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{leaveSubmittedMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl gap-6">
        <button
          onClick={() => setActiveTab('rollcall')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'rollcall'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>1-Click Daily Roll Call (Grade 10-A)</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'schedule'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Today's Teaching Periods</span>
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'homework'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Homework & Assignments ({homeworkList.length})</span>
        </button>
      </div>

      {/* Tab 1: 1-Click Roll Call */}
      {activeTab === 'rollcall' && (
        <div className="space-y-4">
          {/* Roll Call Summary Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-xs text-slate-800">
                Grade 10-A &bull; Morning Roll Call (Today)
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  {presentCount} Present
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                  {absentCount} Absent
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  {lateCount} Late
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveRollCall}
              className="px-5 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Finalize Register</span>
            </button>
          </div>

          {/* Roll Call Student Grid */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Admission #</th>
                    <th className="py-3 px-4">Aggregate Attendance</th>
                    <th className="py-3 px-4 text-center">Today's Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((st) => {
                    const status = getStudentStatus(st.id);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{st.rollNo}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {st.firstName} {st.lastName}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{st.admissionNo}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold text-xs ${
                              st.attendancePercentage < 75 ? 'text-rose-600 font-bold' : 'text-slate-700'
                            }`}
                          >
                            {st.attendancePercentage}%
                            {st.attendancePercentage < 75 && ' (Risk)'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setStatus(st.id, 'present')}
                              className={`px-3 py-1 rounded-md font-bold text-[11px] transition-colors ${
                                status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatus(st.id, 'absent')}
                              className={`px-3 py-1 rounded-md font-bold text-[11px] transition-colors ${
                                status === 'absent'
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatus(st.id, 'late')}
                              className={`px-3 py-1 rounded-md font-bold text-[11px] transition-colors ${
                                status === 'late'
                                  ? 'bg-amber-500 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Today's Teaching Periods */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monday Teaching Schedule</h3>
              <p className="text-xs text-slate-500">4 Teaching Periods &bull; 1 Lab Practical &bull; 1 Free Prep Period</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg">
              Room 204
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { period: 'Period 1 (8:30 - 9:15 AM)', class: 'Grade 10-A', subject: 'Mathematics (Algebra)', room: 'Room 204', active: false },
              { period: 'Period 2 (9:15 - 10:00 AM)', class: 'Staff Room', subject: 'Free Preparation Period', room: 'Faculty Lounge', active: false },
              { period: 'Period 3 (10:15 - 11:00 AM)', class: 'Grade 9-B', subject: 'Mathematics (Geometry)', room: 'Room 102', active: true },
              { period: 'Period 4 (11:00 - 11:45 AM)', class: 'Grade 10-A', subject: 'Mathematics Problem Solving', room: 'Room 204', active: false },
              { period: 'Period 5 (12:30 - 1:15 PM)', class: 'Grade 11-Science', subject: 'Calculus & Vectors', room: 'Room 302', active: false },
              { period: 'Period 6 (1:15 - 2:00 PM)', class: 'Math Club', subject: 'Olympiad Training', room: 'Math Lab', active: false },
            ].map((p, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  p.active ? 'border-teal-700 bg-teal-50/50 shadow-xs' : 'border-slate-100 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{p.period}</span>
                  {p.active && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-700 text-white animate-pulse">
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="font-bold text-sm text-slate-800 block">{p.subject}</span>
                  <span className="text-xs text-slate-500 font-medium">{p.class} &bull; {p.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Homework & Assignments */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Assignments & Homework Dispatcher</h3>
              <p className="text-xs text-slate-500">Post new homework notifications directly to student and parent apps.</p>
            </div>
            <button
              onClick={() => setIsAddHwModalOpen(true)}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Assignment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeworkList.map((hw) => (
              <div key={hw.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                    {hw.class} &bull; {hw.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Due: {hw.due}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{hw.title}</h4>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{hw.submissions} Students Submitted</span>
                  <button className="text-teal-800 font-bold hover:underline">Review Submissions</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Homework Modal */}
      {isAddHwModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Assign Daily Homework</span>
              </div>
              <button onClick={() => setIsAddHwModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHomework} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Target Class
                </label>
                <select
                  value={hwClass}
                  onChange={(e) => setHwClass(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="Grade 10-A">Grade 10-A (Mathematics)</option>
                  <option value="Grade 9-B">Grade 9-B (Mathematics)</option>
                  <option value="Grade 11-Science">Grade 11-Science (Calculus)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Homework Title & Chapter Reference *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Complete Problems 1 to 15"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Submission Due Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tomorrow by 8:30 AM"
                  value={hwDue}
                  onChange={(e) => setHwDue(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddHwModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Request Faculty Leave</span>
              </div>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyTeacherLeave} className="p-5 space-y-4 text-xs">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 text-teal-900 text-xs space-y-1">
                <span className="font-bold block">Automatic Substitute Allocation Preview:</span>
                <p className="text-[11px] text-teal-700">
                  If approved, Mr. Arvind Saxena will be assigned to Period 1 (10-A) and Period 3 (9-B).
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Leave Type
                </label>
                <select
                  value={teacherLeaveType}
                  onChange={(e) => setTeacherLeaveType(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="casual">Casual Leave (CL)</option>
                  <option value="medical">Medical / Sick Leave</option>
                  <option value="duty">Official Duty / Board Exam Duty</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Date(s) of Absence *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-10-08 to 2026-10-09"
                  value={teacherLeaveDates}
                  onChange={(e) => setTeacherLeaveDates(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Reason for Absence *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief reason to be submitted to Principal..."
                  value={teacherLeaveReason}
                  onChange={(e) => setTeacherLeaveReason(e.target.value)}
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
                  <span>Submit to Principal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
