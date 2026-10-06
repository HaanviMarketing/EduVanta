import React from 'react';
import { Printer, X, Award, Building, CheckCircle2 } from 'lucide-react';
import { Tenant, StaffPayrollRecord } from '../../types';

interface PayslipModalProps {
  payroll: StaffPayrollRecord;
  tenant: Tenant;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ payroll, tenant, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-xs">
              Official Salary Payslip &bull; {payroll.staffName} ({payroll.month})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Payslip</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Document */}
        <div className="p-8 sm:p-12 bg-[#fffdf9] text-slate-900 font-sans relative border-4 border-slate-800 m-4 shadow-inner">
          {/* Institutional Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Building className="w-80 h-80 text-slate-900" />
          </div>

          {/* School Header */}
          <div className="text-center border-b-2 border-slate-800 pb-5 mb-6 relative z-10">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950 font-serif">
              {tenant.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Sector 12, RK Puram Institutional Area, New Delhi &bull; CBSE Affiliation No: 2130042
            </p>
            <div className="mt-3 inline-block px-5 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
              SALARY PAYSLIP &bull; {payroll.month.toUpperCase()}
            </div>
          </div>

          {/* Employee Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Employee Name:</span>
                <span className="font-bold text-slate-900">{payroll.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Designation:</span>
                <span className="font-semibold text-slate-800">{payroll.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="text-slate-800">{payroll.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Employee ID:</span>
                <span className="font-mono font-bold text-slate-900">{payroll.staffId.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Bank Account No:</span>
                <span className="font-mono font-bold text-slate-900">{payroll.bankAccountNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Provident Fund (EPF):</span>
                <span className="font-mono text-slate-800">{payroll.pfNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">PAN Card:</span>
                <span className="font-mono text-slate-800">{payroll.panNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Mode / Date:</span>
                <span className="font-medium text-slate-800">
                  {payroll.paymentMode.replace('_', ' ').toUpperCase()} ({payroll.payDate})
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Earnings and Deductions Table */}
          <div className="grid grid-cols-2 border border-slate-300 rounded-xl overflow-hidden mb-6">
            {/* Left: Earnings */}
            <div className="border-r border-slate-300">
              <div className="bg-slate-100 p-2.5 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-300 flex justify-between">
                <span>Earnings Breakdown</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-mono font-semibold">₹{payroll.basicSalary.toLocaleString()}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold">₹{payroll.hra.toLocaleString()}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-600">Dearness Allowance (DA)</span>
                  <span className="font-mono font-semibold">₹{payroll.da.toLocaleString()}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-600">Special & Performance Allowance</span>
                  <span className="font-mono font-semibold">₹{payroll.specialAllowance.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 border-t border-slate-300 font-bold text-xs flex justify-between">
                <span>Total Gross Earnings:</span>
                <span className="font-mono text-teal-900 font-bold">₹{payroll.totalGrossSalary.toLocaleString()}</span>
              </div>
            </div>

            {/* Right: Deductions */}
            <div>
              <div className="bg-slate-100 p-2.5 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-300 flex justify-between">
                <span>Deductions Breakdown</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-600">Provident Fund (EPF 12%)</span>
                  <span className="font-mono font-semibold">₹{payroll.providentFund.toLocaleString()}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-600">Tax Deducted at Source (TDS)</span>
                  <span className="font-mono font-semibold">₹{payroll.tds.toLocaleString()}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-600">Professional Tax (PT)</span>
                  <span className="font-mono font-semibold">₹{payroll.professionalTax.toLocaleString()}</span>
                </div>
                <div className="p-2.5 flex justify-between text-slate-400">
                  <span>Other Institutional Deductions</span>
                  <span className="font-mono">₹0</span>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 border-t border-slate-300 font-bold text-xs flex justify-between">
                <span>Total Deductions:</span>
                <span className="font-mono text-rose-800 font-bold">₹{payroll.totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight Box */}
          <div className="p-4 bg-teal-50 border-2 border-teal-800 rounded-xl flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 block">
                Net Disbursed Take-Home Pay
              </span>
              <span className="text-xs text-teal-700 font-medium">
                Credited via {payroll.paymentMode.replace('_', ' ').toUpperCase()} &bull; Ref: {payroll.transactionRef || 'NEFT-PROCESSED'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-teal-950 font-mono">
                ₹{payroll.netSalary.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Signature & Seal Block */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs pt-8 border-t border-slate-300">
            <div>
              <div className="h-10 flex items-end justify-center font-serif italic text-slate-500">
                {payroll.staffName.split(' ')[0]}
              </div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                Employee Signature
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-dashed border-teal-800 flex items-center justify-center text-[8px] font-bold text-teal-900 uppercase text-center p-1 leading-tight rotate-12 bg-teal-50/40">
                Finance & Accounts Seal
              </div>
              <div className="border-t border-slate-400 w-full pt-1 font-semibold text-slate-700 mt-1">
                School Bursar / Accountant
              </div>
            </div>

            <div>
              <div className="h-10 flex items-end justify-center font-serif italic text-slate-500">
                Dr. A. K. Banerjee
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                Principal & Head of Institution
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
