import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  Download,
  Building,
  Check,
  X,
  CreditCard,
  TrendingUp,
  FileText,
  Sparkles,
  Send,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { StaffPayrollRecord } from '../../types';
import { PayslipModal } from './PayslipModal';

export const PayrollManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Payroll records state
  const [payrollRecords, setPayrollRecords] = useState<StaffPayrollRecord[]>(() =>
    currentTenant ? repo.getStaffPayroll(currentTenant.id) : []
  );

  // Selected for Payslip Print Modal
  const [selectedForPayslip, setSelectedForPayslip] = useState<StaffPayrollRecord | null>(null);

  // New Payroll Modal State
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [payMonth, setPayMonth] = useState('September 2026');
  const [basicSalary, setBasicSalary] = useState(50000);
  const [specialAllowance, setSpecialAllowance] = useState(5000);
  const [tdsDeduction, setTdsDeduction] = useState(3500);

  // Success Feedback
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!currentTenant) return null;

  const teachers = repo.getTeachers(currentTenant.id);

  // Calculate dynamic fields for the modal
  const computedHra = Math.round(basicSalary * 0.3); // 30% HRA
  const computedDa = Math.round(basicSalary * 0.15); // 15% DA
  const computedGross = basicSalary + computedHra + computedDa + specialAllowance;
  const computedPf = Math.round(basicSalary * 0.12); // 12% EPF
  const computedProfTax = 200;
  const computedTotalDeductions = computedPf + tdsDeduction + computedProfTax;
  const computedNet = computedGross - computedTotalDeductions;

  // Filtered Payroll Records
  const filteredRecords = payrollRecords.filter((r) => {
    const matchesSearch =
      r.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || r.department.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const totalPayrollOutflow = payrollRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalGrossAcross = payrollRecords.reduce((sum, r) => sum + r.totalGrossSalary, 0);
  const totalDeductionsAcross = payrollRecords.reduce((sum, r) => sum + r.totalDeductions, 0);
  const avgFacultySalary = payrollRecords.length > 0 ? Math.round(totalPayrollOutflow / payrollRecords.length) : 0;

  const handleProcessPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    const newRecord = repo.processStaffPayroll(
      currentTenant.id,
      {
        staffId: teacher.id,
        staffName: `${teacher.firstName} ${teacher.lastName}`,
        designation: teacher.designation || 'Faculty Educator',
        department: teacher.department || 'Academic Faculty',
        month: payMonth,
        payDate: new Date().toISOString().split('T')[0],
        bankAccountNo: `HDFC-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        pfNumber: `DL/CPM/10924/${Math.floor(100 + Math.random() * 900)}`,
        panNumber: `AACPR${Math.floor(1000 + Math.random() * 9000)}B`,
        basicSalary,
        hra: computedHra,
        da: computedDa,
        specialAllowance,
        totalGrossSalary: computedGross,
        providentFund: computedPf,
        tds: tdsDeduction,
        professionalTax: computedProfTax,
        totalDeductions: computedTotalDeductions,
        netSalary: computedNet,
        paymentStatus: 'paid',
        paymentMode: 'bank_transfer',
        transactionRef: `NEFT-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
      currentUser || undefined
    );

    setPayrollRecords(repo.getStaffPayroll(currentTenant.id));
    setIsProcessModalOpen(false);
    setSelectedTeacherId('');
    setSuccessMsg(
      `Payroll processed for ${teacher.firstName} ${teacher.lastName}. Net salary of ₹${computedNet.toLocaleString()} credited.`
    );
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleBulkNeft = () => {
    setSuccessMsg('Initiated bulk direct bank transfer via NACH/NEFT portal for all active staff members.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <DollarSign className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff Payroll & Compensation</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated salary calculations (Basic, HRA, DA, EPF 12%, TDS), monthly disbursement registers, and official printable payslips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkNeft}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Disburse Monthly NEFT</span>
          </button>
          <button
            onClick={() => setIsProcessModalOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Process Salary</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monthly Net Outflow</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            ₹{totalPayrollOutflow.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-800 font-semibold block mt-1">
            Total Gross: ₹{totalGrossAcross.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Faculty & Staff on Roll</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{payrollRecords.length} Employees</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">100% On-time salary compliance</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Take-Home Pay</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            ₹{avgFacultySalary.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Teaching & Administrative staff</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Statutory Deductions (EPF & TDS)</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono text-rose-800">
            ₹{totalDeductionsAcross.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Government Tax & PF Remitted</span>
        </div>
      </div>

      {/* Controls: Search and Filter Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by staff name, designation or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700 focus:outline-hidden"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Departments' },
              { id: 'mathematics', label: 'Mathematics' },
              { id: 'science', label: 'Science' },
              { id: 'humanities', label: 'Humanities' },
              { id: 'sports', label: 'Sports & Ops' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedDept === d.id
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">Showing {filteredRecords.length} payslips</div>
      </div>

      {/* Payroll Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Staff Member & Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Pay Month</th>
                <th className="py-3 px-4">Basic Pay</th>
                <th className="py-3 px-4">Gross Earnings</th>
                <th className="py-3 px-4">Deductions (PF/TDS)</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4">Status & Mode</th>
                <th className="py-3 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{payroll.staffName}</div>
                    <div className="text-[11px] text-slate-500">{payroll.designation}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{payroll.department}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{payroll.month}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    ₹{payroll.basicSalary.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{payroll.totalGrossSalary.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                    ₹{payroll.totalDeductions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-teal-950 text-sm">
                    ₹{payroll.netSalary.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      PAID (NEFT)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedForPayslip(payroll)}
                      className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto transition-colors shadow-2xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Salary Modal */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Process Staff Compensation</span>
              </div>
              <button onClick={() => setIsProcessModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPayroll} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Select Staff Member *
                </label>
                <select
                  required
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="">-- Choose Faculty / Employee --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.designation || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Pay Month
                  </label>
                  <input
                    type="text"
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Basic Salary (₹) *
                  </label>
                  <input
                    type="number"
                    min="10000"
                    step="1000"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Special Allowance (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={specialAllowance}
                    onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    TDS Income Tax (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={tdsDeduction}
                    onChange={(e) => setTdsDeduction(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Compensation Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>HRA (30% Basic): ₹{computedHra.toLocaleString()}</span>
                  <span>DA (15% Basic): ₹{computedDa.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>EPF (12% Basic): ₹{computedPf.toLocaleString()}</span>
                  <span>Prof Tax: ₹200</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-xs">
                  <span>Total Gross: ₹{computedGross.toLocaleString()}</span>
                  <span className="text-teal-900 font-black">Net Salary: ₹{computedNet.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Disburse Salary & Payslip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Payslip Modal when selected */}
      {selectedForPayslip && (
        <PayslipModal
          payroll={selectedForPayslip}
          tenant={currentTenant}
          onClose={() => setSelectedForPayslip(null)}
        />
      )}
    </div>
  );
};
