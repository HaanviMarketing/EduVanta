import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  UserPlus,
  Plus,
  Bot,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { SchoolPulseItem } from '../../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenCopilot: () => void;
  onSelectStudent?: (studentId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenCopilot,
  onSelectStudent,
}) => {
  const { currentTenant, currentUser } = useAuth();
  const [pulseDismissed, setPulseDismissed] = useState<string[]>([]);
  const [selectedPulseAction, setSelectedPulseAction] = useState<SchoolPulseItem | null>(null);

  if (!currentTenant) return null;

  const students = repo.getStudents(currentTenant.id);
  const teachers = repo.getTeachers(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);
  const auditLogs = repo.getAuditLogs(currentTenant.id).slice(0, 5);
  const allPulseItems = repo.getSchoolPulse(currentTenant.id);

  const activePulseItems = allPulseItems.filter((item) => !pulseDismissed.includes(item.id));

  // Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const totalTeachers = teachers.length;
  const presentTeachers = teachers.filter((t) => t.todayAttendance === 'present').length;

  const avgAttendance =
    students.length > 0
      ? (students.reduce((acc, s) => acc + s.attendancePercentage, 0) / students.length).toFixed(1)
      : '0.0';

  const totalFeeOverdue = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);
  const academicHealthIndex =
    students.length > 0
      ? (students.reduce((acc, s) => acc + s.academicAverage, 0) / students.length).toFixed(1)
      : '0.0';

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currentTenant.currency,
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const handlePulseAction = (item: SchoolPulseItem) => {
    if (item.actionType === 'view_attendance') {
      onNavigate('attendance');
    } else if (item.actionType === 'view_students') {
      onNavigate('students');
    } else if (item.actionType === 'view_fees') {
      onNavigate('fees');
    } else if (item.actionType === 'view_staff') {
      onNavigate('teachers');
    } else if (item.actionType === 'view_crm') {
      if (item.type === 'approvals') {
        onNavigate('automation');
      } else {
        onNavigate('crm');
      }
    } else {
      setSelectedPulseAction(item);
    }
  };

  const dismissPulse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPulseDismissed((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            Operational Intelligence System · AY 2026-2027
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good Morning, {currentUser?.name || 'Dr. Rajesh Sharma'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {currentTenant.name} is currently running at{' '}
            <strong className="text-slate-700 font-semibold">{avgAttendance}% attendance</strong> with all{' '}
            {classes.length} academic grades synchronized.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors"
          >
            <Bot className="w-4 h-4 text-teal-300" />
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* School Pulse Intelligence Banner */}
      <div className="bg-white rounded-xl border border-teal-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">AI School Pulse</h2>
                <span className="text-[11px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded font-medium">
                  {activePulseItems.length} Priorities Today
                </span>
              </div>
              <p className="text-xs text-teal-200/70">
                Automated detection & action recommendations requiring administrative review
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('pulse')}
            className="text-xs text-teal-300 hover:text-white flex items-center gap-1 font-medium"
          >
            <span>Full Pulse Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pulse Items List */}
        <div className="divide-y divide-slate-100">
          {activePulseItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              All operational indicators are healthy and on target today.
            </div>
          ) : (
            activePulseItems.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      item.severity === 'critical'
                        ? 'bg-rose-500'
                        : item.severity === 'warning'
                        ? 'bg-amber-500'
                        : item.severity === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-sky-500'
                    }`}
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <span>{item.title}</span>
                      {item.metric && (
                        <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                          {item.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  <button
                    onClick={() => handlePulseAction(item)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => dismissPulse(item.id, e)}
                    title="Dismiss alert"
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-500/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalStudents}
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4 this term
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>{activeStudents} active</span>
            <span>·</span>
            <span>{classes.length} grade levels</span>
          </div>
        </div>

        {/* Card 2: Faculty */}
        <div
          onClick={() => onNavigate('teachers')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-sky-500/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Teaching Faculty
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalTeachers}
            </div>
            <span className="text-xs text-slate-500">
              {presentTeachers} present today
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>1 on approved leave</span>
            <span>·</span>
            <span>100% periods covered</span>
          </div>
        </div>

        {/* Card 3: Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-500/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Daily Attendance Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {avgAttendance}%
            </div>
            <span className="text-xs text-slate-500">
              Threshold: {currentTenant.settings.minAttendancePercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                Number(avgAttendance) >= 75 ? 'bg-teal-600' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Number(avgAttendance))}%` }}
            />
          </div>
        </div>

        {/* Card 4: Overdue Fees */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-rose-500/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Outstanding Fees
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {formatCurrency(totalFeeOverdue)}
            </div>
            <span className="text-xs text-rose-600 font-semibold">
              3 accounts past due
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>88.2% collected</span>
            <span>·</span>
            <span>Automated reminders on</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Academic Insights & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Class Overview & Academic Distribution */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Classes & Roster Health
                </h3>
                <p className="text-xs text-slate-500">
                  Active student enrollment versus configured class capacity
                </p>
              </div>
              <button
                onClick={() => onNavigate('academics')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
              >
                Manage Classes
              </button>
            </div>

            <div className="space-y-3">
              {classes.map((c) => {
                const classStudents = students.filter((s) => s.classId === c.id);
                const classAvg =
                  classStudents.length > 0
                    ? (
                        classStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) /
                        classStudents.length
                      ).toFixed(1)
                    : '0';

                return (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-slate-500 text-[11px]">
                        Code: {c.code} · Capacity: {c.capacity} students
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold text-slate-800">
                          {classStudents.length} Enrolled
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {Math.round((classStudents.length / c.capacity) * 100)}% capacity
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-semibold text-teal-700">
                          {classAvg}%
                        </div>
                        <div className="text-[11px] text-slate-400">Att. rate</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice / Student Success Highlight */}
          <div className="bg-teal-900 text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">
                  Student Success Engine Active
                </span>
              </div>
              <h4 className="text-base font-bold">
                Needs Attention: 2 Students Require Academic Consultation
              </h4>
              <p className="text-xs text-teal-200/80 max-w-xl leading-relaxed">
                Aarav Kapoor (Grade 10A) and Zoya Farooqui (Grade 9A) have explainable indicators for attendance and subject regression.
              </p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="px-4 py-2 bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold rounded-lg transition-colors shrink-0 shadow-xs"
            >
              Open Student 360
            </button>
          </div>
        </div>

        {/* Right (1 col): Audit Trail Stream & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Operations</h3>
                <p className="text-xs text-slate-500">Live tenant audit log</p>
              </div>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-medium text-slate-700">{log.userName}</span>
                    <span className="font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-snug">{log.details}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded uppercase font-semibold">
                      {log.module}
                    </span>
                    <span>·</span>
                    <span className="capitalize">{log.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School Affiliation & Info Widget */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <span>{currentTenant.name}</span>
              <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                {currentTenant.code}
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Affiliation: {currentTenant.board} Board · Academic Session 2026-2027
            </div>
            <div className="text-slate-500 text-[11px]">
              {currentTenant.address.city}, {currentTenant.address.state}
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Plan:</span>
              <span className="font-semibold text-teal-700 capitalize">{currentTenant.plan} Edition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
