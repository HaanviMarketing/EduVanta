import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  Users,
  ShieldAlert,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Search,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { Tenant } from '../../types';

interface SuperAdminPortalProps {
  onStartOnboarding: () => void;
}

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({ onStartOnboarding }) => {
  const { tenants, switchTenant, refreshData } = useAuth();
  const [query, setQuery] = useState('');

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.code.toLowerCase().includes(query.toLowerCase()) ||
      t.board.toLowerCase().includes(query.toLowerCase())
  );

  const totalSchools = tenants.length;
  const activeSchools = tenants.filter((t) => t.subscriptionStatus === 'active').length;
  const totalStudentsAcrossPlatform = tenants.reduce(
    (acc, t) => acc + repo.getStudents(t.id).length,
    0
  );
  const totalTeachersAcrossPlatform = tenants.reduce(
    (acc, t) => acc + repo.getTeachers(t.id).length,
    0
  );

  const mrr = tenants.length * 15000;
  const arr = mrr * 12;

  const toggleStatus = (tenant: Tenant) => {
    const nextStatus = tenant.subscriptionStatus === 'active' ? 'suspended' : 'active';
    repo.updateTenant(tenant.id, { subscriptionStatus: nextStatus });
    refreshData();
  };

  const changePlan = (tenant: Tenant, plan: Tenant['plan']) => {
    repo.updateTenant(tenant.id, { plan });
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Platform Owner · Multi-Tenant SaaS Command Center</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Super Admin Platform Portal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet management, subscription MRR/ARR, tenant isolation boundaries, and feature provisioning.
          </p>
        </div>

        <button
          onClick={onStartOnboarding}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New School</span>
        </button>
      </div>

      {/* SaaS Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Total Schools (Tenants)</span>
            <Building2 className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalSchools}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {activeSchools} Active · 0 Suspended
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Platform Monthly Run Rate (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ₹{mrr.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ARR: ₹{arr.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Total Managed Students</span>
            <GraduationCap className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {totalStudentsAcrossPlatform}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {tenants.length} isolated databases
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Total Faculty Records</span>
            <Users className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {totalTeachersAcrossPlatform}
          </div>
          <div className="text-xs text-slate-500 mt-1">Active educators</div>
        </div>
      </div>

      {/* Tenant Fleet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search school by name, code, board..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-teal-600"
            />
          </div>
          <span className="text-xs text-slate-500">
            Total {filteredTenants.length} School Tenants
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">School Tenant</th>
              <th className="py-3 px-4">Board & Code</th>
              <th className="py-3 px-4">Enrolled Students</th>
              <th className="py-3 px-4">Subscription Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTenants.map((t) => {
              const studentCount = repo.getStudents(t.id).length;
              const teacherCount = repo.getTeachers(t.id).length;

              return (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.email} · {t.address.city}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-700">{t.board}</div>
                    <div className="font-mono text-[10px] text-slate-400">{t.code}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium">
                    {studentCount} Students · {teacherCount} Faculty
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={t.plan}
                      onChange={(e) => changePlan(t, e.target.value as any)}
                      className="px-2 py-1 border border-slate-200 rounded font-semibold capitalize bg-white text-teal-800"
                    >
                      <option value="starter">Starter</option>
                      <option value="growth">Growth</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.subscriptionStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {t.subscriptionStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => switchTenant(t.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] transition-colors"
                    >
                      Switch Tenant
                    </button>

                    <button
                      onClick={() => toggleStatus(t)}
                      className={`px-2.5 py-1 font-semibold rounded text-[11px] transition-colors ${
                        t.subscriptionStatus === 'active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {t.subscriptionStatus === 'active' ? 'Suspend' : 'Activate'}
                    </button>
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
