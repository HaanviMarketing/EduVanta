import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Users,
  UserCheck,
  UserX,
  FileText,
  Download,
  UploadCloud,
  Check,
  X,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import {
  AttendanceStatus,
  Student,
  StudentAttendanceRecord,
  StudentLeaveApplication,
  FacultyLeaveApplication,
  WhatsAppNotificationPayload,
} from '../../types';

export const AttendanceManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'register' | 'student_leaves' | 'faculty_leaves' | 'alerts'>('register');

  // Register State
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Attendance Records working draft
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [whatsappModalPayloads, setWhatsappModalPayloads] = useState<WhatsAppNotificationPayload[] | null>(null);

  // New Student Leave Modal
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    studentId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    leaveType: 'sick' as const,
    reason: '',
  });

  // Offline Simulation State
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineSynced, setOfflineSynced] = useState(false);

  if (!currentTenant) return null;

  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);
  const allStudents = repo.getStudents(currentTenant.id);
  const teachers = repo.getTeachers(currentTenant.id);

  // Initialize selected class & section if not set
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const availableSections = sections.filter((s) => s.classId === selectedClassId);

  useEffect(() => {
    if (availableSections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(availableSections[0].id);
    }
  }, [availableSections, selectedSectionId]);

  // Students belonging to currently selected class & section
  const rosterStudents = allStudents.filter(
    (s) => s.classId === selectedClassId && (selectedSectionId ? s.sectionId === selectedSectionId : true)
  );

  // Load existing records for this class/section/date
  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) return;

    const existingRecords = repo.getStudentAttendance(currentTenant.id, selectedClassId, selectedSectionId, selectedDate);
    const draft: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    rosterStudents.forEach((student) => {
      const match = existingRecords.find((r) => r.studentId === student.id);
      if (match) {
        draft[student.id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        // Default to present
        draft[student.id] = { status: 'present', remarks: '' };
      }
    });

    setAttendanceDraft(draft);
  }, [selectedClassId, selectedSectionId, selectedDate, currentTenant.id]);

  // Bulk actions
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    rosterStudents.forEach((s) => {
      updated[s.id] = { status, remarks: attendanceDraft[s.id]?.remarks || '' };
    });
    setAttendanceDraft(updated);
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [studentId]: {
        status,
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  const handleSaveAttendance = () => {
    const payload = rosterStudents.map((s) => ({
      studentId: s.id,
      status: attendanceDraft[s.id]?.status || 'present',
      remarks: attendanceDraft[s.id]?.remarks,
    }));

    const result = repo.saveStudentAttendance(
      currentTenant.id,
      selectedClassId,
      selectedSectionId,
      selectedDate,
      payload,
      currentUser || undefined
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    // If notifications were triggered, show the WhatsApp preview modal
    if (result.triggeredNotifications.length > 0) {
      setWhatsappModalPayloads(result.triggeredNotifications);
    }
  };

  // Student Leaves
  const studentLeaves = repo.getStudentLeaveApplications(currentTenant.id);
  const facultyLeaves = repo.getFacultyLeaveApplications(currentTenant.id);

  const handleReviewStudentLeave = (leaveId: string, status: 'approved' | 'rejected') => {
    repo.reviewStudentLeaveApplication(
      currentTenant.id,
      leaveId,
      status,
      status === 'approved' ? 'Leave granted by Class Teacher' : 'Rejected per attendance policy',
      currentUser || undefined
    );
    window.location.hash = `leave-refresh-${Date.now()}`;
  };

  const handleCreateStudentLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const student = allStudents.find((s) => s.id === leaveFormData.studentId);
    if (!student || !leaveFormData.reason) return;

    repo.createStudentLeaveApplication(currentTenant.id, {
      studentId: student.id,
      applicantName: `${student.parentGuardian.fatherName} (Parent)`,
      applicantRole: 'parent',
      startDate: leaveFormData.startDate,
      endDate: leaveFormData.endDate,
      leaveType: leaveFormData.leaveType,
      reason: leaveFormData.reason,
    });

    setShowNewLeaveModal(false);
    setLeaveFormData({
      studentId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      leaveType: 'sick',
      reason: '',
    });
  };

  const handleReviewFacultyLeave = (leaveId: string, status: 'approved' | 'rejected', substituteTeacherId?: string) => {
    const sub = teachers.find((t) => t.id === substituteTeacherId);
    repo.reviewFacultyLeaveApplication(
      currentTenant.id,
      leaveId,
      status,
      substituteTeacherId,
      sub ? `${sub.firstName} ${sub.lastName}` : undefined,
      status === 'approved' ? 'Approved by Principal' : 'Disapproved',
      currentUser || undefined
    );
    window.location.hash = `fleave-refresh-${Date.now()}`;
  };

  // Compute live stats for current register view
  const totalInRoster = rosterStudents.length;
  const presentCount = rosterStudents.filter((s) => attendanceDraft[s.id]?.status === 'present').length;
  const absentCount = rosterStudents.filter((s) => attendanceDraft[s.id]?.status === 'absent').length;
  const lateCount = rosterStudents.filter((s) => attendanceDraft[s.id]?.status === 'late').length;
  const excusedCount = rosterStudents.filter(
    (s) => attendanceDraft[s.id]?.status === 'excused' || attendanceDraft[s.id]?.status === 'leave'
  ).length;

  const currentRate = totalInRoster > 0 ? ((presentCount / totalInRoster) * 100).toFixed(0) : '0';

  // Defaulters list (< 75%)
  const defaulterStudents = allStudents.filter(
    (s) => s.attendancePercentage < (currentTenant.settings.minAttendancePercent || 75)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Attendance & Leave Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily Digital Register · Parent Leave Applications · Automated WhatsApp Dispatches · {currentTenant.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Offline Sync Mode Toggle */}
          <button
            onClick={() => {
              setIsOfflineMode(!isOfflineMode);
              if (!isOfflineMode) {
                setOfflineSynced(true);
                setTimeout(() => setOfflineSynced(false), 2500);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
              isOfflineMode
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isOfflineMode ? 'Offline Mode Active' : 'Offline Roster Sync'}</span>
          </button>

          {activeTab === 'student_leaves' && (
            <button
              onClick={() => setShowNewLeaveModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors"
            >
              <span>+ Apply Student Leave</span>
            </button>
          )}
        </div>
      </div>

      {offlineSynced && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
          <span>
            Roster cached locally for offline marking. Changes will be saved locally and pushed when connectivity restores.
          </span>
          <span className="font-mono text-[11px] font-bold">Cached 100%</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 flex flex-wrap gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('register')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'register'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Attendance Register</span>
        </button>

        <button
          onClick={() => setActiveTab('student_leaves')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'student_leaves'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Parent Leave Requests ({studentLeaves.filter((l) => l.status === 'pending').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('faculty_leaves')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'faculty_leaves'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Leave & Substitutes ({facultyLeaves.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Statutory Defaulters ({defaulterStudents.length})</span>
        </button>
      </div>

      {/* TAB 1: Attendance Register */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Class / Grade</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const sec = sections.find((s) => s.classId === e.target.value);
                    if (sec) setSelectedSectionId(sec.id);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Section</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
                >
                  {availableSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Attendance Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white font-mono"
                />
              </div>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <span className="text-slate-400 font-medium mr-1">Bulk:</span>
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-semibold transition-colors"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-semibold transition-colors"
              >
                Clear / Reset
              </button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="text-slate-400 text-[11px]">Enrolled in Class</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{totalInRoster}</div>
            </div>
            <div className="p-3 bg-white border border-emerald-200 rounded-xl shadow-2xs">
              <div className="text-emerald-700 font-medium text-[11px]">Present Today</div>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">{presentCount}</div>
            </div>
            <div className="p-3 bg-white border border-rose-200 rounded-xl shadow-2xs">
              <div className="text-rose-700 font-medium text-[11px]">Absent</div>
              <div className="text-lg font-bold text-rose-700 mt-0.5">{absentCount}</div>
            </div>
            <div className="p-3 bg-white border border-amber-200 rounded-xl shadow-2xs">
              <div className="text-amber-700 font-medium text-[11px]">Late Arrivals</div>
              <div className="text-lg font-bold text-amber-700 mt-0.5">{lateCount}</div>
            </div>
            <div className="p-3 bg-white border border-teal-200 rounded-xl shadow-2xs col-span-2 sm:col-span-1">
              <div className="text-teal-800 font-semibold text-[11px]">Attendance Rate</div>
              <div className="text-lg font-mono font-bold text-teal-800 mt-0.5">{currentRate}%</div>
            </div>
          </div>

          {/* Students Register Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Cumulative %</th>
                  <th className="py-3 px-4">Today's Marking</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rosterStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No students allocated to this section yet.
                    </td>
                  </tr>
                ) : (
                  rosterStudents.map((s) => {
                    const currentStatus = attendanceDraft[s.id]?.status || 'present';
                    const remarks = attendanceDraft[s.id]?.remarks || '';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{s.rollNo}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={s.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt={s.firstName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">
                                {s.firstName} {s.lastName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">Adm: {s.admissionNo}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono">
                          <span
                            className={`font-bold ${
                              s.attendancePercentage < 75 ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {s.attendancePercentage}%
                          </span>
                        </td>

                        {/* Status Toggle Buttons */}
                        <td className="py-3 px-4">
                          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100/70 gap-0.5">
                            <button
                              type="button"
                              onClick={() => setStudentStatus(s.id, 'present')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(s.id, 'absent')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                currentStatus === 'absent'
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(s.id, 'late')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                currentStatus === 'late'
                                  ? 'bg-amber-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(s.id, 'leave')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                currentStatus === 'leave'
                                  ? 'bg-purple-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Leave
                            </button>
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Optional note..."
                            value={remarks}
                            onChange={(e) =>
                              setAttendanceDraft((prev) => ({
                                ...prev,
                                [s.id]: {
                                  status: prev[s.id]?.status || 'present',
                                  remarks: e.target.value,
                                },
                              }))
                            }
                            className="w-full max-w-xs px-2.5 py-1 border border-slate-200 rounded focus:outline-teal-600 text-[11px]"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Save & Notification Dispatch Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {currentTenant.settings.enableWhatsAppAlerts ? (
                <span className="flex items-center gap-1.5 text-teal-800 font-semibold">
                  <Check className="w-4 h-4 text-teal-600" />
                  Automated parent WhatsApp alerts enabled for any marked absences.
                </span>
              ) : (
                <span>WhatsApp alerts disabled in school settings.</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Attendance Saved!
                </span>
              )}

              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Roster & Trigger Parent Notifications</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Parent Leave Requests */}
      {activeTab === 'student_leaves' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Parent Leave Applications</h3>
                <p className="text-xs text-slate-500">
                  Digital applications submitted via Parent Portal requiring Class Teacher approval
                </p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentLeaves.map((l) => {
                  const student = allStudents.find((s) => s.id === l.studentId);
                  const cls = classes.find((c) => c.id === student?.classId);

                  return (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {student?.firstName} {student?.lastName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {cls?.name} · Adm: {student?.admissionNo}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">{l.applicantName}</td>

                      <td className="py-3 px-4 font-mono">
                        {l.startDate} to {l.endDate}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold capitalize">
                          {l.leaveType}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 max-w-xs">{l.reason}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            l.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {l.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleReviewStudentLeave(l.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px] transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewStudentLeave(l.id, 'rejected')}
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded font-semibold text-[11px] transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Faculty Leave & Substitutes */}
      {activeTab === 'faculty_leaves' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Faculty Leave & Automated Substitute Matrix</h3>
              <p className="text-xs text-slate-500">
                Timetable conflict detection and automatic substitute teacher allocation
              </p>
            </div>

            <div className="p-4 space-y-4">
              {facultyLeaves.map((fl) => {
                const teacher = teachers.find((t) => t.id === fl.teacherId);
                const availableSubstitutes = teachers.filter((t) => t.id !== fl.teacherId && t.todayAttendance === 'present');

                return (
                  <div
                    key={fl.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher?.photoUrl}
                          alt={teacher?.firstName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {teacher?.firstName} {teacher?.lastName}
                          </div>
                          <div className="text-[11px] text-teal-800 font-mono">
                            {teacher?.department} · {teacher?.designation}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-slate-200 text-slate-800">
                          {fl.leaveType} Leave · {fl.startDate}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                            fl.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {fl.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                      <strong>Reason:</strong> {fl.reason}
                    </div>

                    {/* Periods Impacted & Substitute */}
                    <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-lg text-xs space-y-2">
                      <div className="font-bold text-teal-950 flex items-center justify-between">
                        <span>Impacted Class Schedule & Substitute Allocation:</span>
                        {fl.substituteTeacherName && (
                          <span className="text-teal-700">Allocated to: <strong>{fl.substituteTeacherName}</strong></span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {fl.periodsImpacted.map((p, idx) => (
                          <div key={idx} className="px-2.5 py-1 bg-white border border-teal-200 rounded text-[11px] font-mono">
                            Period {p.periodNumber}: Grade 10A (English)
                          </div>
                        ))}
                      </div>

                      {fl.status === 'pending' && (
                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>Assign Substitute:</span>
                            <select
                              id={`sub-${fl.id}`}
                              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            >
                              {availableSubstitutes.map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.firstName} {st.lastName} ({st.department})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const selectEl = document.getElementById(`sub-${fl.id}`) as HTMLSelectElement;
                                handleReviewFacultyLeave(fl.id, 'approved', selectEl?.value);
                              }}
                              className="px-3 py-1.5 bg-teal-800 text-white rounded font-semibold text-xs"
                            >
                              Approve & Assign Substitute
                            </button>
                            <button
                              onClick={() => handleReviewFacultyLeave(fl.id, 'rejected')}
                              className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded font-semibold text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Statutory Threshold Defaulters */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Statutory Board Attendance Compliance Warning (Below 75%)</span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              In accordance with educational board regulations, students must maintain a minimum of{' '}
              {currentTenant.settings.minAttendancePercent}% attendance to be eligible for annual examinations.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Attendance %</th>
                  <th className="py-3 px-4">Deficit Days</th>
                  <th className="py-3 px-4">Parent Contact</th>
                  <th className="py-3 px-4 text-right">Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaulterStudents.map((s) => {
                  const cls = classes.find((c) => c.id === s.classId);
                  const deficitDays = Math.ceil(((75 - s.attendancePercentage) / 100) * 114);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {s.firstName} {s.lastName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Adm: {s.admissionNo}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">{cls?.name}</td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-rose-600 text-sm">
                          {s.attendancePercentage}%
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {deficitDays} days to reach 75%
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{s.parentGuardian.fatherName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.parentGuardian.fatherPhone}</div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setWhatsappModalPayloads([
                              {
                                recipientPhone: s.parentGuardian.fatherPhone,
                                recipientName: s.parentGuardian.fatherName,
                                studentName: `${s.firstName} ${s.lastName}`,
                                schoolName: currentTenant.name,
                                message: `Urgent Attendance Advisory from ${currentTenant.name}: ${s.firstName}'s cumulative attendance has dropped to ${s.attendancePercentage}%, which is below the mandatory 75% CBSE requirement. Please attend the counseling meeting scheduled for this Thursday.`,
                                templateType: 'threshold_warning',
                                timestamp: new Date().toISOString(),
                              },
                            ]);
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded font-semibold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Dispatch Statutory Warning</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Student Leave Modal */}
      {showNewLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Submit Student Leave Request</h3>
              <button onClick={() => setShowNewLeaveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudentLeave} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Student *</label>
                <select
                  value={leaveFormData.studentId}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
                  required
                >
                  <option value="">Select Student...</option>
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (Roll: {s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={leaveFormData.startDate}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={leaveFormData.endDate}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveFormData.leaveType}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, leaveType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white capitalize"
                >
                  <option value="sick">Sick / Medical</option>
                  <option value="family">Family Function</option>
                  <option value="medical">Prescribed Treatment</option>
                  <option value="other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Detailed Reason *</label>
                <textarea
                  rows={2}
                  value={leaveFormData.reason}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                  placeholder="Explain reason for absence..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeaveModal(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Message Preview Modal */}
      {whatsappModalPayloads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 text-xs">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-300" />
                <span className="font-bold text-sm">Automated WhatsApp Parent Notifications Dispatched</span>
              </div>
              <button onClick={() => setWhatsappModalPayloads(null)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-slate-600">
                SchoolOS has triggered the following institutional WhatsApp messages in accordance with attendance policy:
              </p>

              {whatsappModalPayloads.map((msg, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
                    <span>To: {msg.recipientName} ({msg.recipientPhone})</span>
                    <span className="font-mono text-emerald-700">Sent · WhatsApp API</span>
                  </div>
                  <div className="p-2.5 bg-white border border-emerald-200/60 rounded-lg text-slate-800 text-[11px] leading-relaxed shadow-2xs">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setWhatsappModalPayloads(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
