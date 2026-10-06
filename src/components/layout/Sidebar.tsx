import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Settings,
  PlusCircle,
  Building2,
  FileCheck2,
  Bot,
  CalendarCheck,
  Award,
  Calendar,
  UserCheck,
  Zap,
  Bus,
  Bell,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../lib/rbac';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCopilot: () => void;
  pulseCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCopilot,
  pulseCount,
}) => {
  const { currentUser } = useAuth();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const menuSections = [
    {
      title: 'Operating System',
      items: [
        {
          id: 'dashboard',
          label: 'Executive Dashboard',
          icon: LayoutDashboard,
          visible: hasPermission(currentUser, 'dashboard', 'view'),
        },
        {
          id: 'pulse',
          label: 'School Pulse',
          icon: ShieldAlert,
          badge: pulseCount > 0 ? pulseCount : undefined,
          badgeColor: 'bg-rose-500 text-white',
          visible: hasPermission(currentUser, 'pulse', 'view'),
        },
      ],
    },
    {
      title: 'ERP Foundation',
      items: [
        {
          id: 'students',
          label: 'Students & Success',
          icon: GraduationCap,
          visible: hasPermission(currentUser, 'students', 'view'),
        },
        {
          id: 'teachers',
          label: 'Teachers & Faculty',
          icon: Users,
          visible: hasPermission(currentUser, 'teachers', 'view'),
        },
        {
          id: 'academics',
          label: 'Academics & Classes',
          icon: BookOpen,
          visible: hasPermission(currentUser, 'academics', 'view'),
        },
        {
          id: 'timetable',
          label: 'Master Timetable',
          icon: Calendar,
          visible: hasPermission(currentUser, 'academics', 'view'),
        },
        {
          id: 'exams',
          label: 'Exams & Reports',
          icon: Award,
          visible: hasPermission(currentUser, 'exams', 'view'),
        },
        {
          id: 'attendance',
          label: 'Attendance & Leaves',
          icon: CalendarCheck,
          visible: hasPermission(currentUser, 'attendance', 'view'),
        },
        {
          id: 'fees',
          label: 'Fee Management',
          icon: DollarSign,
          visible: hasPermission(currentUser, 'fees', 'view'),
        },
        {
          id: 'crm',
          label: 'Admissions CRM',
          icon: UserCheck,
          visible: hasPermission(currentUser, 'crm', 'view'),
        },
        {
          id: 'transport',
          label: 'Transport & Fleet',
          icon: Bus,
          visible: hasPermission(currentUser, 'operations', 'view'),
        },
        {
          id: 'library',
          label: 'Library & Resources',
          icon: BookOpen,
          visible: hasPermission(currentUser, 'academics', 'view'),
        },
        {
          id: 'certificates',
          label: 'Official Documents & TC',
          icon: FileCheck2,
          visible: hasPermission(currentUser, 'students', 'view'),
        },
        {
          id: 'notices',
          label: 'Notices & Calendar',
          icon: Bell,
          visible: true,
        },
        {
          id: 'payroll',
          label: 'Staff Payroll & HR',
          icon: DollarSign,
          visible: hasPermission(currentUser, 'fees', 'view'),
        },
      ],
    },
    {
      title: 'Layer 3 — Automation',
      items: [
        {
          id: 'automation',
          label: 'Automation Studio',
          icon: Zap,
          visible: hasPermission(currentUser, 'operations', 'view'),
        },
      ],
    },
    {
      title: 'Dedicated Role Portals',
      items: [
        {
          id: 'parent_portal',
          label: 'Parent & Student Portal',
          icon: GraduationCap,
          visible: true,
        },
        {
          id: 'teacher_portal',
          label: 'Teacher Workspace',
          icon: Users,
          visible: true,
        },
      ],
    },
    {
      title: 'Platform & Controls',
      items: [
        {
          id: 'settings',
          label: 'School Settings & RBAC',
          icon: Settings,
          visible: hasPermission(currentUser, 'settings', 'view'),
        },
        {
          id: 'audit',
          label: 'Audit Trail',
          icon: FileCheck2,
          visible: hasPermission(currentUser, 'audit_logs', 'view'),
        },
        {
          id: 'onboarding',
          label: 'Onboarding Wizard',
          icon: PlusCircle,
          visible: ['school_owner', 'school_admin', 'super_admin'].includes(currentUser?.role || ''),
        },
        {
          id: 'manual',
          label: 'User Manual & Guide',
          icon: BookOpen,
          visible: true,
        },
        {
          id: 'landing',
          label: 'Public SaaS Landing',
          icon: Globe,
          visible: true,
        },
      ],
    },
  ];

  if (isSuperAdmin) {
    menuSections.push({
      title: 'Super Admin Portal',
      items: [
        {
          id: 'superadmin',
          label: 'Multi-School SaaS Portal',
          icon: Building2,
          visible: true,
        },
      ],
    });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-black text-slate-900 text-base shadow-sm">
          EV
        </div>
        <div>
          <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
            <span>Eduvanta</span>
            <span className="text-[10px] bg-teal-900 text-teal-300 px-1 py-0.2 rounded font-mono">SaaS</span>
          </div>
          <div className="text-[10px] text-teal-400/90 font-medium tracking-wide">
            AI-Native School OS
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuSections.map((section, idx) => {
          const visibleItems = section.items.filter((i) => i.visible !== false);
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-700 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Copilot Sidebar Card */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 mb-1.5 font-semibold text-white">
            <Bot className="w-4 h-4 text-teal-400" />
            <span>SchoolOS Copilot</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Ask questions about attendance risks, outstanding fees, and student alerts.
          </p>
          <button
            onClick={onOpenCopilot}
            className="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-[11px] font-semibold transition-colors shadow-xs"
          >
            Launch Copilot
          </button>
        </div>
      </div>

      {/* Footer Tagline */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-400 text-center">
        Run Your School. Don’t Run After Data.
      </div>
    </aside>
  );
};
