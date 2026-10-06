import React, { useState } from 'react';
import {
  Settings,
  Building,
  Palette,
  Shield,
  Clock,
  Check,
  Award,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { DEFAULT_ROLE_PERMISSIONS, getRoleDisplayName } from '../../lib/rbac';
import { Role, ModuleName } from '../../types';

export const SchoolSettings: React.FC = () => {
  const { currentTenant, currentUser, refreshData } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'branding' | 'rules' | 'grading' | 'rbac'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentTenant) return null;

  const [profileData, setProfileData] = useState({
    name: currentTenant.name,
    code: currentTenant.code,
    board: currentTenant.board,
    tagline: currentTenant.tagline || '',
    email: currentTenant.email,
    phone: currentTenant.phone,
    website: currentTenant.website || '',
    street: currentTenant.address.street,
    city: currentTenant.address.city,
    state: currentTenant.address.state,
    pincode: currentTenant.address.pincode,
  });

  const [brandingData, setBrandingData] = useState({
    logoUrl: currentTenant.logoUrl || '',
    primaryColor: currentTenant.branding.primaryColor,
    secondaryColor: currentTenant.branding.secondaryColor,
  });

  const [rulesData, setRulesData] = useState({
    minAttendancePercent: currentTenant.settings.minAttendancePercent,
    attendanceAlertThreshold: currentTenant.settings.attendanceAlertThreshold,
    feeLateFinePerDay: currentTenant.settings.feeLateFinePerDay,
    allowParentLeaveApplication: currentTenant.settings.allowParentLeaveApplication,
    enableWhatsAppAlerts: currentTenant.settings.enableWhatsAppAlerts,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    repo.updateTenant(currentTenant.id, {
      name: profileData.name,
      code: profileData.code,
      board: profileData.board as any,
      tagline: profileData.tagline,
      email: profileData.email,
      phone: profileData.phone,
      website: profileData.website,
      address: {
        ...currentTenant.address,
        street: profileData.street,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
      },
    });

    repo.logAudit({
      tenantId: currentTenant.id,
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'school_admin',
      action: 'update',
      module: 'settings',
      details: 'Updated School Profile & Affiliation information',
    });

    setSavedSuccess(true);
    refreshData();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    repo.updateTenant(currentTenant.id, {
      logoUrl: brandingData.logoUrl,
      branding: {
        ...currentTenant.branding,
        primaryColor: brandingData.primaryColor,
        secondaryColor: brandingData.secondaryColor,
      },
    });

    setSavedSuccess(true);
    refreshData();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    repo.updateTenant(currentTenant.id, {
      settings: {
        ...currentTenant.settings,
        minAttendancePercent: Number(rulesData.minAttendancePercent),
        attendanceAlertThreshold: Number(rulesData.attendanceAlertThreshold),
        feeLateFinePerDay: Number(rulesData.feeLateFinePerDay),
        allowParentLeaveApplication: rulesData.allowParentLeaveApplication,
        enableWhatsAppAlerts: rulesData.enableWhatsAppAlerts,
      },
    });

    setSavedSuccess(true);
    refreshData();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const rolesList: Role[] = [
    'super_admin',
    'school_owner',
    'school_admin',
    'principal',
    'vice_principal',
    'class_teacher',
    'teacher',
    'accountant',
    'parent',
    'student',
  ];

  const modulesList: ModuleName[] = [
    'dashboard',
    'pulse',
    'students',
    'teachers',
    'academics',
    'attendance',
    'exams',
    'fees',
    'settings',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">School Configuration & RBAC</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tenant Settings · Institutional Rules · Role Permissions Matrix · {currentTenant.name}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex flex-wrap gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>School Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Branding & Themes</span>
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Attendance & Fine Rules</span>
        </button>
        <button
          onClick={() => setActiveTab('grading')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'grading'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Grading Scale</span>
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'rbac'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RBAC Matrix</span>
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-3xl text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">School Legal Name *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">School Code *</label>
              <input
                type="text"
                value={profileData.code}
                onChange={(e) => setProfileData({ ...profileData, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Educational Board</label>
              <select
                value={profileData.board}
                onChange={(e) => setProfileData({ ...profileData, board: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              >
                <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                <option value="ICSE">ICSE (CISCE)</option>
                <option value="IB">IB (International Baccalaureate)</option>
                <option value="Cambridge">Cambridge International</option>
                <option value="State Board">State Board</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={profileData.tagline}
                onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={profileData.street}
                onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">State / Province</label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Branding */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-xl text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">School Logo URL</label>
            <input
              type="url"
              value={brandingData.logoUrl}
              onChange={(e) => setBrandingData({ ...brandingData, logoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
            />
            {brandingData.logoUrl && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <img
                  src={brandingData.logoUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <span className="text-slate-500">Logo Preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Primary Theme Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandingData.primaryColor}
                onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={brandingData.primaryColor}
                onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Branding</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Attendance & Rules */}
      {activeTab === 'rules' && (
        <form onSubmit={handleSaveRules} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-xl text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Minimum Statutory Attendance (%)
            </label>
            <input
              type="number"
              value={rulesData.minAttendancePercent}
              onChange={(e) => setRulesData({ ...rulesData, minAttendancePercent: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 font-mono"
              min="50"
              max="100"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Students falling below this threshold are flagged in the School Pulse.
            </p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Late Fee Fine Per Day (₹)
            </label>
            <input
              type="number"
              value={rulesData.feeLateFinePerDay}
              onChange={(e) => setRulesData({ ...rulesData, feeLateFinePerDay: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 font-mono"
              min="0"
            />
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={rulesData.allowParentLeaveApplication}
                onChange={(e) => setRulesData({ ...rulesData, allowParentLeaveApplication: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Allow Parents to submit leave requests digitally via Parent Portal</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={rulesData.enableWhatsAppAlerts}
                onChange={(e) => setRulesData({ ...rulesData, enableWhatsAppAlerts: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Enable automated WhatsApp dispatch for absent notifications</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Institutional Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Grading Scale */}
      {activeTab === 'grading' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden max-w-3xl">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Grading & Score Matrix</h3>
              <p className="text-xs text-slate-500">Configured for {currentTenant.board} curriculum</p>
            </div>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="p-3">Grade</th>
                <th className="p-3">Score Range</th>
                <th className="p-3">GPA Equivalent</th>
                <th className="p-3">Evaluation Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentTenant.settings.gradingScale.map((g, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-teal-800">{g.grade}</td>
                  <td className="p-3 font-mono">
                    {g.minScore}% - {g.maxScore}%
                  </td>
                  <td className="p-3 font-mono font-semibold">{g.gpa}</td>
                  <td className="p-3 text-slate-700">{g.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: RBAC Matrix Viewer */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-500">
              Enforced across frontend UI, server API routes, and database query layers
            </p>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3 sticky left-0 bg-slate-50">Role</th>
                {modulesList.map((m) => (
                  <th key={m} className="p-3 capitalize">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rolesList.map((role) => (
                <tr key={role} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900 sticky left-0 bg-white">
                    {getRoleDisplayName(role)}
                  </td>
                  {modulesList.map((mod) => {
                    const perms = DEFAULT_ROLE_PERMISSIONS[role]?.[mod] || [];
                    const hasAccess = perms.length > 0;
                    return (
                      <td key={mod} className="p-3">
                        {hasAccess ? (
                          <div className="flex flex-wrap gap-1">
                            {perms.map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.2 bg-teal-50 text-teal-800 border border-teal-200/60 rounded text-[9px] font-mono font-medium"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-300 font-mono text-[10px]">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
