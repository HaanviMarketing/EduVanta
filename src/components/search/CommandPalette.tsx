import React, { useState, useEffect } from 'react';
import { Search, User, BookOpen, Users, Settings, X, ArrowRight, Shield, FileCheck2, Bell, DollarSign, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onSelectStudent?: (studentId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectStudent,
}) => {
  const { currentTenant } = useAuth();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentTenant) return null;

  const students = repo.getStudents(currentTenant.id);
  const teachers = repo.getTeachers(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);

  const filteredStudents = query.trim()
    ? students.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          s.admissionNo.toLowerCase().includes(query.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredTeachers = query.trim()
    ? teachers.filter(
        (t) =>
          `${t.firstName} ${t.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          t.department.toLowerCase().includes(query.toLowerCase()) ||
          t.employeeId.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const quickNav = [
    { label: 'Executive Dashboard', tab: 'dashboard', icon: BookOpen },
    { label: 'School Pulse Alerts', tab: 'pulse', icon: Shield },
    { label: 'Parent & Student Portal', tab: 'parent_portal', icon: User },
    { label: 'Teacher Workspace', tab: 'teacher_portal', icon: Users },
    { label: 'Student Directory & 360', tab: 'students', icon: User },
    { label: 'Faculty & Teachers', tab: 'teachers', icon: Users },
    { label: 'Master Timetable', tab: 'timetable', icon: BookOpen },
    { label: 'Examinations & Reports', tab: 'exams', icon: BookOpen },
    { label: 'Attendance & Leaves', tab: 'attendance', icon: Shield },
    { label: 'Fee Management', tab: 'fees', icon: Settings },
    { label: 'Admissions CRM', tab: 'crm', icon: User },
    { label: 'Transport & Fleet', tab: 'transport', icon: BookOpen },
    { label: 'Library & Resources', tab: 'library', icon: BookOpen },
    { label: 'Official Documents & TC', tab: 'certificates', icon: FileCheck2 },
    { label: 'Notices & Calendar', tab: 'notices', icon: Bell },
    { label: 'Staff Payroll & HR', tab: 'payroll', icon: DollarSign },
    { label: 'Automation Studio', tab: 'automation', icon: Settings },
    { label: 'Academics & Classes', tab: 'academics', icon: BookOpen },
    { label: 'School Settings & RBAC', tab: 'settings', icon: Settings },
    { label: 'User Manual & Guide', tab: 'manual', icon: BookOpen },
    { label: 'Public SaaS Landing & Pricing', tab: 'landing', icon: Globe },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || !query);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a student name, teacher, class or page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 text-sm">
          {/* Quick Nav */}
          {quickNav.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Navigation
              </div>
              {quickNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onNavigate(item.tab);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-teal-700 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Students Results */}
          {filteredStudents.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Students ({filteredStudents.length})
              </div>
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onNavigate('students');
                    if (onSelectStudent) onSelectStudent(s.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold">
                      {s.firstName[0]}
                      {s.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {s.firstName} {s.lastName}
                      </div>
                      <div className="text-xs text-slate-500">
                        Adm: {s.admissionNo} · Roll: {s.rollNo}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {s.attendancePercentage}% att
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Teachers Results */}
          {filteredTeachers.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Faculty & Teachers ({filteredTeachers.length})
              </div>
              {filteredTeachers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onNavigate('teachers');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-semibold">
                      {t.firstName[0]}
                      {t.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {t.firstName} {t.lastName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {t.designation} · {t.department}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{t.employeeId}</span>
                </button>
              ))}
            </div>
          )}

          {query && filteredStudents.length === 0 && filteredTeachers.length === 0 && quickNav.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              No matching records found for "{query}"
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 flex items-center justify-between">
          <span>Tenant boundary: {currentTenant.name}</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
