import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Plus,
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Check,
  X,
  Sparkles,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Exam, Student, StudentExamMark, Subject } from '../../types';
import { ReportCardModal } from './ReportCardModal';

export const ExamsManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'exams' | 'marks_entry' | 'analytics' | 'report_cards'>('exams');

  // Exam Selection State
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Report Card Modal State
  const [reportCardTarget, setReportCardTarget] = useState<{
    student: Student;
    exam: Exam;
    marks: StudentExamMark[];
  } | null>(null);

  // New Exam Modal
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newExamType, setNewExamType] = useState<Exam['type']>('quarterly');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  // Editable Marks State in Marks Entry Tab
  const [marksState, setMarksState] = useState<Record<string, { marksObtained: number; remarks: string }>>({});
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  if (!currentTenant) return null;

  const exams = repo.getExams(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);
  const subjects = repo.getSubjects(currentTenant.id);
  const students = repo.getStudents(currentTenant.id);

  // Default selections
  const currentExamId = selectedExamId || (exams.length > 0 ? exams[0].id : '');
  const activeExam = exams.find((e) => e.id === currentExamId);
  const currentClassId = selectedClassId || (classes.length > 0 ? classes[0].id : '');
  const currentSubjectId = selectedSubjectId || (subjects.length > 0 ? subjects[0].id : '');

  const classStudents = students.filter((s) => s.classId === currentClassId);
  const classSubjects = subjects.filter((sub) => sub.classIds.includes(currentClassId));
  const activeSubject = subjects.find((s) => s.id === currentSubjectId);

  // Retrieve marks for this exam
  const examMarks = repo.getExamMarks(currentTenant.id, currentExamId);

  // Initialize or synchronize editable marks
  const handleOpenMarksEntry = (examId: string, classId: string, subjectId: string) => {
    setSelectedExamId(examId);
    setSelectedClassId(classId);
    setSelectedSubjectId(subjectId);
    setActiveTab('marks_entry');

    const existing = repo.getExamMarks(currentTenant.id, examId, classId, subjectId);
    const initialMap: Record<string, { marksObtained: number; remarks: string }> = {};
    classStudents.forEach((student) => {
      const rec = existing.find((m) => m.studentId === student.id);
      initialMap[student.id] = {
        marksObtained: rec ? rec.marksObtained : 75,
        remarks: rec?.teacherRemarks || 'Good understanding',
      };
    });
    setMarksState(initialMap);
  };

  const handleSaveMarks = () => {
    if (!activeExam || !activeSubject) return;

    const marksToSave = classStudents.map((student) => {
      const entry = marksState[student.id] || { marksObtained: 0, remarks: '' };
      return {
        examId: activeExam.id,
        studentId: student.id,
        subjectId: activeSubject.id,
        classId: currentClassId,
        sectionId: student.sectionId,
        marksObtained: Number(entry.marksObtained),
        maxMarks: activeSubject.maxMarks || 100,
        percentage: Math.round((Number(entry.marksObtained) / (activeSubject.maxMarks || 100)) * 100),
        grade: 'A',
        isPassed: Number(entry.marksObtained) >= (activeSubject.passingMarks || 40),
        teacherRemarks: entry.remarks,
      };
    });

    repo.saveExamMarks(currentTenant.id, marksToSave, currentUser || undefined);
    setIsSavedSuccessfully(true);
    setTimeout(() => setIsSavedSuccessfully(false), 3000);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName || !newStartDate || !newEndDate) return;

    repo.createExam(
      currentTenant.id,
      {
        name: newExamName,
        type: newExamType,
        academicYearId: currentTenant.currentAcademicYearId,
        startDate: newStartDate,
        endDate: newEndDate,
        status: 'scheduled',
        applicableClassIds: classes.map((c) => c.id),
      },
      currentUser || undefined
    );

    setIsNewExamModalOpen(false);
    setNewExamName('');
    setNewStartDate('');
    setNewEndDate('');
  };

  const openReportCardForStudent = (student: Student) => {
    if (!activeExam) return;
    const studentMarks = repo.getExamMarks(currentTenant.id, activeExam.id).filter((m) => m.studentId === student.id);
    setReportCardTarget({
      student,
      exam: activeExam,
      marks: studentMarks,
    });
  };

  // Class analytics calculations
  const classMarks = examMarks.filter((m) => m.classId === currentClassId);
  const totalSubmissions = classMarks.length;
  const passCount = classMarks.filter((m) => m.isPassed).length;
  const passPercentage = totalSubmissions > 0 ? Math.round((passCount / totalSubmissions) * 100) : 0;
  const avgClassScore =
    totalSubmissions > 0 ? Math.round(classMarks.reduce((sum, m) => sum + m.percentage, 0) / totalSubmissions) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Examinations & Assessment Suite</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exam schedules, continuous assessment entry, automated grading scales, and AI-assisted official report cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewExamModalOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Examination</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl gap-6">
        <button
          onClick={() => setActiveTab('exams')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'exams'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduled Examinations ({exams.length})</span>
        </button>

        <button
          onClick={() => {
            handleOpenMarksEntry(currentExamId, currentClassId, currentSubjectId);
          }}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'marks_entry'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Marks Entry Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Performance Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('report_cards')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'report_cards'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Report Cards & AI Remarks</span>
        </button>
      </div>

      {/* Tab 1: Scheduled Examinations */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => {
            const marksForExam = repo.getExamMarks(currentTenant.id, exam.id);
            return (
              <div
                key={exam.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {exam.type.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exam.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exam.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exam.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exam.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {exam.startDate} to {exam.endDate}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Grades Covered</span>
                      <span className="font-bold text-slate-800">{exam.applicableClassIds.length} Classes</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Entries Logged</span>
                      <span className="font-bold text-slate-800">{marksForExam.length} marks</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      handleOpenMarksEntry(exam.id, currentClassId, currentSubjectId);
                    }}
                    className="flex-1 py-1.5 px-3 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Enter Marks</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setActiveTab('report_cards');
                    }}
                    className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Report Cards
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Marks Entry Matrix */}
      {activeTab === 'marks_entry' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Select Exam
              </label>
              <select
                value={selectedExamId || currentExamId}
                onChange={(e) => handleOpenMarksEntry(e.target.value, currentClassId, currentSubjectId)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[160px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Select Class
              </label>
              <select
                value={currentClassId}
                onChange={(e) => handleOpenMarksEntry(currentExamId, e.target.value, currentSubjectId)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Select Subject
              </label>
              <select
                value={currentSubjectId}
                onChange={(e) => handleOpenMarksEntry(currentExamId, currentClassId, e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
              >
                {classSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (Max: {sub.maxMarks || 100})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pt-5">
              <button
                onClick={handleSaveMarks}
                className="px-5 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Marks to SIS</span>
              </button>
            </div>
          </div>

          {isSavedSuccessfully && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Marks recorded successfully. Performance analytics and report card cards updated.</span>
            </div>
          )}

          {/* Student Marks Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800">
                  {classes.find((c) => c.id === currentClassId)?.name} &bull; {activeSubject?.name}
                </span>
                <span className="text-[11px] text-slate-500 ml-2">
                  (Passing marks: {activeSubject?.passingMarks || 40}/{activeSubject?.maxMarks || 100})
                </span>
              </div>
              <span className="text-xs text-slate-500">{classStudents.length} Students enrolled</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4 w-36">Marks Obtained (/{activeSubject?.maxMarks || 100})</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Teacher Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((student) => {
                    const entry = marksState[student.id] || { marksObtained: 0, remarks: '' };
                    const maxMarks = activeSubject?.maxMarks || 100;
                    const pct = Math.round((entry.marksObtained / maxMarks) * 100);
                    const isPassing = entry.marksObtained >= (activeSubject?.passingMarks || 40);

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{student.rollNo}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{student.admissionNo}</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max={maxMarks}
                            value={entry.marksObtained}
                            onChange={(e) => {
                              const val = Math.min(maxMarks, Math.max(0, Number(e.target.value)));
                              setMarksState((prev) => ({
                                ...prev,
                                [student.id]: {
                                  ...prev[student.id],
                                  marksObtained: val,
                                },
                              }));
                            }}
                            className="w-24 px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded focus:border-teal-700 focus:outline-hidden"
                          />
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">{pct}%</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isPassing ? 'PASS' : 'NEEDS SUPPORT'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) => {
                              setMarksState((prev) => ({
                                ...prev,
                                [student.id]: {
                                  ...prev[student.id],
                                  remarks: e.target.value,
                                },
                              }));
                            }}
                            placeholder="Add brief observation..."
                            className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-teal-700 focus:outline-hidden"
                          />
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

      {/* Tab 3: Performance Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Class Average</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{avgClassScore}%</div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+3.2% vs previous term</span>
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Pass Rate</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{passPercentage}%</div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                {passCount} of {totalSubmissions} submissions passed
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Performing Class</span>
              <div className="text-2xl font-black text-slate-900 mt-1">Grade 10-A</div>
              <span className="text-[11px] text-teal-800 font-semibold block mt-1">86.4% aggregate score</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Students Needing Remedial</span>
              <div className="text-2xl font-black text-rose-600 mt-1">3 Students</div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">Below 40% passing threshold</span>
            </div>
          </div>

          {/* Subject Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subject-Wise Performance Distribution</h3>
                <p className="text-xs text-slate-500">Average scores and pass percentages across active courses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((sub) => {
                const subMarks = examMarks.filter((m) => m.subjectId === sub.id);
                const subAvg =
                  subMarks.length > 0
                    ? Math.round(subMarks.reduce((sum, m) => sum + m.percentage, 0) / subMarks.length)
                    : 74;

                return (
                  <div key={sub.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{sub.name}</span>
                      <span className="text-xs font-mono font-bold text-teal-800">{subAvg}% avg</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          subAvg >= 80 ? 'bg-teal-600' : subAvg >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${subAvg}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Max Marks: {sub.maxMarks || 100}</span>
                      <span>Pass Criteria: {sub.passingMarks || 40}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Report Cards & AI Remarks */}
      {activeTab === 'report_cards' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Student Report Cards</h3>
              <p className="text-xs text-slate-500">
                View, generate AI remarks, and download or print printable board-compliant report cards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={currentClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classStudents.map((student) => {
              const studentMarks = activeExam
                ? repo.getExamMarks(currentTenant.id, activeExam.id).filter((m) => m.studentId === student.id)
                : [];
              const hasMarks = studentMarks.length > 0;

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-700/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-xs">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {student.firstName} {student.lastName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">Roll: {student.rollNo}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                        {student.academicAverage || 82}% Avg
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Attendance:</span>
                        <span className="font-semibold text-slate-800">{student.attendancePercentage}%</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Status:</span>
                        <span className="font-semibold text-emerald-700">Eligible for Promotion</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => openReportCardForStudent(student)}
                      className="w-full py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      <span>Generate & Print Report Card</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Exam Modal */}
      {isNewExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Schedule New Examination</span>
              </div>
              <button onClick={() => setIsNewExamModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Examination Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Term 2 Pre-Board Examination"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Examination Type
                </label>
                <select
                  value={newExamType}
                  onChange={(e) => setNewExamType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-700 focus:outline-hidden"
                >
                  <option value="unit_test">Unit Test (Class Assessment)</option>
                  <option value="quarterly">Quarterly Examination</option>
                  <option value="half_yearly">Half-Yearly Examination</option>
                  <option value="pre_board">Pre-Board Examination</option>
                  <option value="annual">Annual Final Examination</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewExamModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Create Examination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Official Report Card Modal when triggered */}
      {reportCardTarget && (
        <ReportCardModal
          student={reportCardTarget.student}
          exam={reportCardTarget.exam}
          marks={reportCardTarget.marks}
          onClose={() => setReportCardTarget(null)}
        />
      )}
    </div>
  );
};
