import React, { useState } from 'react';
import {
  X,
  Printer,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  QrCode,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Student, Exam, StudentExamMark, ReportCardRemarkDraft } from '../../types';

interface ReportCardModalProps {
  student: Student;
  exam: Exam;
  marks: StudentExamMark[];
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  exam,
  marks,
  onClose,
}) => {
  const { currentTenant } = useAuth();
  if (!currentTenant) return null;

  const subjects = repo.getSubjects(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);

  const studentClass = classes.find((c) => c.id === student.classId);
  const studentSection = sections.find((s) => s.id === student.sectionId);

  // Generate or retrieve remarks draft
  const defaultRemarks = repo.generateAiReportRemarks(currentTenant.id, student.id, marks);

  const [teacherRemarks, setTeacherRemarks] = useState(defaultRemarks.suggestedTeacherRemark);
  const [principalRemarks, setPrincipalRemarks] = useState(defaultRemarks.suggestedPrincipalRemark);
  const [isAiRemarkGenerated, setIsAiRemarkGenerated] = useState(true);

  // Calculations
  const totalMaxMarks = marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const totalObtainedMarks = marks.reduce((sum, m) => sum + m.marksObtained, 0);
  const grandPercentage = totalMaxMarks > 0 ? Math.round((totalObtainedMarks / totalMaxMarks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Controls Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm">Official Academic Report Card</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Document */}
        <div className="p-8 overflow-y-auto flex-1 text-xs space-y-6 print:p-6 print:space-y-4">
          {/* School Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="flex items-center justify-between">
              {currentTenant.logoUrl ? (
                <img
                  src={currentTenant.logoUrl}
                  alt={currentTenant.name}
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-teal-800 text-white font-bold text-xl flex items-center justify-center">
                  {currentTenant.name[0]}
                </div>
              )}

              <div className="text-center flex-1 px-4">
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight font-serif">
                  {currentTenant.name}
                </h1>
                <p className="text-xs text-slate-600 font-medium">{currentTenant.tagline}</p>
                <div className="text-[11px] text-slate-500 mt-1">
                  Affiliated to {currentTenant.board} · Affiliation Code: {currentTenant.code} · AY 2026-2027
                </div>
              </div>

              {/* QR Verification Badge */}
              <div className="w-16 h-16 border border-slate-200 rounded-lg p-1 flex flex-col items-center justify-center bg-slate-50 shrink-0">
                <QrCode className="w-8 h-8 text-slate-800" />
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">VERIFIED</span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded">
                Progress Performance Report · {exam.name}
              </span>
            </div>
          </div>

          {/* Student Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
              <span className="font-bold text-slate-900">{student.firstName} {student.lastName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Roll Number</span>
              <span className="font-mono font-bold text-slate-900">{student.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Admission No</span>
              <span className="font-mono text-slate-800">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class & Section</span>
              <span className="font-semibold text-slate-900">{studentClass?.name} - {studentSection?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date of Birth</span>
              <span className="text-slate-800">{student.dob}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">House</span>
              <span className="text-teal-800 font-semibold">{student.house || 'Unassigned'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Father's Name</span>
              <span className="text-slate-800">{student.parentGuardian.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Attendance Rate</span>
              <span className="font-mono font-bold text-slate-900">{student.attendancePercentage}%</span>
            </div>
          </div>

          {/* Marks Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">Subject</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Max Marks</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Pass Marks</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Marks Obtained</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Percentage</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Grade</th>
                  <th className="p-2.5 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {marks.map((m) => {
                  const subj = subjects.find((s) => s.id === m.subjectId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                        {subj?.name || 'Academic Subject'}
                      </td>
                      <td className="p-2.5 text-center font-mono border-r border-slate-200">{m.maxMarks}</td>
                      <td className="p-2.5 text-center font-mono border-r border-slate-200 text-slate-500">33</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                        {m.marksObtained}
                      </td>
                      <td className="p-2.5 text-center font-mono font-semibold border-r border-slate-200">
                        {m.percentage}%
                      </td>
                      <td className="p-2.5 text-center font-bold text-teal-800 border-r border-slate-200">
                        {m.grade}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-emerald-700">
                        {m.isPassed ? 'Pass' : 'Remedial'}
                      </td>
                    </tr>
                  );
                })}

                {/* Aggregate Summary Row */}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td className="p-2.5 border-r border-slate-300">Grand Aggregate</td>
                  <td className="p-2.5 text-center font-mono border-r border-slate-300">{totalMaxMarks}</td>
                  <td className="p-2.5 text-center font-mono border-r border-slate-300">—</td>
                  <td className="p-2.5 text-center font-mono text-teal-900 text-sm border-r border-slate-300">
                    {totalObtainedMarks}
                  </td>
                  <td className="p-2.5 text-center font-mono text-teal-900 text-sm border-r border-slate-300">
                    {grandPercentage}%
                  </td>
                  <td className="p-2.5 text-center font-bold text-teal-900 border-r border-slate-300">
                    {defaultRemarks.overallGrade}
                  </td>
                  <td className="p-2.5 text-center text-emerald-800 uppercase">Passed</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI-Powered Remarks Assistant */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Pedagogical Remarks Assistant</span>
              </span>
              <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-200">
                Auto-Drafted from Student Indicators
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block font-semibold text-slate-700 text-[11px]">
                  Class Teacher Remark:
                </label>
                <textarea
                  rows={3}
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[11px] leading-relaxed focus:outline-teal-600"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="block font-semibold text-slate-700 text-[11px]">
                  Principal Remark:
                </label>
                <textarea
                  rows={3}
                  value={principalRemarks}
                  onChange={(e) => setPrincipalRemarks(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[11px] leading-relaxed focus:outline-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-2"></div>
              <span className="font-bold text-slate-900">Class Teacher</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-2"></div>
              <span className="font-bold text-slate-900">Exam Controller</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-2"></div>
              <span className="font-bold text-slate-900">Principal</span>
            </div>
          </div>

          {/* Watermark Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Report Generated: {new Date().toLocaleDateString()}</span>
            <span>SchoolOS Official Document Security Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
