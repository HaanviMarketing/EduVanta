import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Send,
  CreditCard,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Student } from '../../types';

export const FeeManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  if (!currentTenant) return null;

  const students = repo.getStudents(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);

  const totalFeeCollected = 425000;
  const totalOverdue = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);
  const defaulterCount = students.filter((s) => s.feeBalance > 0).length;

  const filteredStudents = students.filter((s) => {
    const matchesQuery =
      query === '' ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(query.toLowerCase());

    const matchesOverdue = !filterOverdue || s.feeBalance > 0;

    return matchesQuery && matchesOverdue;
  });

  const sendReminder = (student: Student) => {
    setReminderSent(student.id);
    repo.logAudit({
      tenantId: currentTenant.id,
      userId: currentUser?.id || 'accountant',
      userName: currentUser?.name || 'Accountant',
      userRole: currentUser?.role || 'accountant',
      action: 'update',
      module: 'fees',
      recordId: student.id,
      details: `Dispatched automated WhatsApp payment reminder link to parent ${student.parentGuardian.fatherName} (${student.parentGuardian.fatherPhone}) for balance ₹${student.feeBalance}`,
    });

    setTimeout(() => setReminderSent(null), 3500);
  };

  const recordPayment = (student: Student) => {
    const prevBal = student.feeBalance;
    repo.updateStudent(
      currentTenant.id,
      student.id,
      {
        feeBalance: 0,
        riskStatus: student.riskStatus === 'needs_attention' && student.attendancePercentage >= 75 ? 'stable' : student.riskStatus,
      },
      currentUser || undefined
    );

    repo.logAudit({
      tenantId: currentTenant.id,
      userId: currentUser?.id || 'accountant',
      userName: currentUser?.name || 'Accountant',
      userRole: currentUser?.role || 'accountant',
      action: 'create',
      module: 'fees',
      recordId: student.id,
      details: `Recorded full fee clearance of ₹${prevBal} for ${student.firstName} ${student.lastName} via UPI/Online Portal`,
    });

    // Force re-render
    window.location.hash = `fee-refresh-${Date.now()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fee Management & Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tuition Collections · Overdue Account Tracking · Automated Parent WhatsApp Reminders
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Overdue Balance
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600">
            ₹{totalOverdue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {defaulterCount} student accounts
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Term Collection Target
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            ₹{(totalFeeCollected + totalOverdue).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {Math.round((totalFeeCollected / (totalFeeCollected + totalOverdue)) * 100)}% Collected
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Late Fine Policy
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            ₹{currentTenant.settings.feeLateFinePerDay}/day
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Automated statutory grace period: 7 days
          </div>
        </div>
      </div>

      {/* Table & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or admission number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={filterOverdue}
              onChange={(e) => setFilterOverdue(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Show Only Overdue Accounts ({defaulterCount})</span>
          </label>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Parent / Contact</th>
              <th className="py-3 px-4">Outstanding Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((s) => {
              const cls = classes.find((c) => c.id === s.classId);
              return (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {s.admissionNo} · Roll: {s.rollNo}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{cls?.name}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{s.parentGuardian.fatherName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{s.parentGuardian.fatherPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-sm">
                    {s.feeBalance > 0 ? (
                      <span className="text-rose-600">₹{s.feeBalance.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-emerald-600">₹0</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {s.feeBalance > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                        Overdue
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        Settled
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {s.feeBalance > 0 && (
                        <>
                          <button
                            onClick={() => sendReminder(s)}
                            disabled={reminderSent === s.id}
                            className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-semibold rounded text-[11px] transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>{reminderSent === s.id ? 'Dispatched!' : 'Send WhatsApp'}</span>
                          </button>

                          <button
                            onClick={() => recordPayment(s)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] transition-colors"
                          >
                            Record Pay
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
