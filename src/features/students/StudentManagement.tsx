import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  UserPlus,
  Download,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Trash2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Student, RiskStatus } from '../../types';
import { hasPermission } from '../../lib/rbac';
import { AddStudentModal } from './AddStudentModal';
import { StudentDetailModal } from './StudentDetailModal';

export const StudentManagement: React.FC<{ initialSelectedStudentId?: string }> = ({
  initialSelectedStudentId,
}) => {
  const { currentTenant, currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  if (!currentTenant) return null;

  const students = repo.getStudents(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesQuery =
      query === '' ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(query.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(query.toLowerCase());

    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
    const matchesRisk = selectedRisk === 'all' || s.riskStatus === selectedRisk;

    return matchesQuery && matchesClass && matchesRisk;
  });

  // Summary counts
  const needsAttentionCount = students.filter((s) => s.riskStatus === 'needs_attention').length;
  const monitorCount = students.filter((s) => s.riskStatus === 'monitor').length;

  const canCreate = hasPermission(currentUser, 'students', 'create');
  const canDelete = hasPermission(currentUser, 'students', 'delete');
  const canExport = hasPermission(currentUser, 'students', 'export');

  const handleDelete = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName} (${student.admissionNo})?`)) {
      repo.deleteStudent(currentTenant.id, student.id, currentUser || undefined);
      // Force trigger state update
      window.location.hash = `student-refresh-${Date.now()}`;
    }
  };

  const exportCSV = () => {
    const headers = ['Admission No', 'Roll No', 'Name', 'Class', 'Gender', 'Attendance %', 'Average %', 'Risk Status', 'Fee Balance'];
    const rows = filteredStudents.map((s) => {
      const cls = classes.find((c) => c.id === s.classId)?.name || '';
      return [
        s.admissionNo,
        s.rollNo,
        `"${s.firstName} ${s.lastName}"`,
        cls,
        s.gender,
        s.attendancePercentage,
        s.academicAverage,
        s.riskStatus,
        s.feeBalance,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students-${currentTenant.slug}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student 360 & SIS Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Student Information System · Explainable Student Success Engine · {currentTenant.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canExport && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          )}

          {canCreate && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Overview Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, roll no, admission no..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-600"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-600"
            >
              <option value="all">All Classes ({classes.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Success Engine Risk Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-600"
            >
              <option value="all">All Success Engine Statuses</option>
              <option value="needs_attention">Needs Attention ({needsAttentionCount})</option>
              <option value="monitor">Monitor ({monitorCount})</option>
              <option value="stable">Stable</option>
              <option value="improving">Improving</option>
            </select>
          </div>

          {/* Metrics summary */}
          <div className="flex items-center justify-end gap-3 text-xs text-slate-600 font-medium px-2">
            <span>Showing: <strong className="text-slate-900">{filteredStudents.length}</strong></span>
            <span>·</span>
            <span>Total: <strong className="text-slate-900">{students.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Academics</th>
                <th className="py-3 px-4">Success Engine Status</th>
                <th className="py-3 px-4">Fee Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No student records matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const studentClass = classes.find((c) => c.id === s.classId);
                  const studentSection = sections.find((sec) => sec.id === s.sectionId);

                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={s.firstName}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                              {s.firstName} {s.lastName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Adm: {s.admissionNo} · Roll: {s.rollNo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{studentClass?.name}</div>
                        <div className="text-[11px] text-slate-500">{studentSection?.name || 'Section A'}</div>
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold ${
                              s.attendancePercentage < (currentTenant.settings.minAttendancePercent || 75)
                                ? 'text-rose-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {s.attendancePercentage}%
                          </span>
                          {s.attendancePercentage < 75 && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-1 py-0.2 rounded font-medium">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Academic Average */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800">
                          {s.academicAverage}%
                        </span>
                      </td>

                      {/* Success Engine Risk */}
                      <td className="py-3 px-4">
                        {s.riskStatus === 'needs_attention' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Needs Attention
                          </span>
                        )}
                        {s.riskStatus === 'monitor' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Monitor
                          </span>
                        )}
                        {s.riskStatus === 'stable' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Stable
                          </span>
                        )}
                        {s.riskStatus === 'improving' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Improving
                          </span>
                        )}
                      </td>

                      {/* Fee Balance */}
                      <td className="py-3 px-4 font-mono font-medium">
                        {s.feeBalance > 0 ? (
                          <span className="text-rose-600 font-semibold">
                            ₹{s.feeBalance.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-emerald-600">Paid</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedStudent(s)}
                            title="View Student 360"
                            className="p-1.5 text-slate-500 hover:text-teal-800 hover:bg-teal-50 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={(e) => handleDelete(s, e)}
                              title="Delete Record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {}}
          classes={classes}
          sections={sections}
        />
      )}

      {/* Student 360 Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          classes={classes}
          sections={sections}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};
