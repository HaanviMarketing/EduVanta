import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Teacher } from '../../types';
import { hasPermission } from '../../lib/rbac';
import { AddTeacherModal } from './AddTeacherModal';

export const TeacherManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  if (!currentTenant) return null;

  const teachers = repo.getTeachers(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);
  const subjects = repo.getSubjects(currentTenant.id);

  const filteredTeachers = teachers.filter((t) => {
    const matchesQuery =
      query === '' ||
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(query.toLowerCase()) ||
      t.department.toLowerCase().includes(query.toLowerCase()) ||
      t.designation.toLowerCase().includes(query.toLowerCase());

    const matchesDept = selectedDept === 'all' || t.department === selectedDept;

    return matchesQuery && matchesDept;
  });

  const departments = Array.from(new Set(teachers.map((t) => t.department)));

  const canCreate = hasPermission(currentUser, 'teachers', 'create');

  const toggleAttendance = (teacher: Teacher, status: Teacher['todayAttendance']) => {
    repo.updateTeacher(currentTenant.id, teacher.id, { todayAttendance: status }, currentUser || undefined);
    // Refresh
    setSelectedTeacher(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Faculty & Teaching Staff</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty Directory · Subject & Class Teacher Allocations · {currentTenant.name}
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty by name, department, ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-600"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
          >
            <option value="all">All Departments ({departments.length})</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredTeachers.length}</strong> of {teachers.length} faculty
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => {
          const classTeacherClass = classes.find((c) => c.id === t.isClassTeacherOf?.classId);
          const classTeacherSection = sections.find((s) => s.id === t.isClassTeacherOf?.sectionId);

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTeacher(t)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                      alt={t.firstName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {t.firstName} {t.lastName}
                      </h3>
                      <div className="text-[11px] text-teal-800 font-medium font-mono">
                        {t.employeeId} · {t.department}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded capitalize ${
                      t.todayAttendance === 'present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.todayAttendance === 'on_leave'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {t.todayAttendance?.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mb-3 space-y-1">
                  <div className="font-medium text-slate-800">{t.designation}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.qualifications.join(', ')}</span>
                  </div>
                </div>

                {/* Class Teacher Badge */}
                {t.isClassTeacherOf && classTeacherClass && (
                  <div className="mb-3 px-2.5 py-1.5 bg-teal-50 border border-teal-200/80 rounded-lg text-[11px] text-teal-900 flex items-center justify-between">
                    <span className="font-semibold">Class Teacher:</span>
                    <span>{classTeacherClass.name} - {classTeacherSection?.name || 'Section A'}</span>
                  </div>
                )}
              </div>

              {/* Contact Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.phone}</span>
                </div>
                <span>{t.experienceYears} yrs exp</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <AddTeacherModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {}}
          classes={classes}
          sections={sections}
          subjects={subjects}
        />
      )}

      {/* Teacher Detail Drawer */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacher.photoUrl}
                  alt={selectedTeacher.firstName}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedTeacher.firstName} {selectedTeacher.lastName}
                  </h3>
                  <div className="text-teal-800 font-mono text-[11px]">
                    {selectedTeacher.employeeId} · {selectedTeacher.designation}
                  </div>
                  <div className="text-slate-500 text-[11px]">{selectedTeacher.department}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800">{selectedTeacher.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone:</span>
                <span className="text-slate-800">{selectedTeacher.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Experience:</span>
                <span className="text-slate-800">{selectedTeacher.experienceYears} Years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Joining Date:</span>
                <span className="text-slate-800">{selectedTeacher.joiningDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Address:</span>
                <span className="text-slate-800 text-right max-w-xs">{selectedTeacher.address}</span>
              </div>
            </div>

            {/* Attendance Toggle */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="font-semibold text-slate-800">Today's Attendance Status:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAttendance(selectedTeacher, 'present')}
                  className={`flex-1 py-1.5 rounded font-semibold text-xs transition-colors ${
                    selectedTeacher.todayAttendance === 'present'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => toggleAttendance(selectedTeacher, 'on_leave')}
                  className={`flex-1 py-1.5 rounded font-semibold text-xs transition-colors ${
                    selectedTeacher.todayAttendance === 'on_leave'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  On Leave
                </button>
                <button
                  onClick={() => toggleAttendance(selectedTeacher, 'absent')}
                  className={`flex-1 py-1.5 rounded font-semibold text-xs transition-colors ${
                    selectedTeacher.todayAttendance === 'absent'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
