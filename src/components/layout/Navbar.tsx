import React, { useState } from 'react';
import {
  Search,
  Bot,
  Building,
  ChevronDown,
  Shield,
  FileText,
  User,
  PlusCircle,
  Check,
  Sparkles,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { getRoleDisplayName } from '../../lib/rbac';

interface NavbarProps {
  onOpenCommand: () => void;
  onOpenCopilot: () => void;
  onOpenAuditLogs: () => void;
  onStartOnboarding: () => void;
  onOpenLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommand,
  onOpenCopilot,
  onOpenAuditLogs,
  onStartOnboarding,
  onOpenLanding,
}) => {
  const { currentTenant, currentUser, tenants, switchTenant, switchRole } = useAuth();
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const availableRoles: Role[] = [
    'principal',
    'school_owner',
    'school_admin',
    'class_teacher',
    'teacher',
    'accountant',
    'parent',
    'super_admin',
  ];

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: School Selector & Branding */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left border border-slate-200/60"
          >
            {currentTenant?.logoUrl ? (
              <img
                src={currentTenant.logoUrl}
                alt={currentTenant.name}
                className="w-8 h-8 rounded-md object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
                {currentTenant?.name[0] || 'S'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 tracking-tight">
                  {currentTenant?.name || 'SchoolOS'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <span>{currentTenant?.board || 'CBSE'}</span>
                <span>·</span>
                <span>AY 2026-2027</span>
              </div>
            </div>
          </button>

          {/* Tenant Dropdown */}
          {showTenantMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active School
              </div>
              {tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    switchTenant(t.id);
                    setShowTenantMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors ${
                    t.id === currentTenant?.id ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="truncate max-w-[170px]">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.board} · {t.code}</div>
                    </div>
                  </div>
                  {t.id === currentTenant?.id && <Check className="w-4 h-4 text-teal-700" />}
                </button>
              ))}

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={() => {
                    setShowTenantMenu(false);
                    onStartOnboarding();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-teal-700 hover:bg-teal-50 font-medium transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-teal-600" />
                  <span>Onboard New School...</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Global Search Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            <span className="text-slate-500">Search students, teachers, classes...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Role Switcher Demo Control */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-colors"
            title="Switch authenticated role for testing RBAC"
          >
            <Shield className="w-3.5 h-3.5 text-teal-700" />
            <span className="font-medium hidden sm:inline">Role:</span>
            <span className="font-semibold text-slate-900">{getRoleDisplayName(currentUser?.role || 'principal').split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulate Role (RBAC)
              </div>
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-slate-50 transition-colors ${
                    role === currentUser?.role ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span>{getRoleDisplayName(role)}</span>
                  {role === currentUser?.role && <Check className="w-3.5 h-3.5 text-teal-700" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Public SaaS Portal Landing Link */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-50 border border-teal-200/70 rounded-lg transition-colors cursor-pointer"
            title="View Public SaaS Landing Page & Pricing"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public SaaS</span>
          </button>
        )}

        {/* Audit Logs Trigger */}
        <button
          onClick={onOpenAuditLogs}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="View Tenant Audit Trail"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* SchoolOS Copilot AI Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>Copilot</span>
        </button>

        {/* User Profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
              {currentUser?.name[0] || 'U'}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
              {currentUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-slate-500 capitalize">
              {currentUser?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
