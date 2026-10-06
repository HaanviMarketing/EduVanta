import { Role, ModuleName, PermissionAction, User } from '../types';

/**
 * Standard Default Role-Based Access Matrix
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Record<ModuleName, PermissionAction[]>> = {
  super_admin: {
    dashboard: ['view', 'export'],
    pulse: ['view', 'export'],
    students: ['view', 'create', 'edit', 'delete', 'export', 'print'],
    teachers: ['view', 'create', 'edit', 'delete', 'export', 'print'],
    academics: ['view', 'create', 'edit', 'delete', 'configure'],
    attendance: ['view', 'create', 'edit', 'export'],
    exams: ['view', 'create', 'edit', 'delete', 'approve'],
    fees: ['view', 'create', 'edit', 'delete', 'approve', 'export'],
    crm: ['view', 'create', 'edit', 'delete', 'export'],
    operations: ['view', 'create', 'edit', 'delete'],
    copilot: ['view'],
    settings: ['view', 'edit', 'configure'],
    audit_logs: ['view', 'export'],
  },
  school_owner: {
    dashboard: ['view', 'export'],
    pulse: ['view', 'export'],
    students: ['view', 'create', 'edit', 'delete', 'export', 'print'],
    teachers: ['view', 'create', 'edit', 'delete', 'export', 'print'],
    academics: ['view', 'create', 'edit', 'delete', 'configure'],
    attendance: ['view', 'create', 'edit', 'export'],
    exams: ['view', 'create', 'edit', 'delete', 'approve'],
    fees: ['view', 'create', 'edit', 'delete', 'approve', 'export'],
    crm: ['view', 'create', 'edit', 'delete', 'export'],
    operations: ['view', 'create', 'edit', 'delete'],
    copilot: ['view'],
    settings: ['view', 'edit', 'configure'],
    audit_logs: ['view', 'export'],
  },
  school_admin: {
    dashboard: ['view', 'export'],
    pulse: ['view', 'export'],
    students: ['view', 'create', 'edit', 'delete', 'export', 'print'],
    teachers: ['view', 'create', 'edit', 'delete', 'export', 'print'],
    academics: ['view', 'create', 'edit', 'delete', 'configure'],
    attendance: ['view', 'create', 'edit', 'export'],
    exams: ['view', 'create', 'edit', 'approve', 'export'],
    fees: ['view', 'create', 'edit', 'export'],
    crm: ['view', 'create', 'edit', 'export'],
    operations: ['view', 'create', 'edit'],
    copilot: ['view'],
    settings: ['view', 'edit'],
    audit_logs: ['view', 'export'],
  },
  principal: {
    dashboard: ['view', 'export'],
    pulse: ['view', 'export'],
    students: ['view', 'create', 'edit', 'export', 'print'],
    teachers: ['view', 'create', 'edit', 'export', 'print'],
    academics: ['view', 'create', 'edit', 'configure'],
    attendance: ['view', 'create', 'edit', 'export'],
    exams: ['view', 'create', 'edit', 'approve', 'export'],
    fees: ['view', 'export'],
    crm: ['view', 'create', 'edit'],
    operations: ['view', 'create', 'edit'],
    copilot: ['view'],
    settings: ['view'],
    audit_logs: ['view', 'export'],
  },
  vice_principal: {
    dashboard: ['view', 'export'],
    pulse: ['view', 'export'],
    students: ['view', 'create', 'edit', 'export', 'print'],
    teachers: ['view', 'export', 'print'],
    academics: ['view', 'create', 'edit'],
    attendance: ['view', 'create', 'edit', 'export'],
    exams: ['view', 'create', 'edit', 'approve', 'export'],
    fees: ['view'],
    crm: ['view', 'create'],
    operations: ['view'],
    copilot: ['view'],
    settings: ['view'],
    audit_logs: ['view'],
  },
  accountant: {
    dashboard: ['view'],
    pulse: ['view'],
    students: ['view', 'export'],
    teachers: ['view'],
    academics: ['view'],
    attendance: ['view'],
    exams: [],
    fees: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'print'],
    crm: ['view'],
    operations: ['view'],
    copilot: ['view'],
    settings: ['view'],
    audit_logs: ['view'],
  },
  class_teacher: {
    dashboard: ['view'],
    pulse: ['view'],
    students: ['view', 'create', 'edit', 'export', 'print'],
    teachers: ['view'],
    academics: ['view'],
    attendance: ['view', 'create', 'edit', 'export'],
    exams: ['view', 'create', 'edit', 'export', 'print'],
    fees: ['view'],
    crm: [],
    operations: ['view'],
    copilot: ['view'],
    settings: [],
    audit_logs: [],
  },
  teacher: {
    dashboard: ['view'],
    pulse: ['view'],
    students: ['view', 'export'],
    teachers: ['view'],
    academics: ['view'],
    attendance: ['view', 'create', 'edit'],
    exams: ['view', 'create', 'edit'],
    fees: [],
    crm: [],
    operations: [],
    copilot: ['view'],
    settings: [],
    audit_logs: [],
  },
  parent: {
    dashboard: ['view'],
    pulse: [],
    students: ['view', 'print'],
    teachers: ['view'],
    academics: ['view'],
    attendance: ['view'],
    exams: ['view', 'print'],
    fees: ['view', 'print'],
    crm: [],
    operations: [],
    copilot: ['view'],
    settings: [],
    audit_logs: [],
  },
  student: {
    dashboard: ['view'],
    pulse: [],
    students: ['view'],
    teachers: ['view'],
    academics: ['view'],
    attendance: ['view'],
    exams: ['view'],
    fees: ['view'],
    crm: [],
    operations: [],
    copilot: ['view'],
    settings: [],
    audit_logs: [],
  },
  staff: {
    dashboard: ['view'],
    pulse: [],
    students: ['view'],
    teachers: ['view'],
    academics: ['view'],
    attendance: ['view'],
    exams: [],
    fees: [],
    crm: [],
    operations: ['view', 'create', 'edit'],
    copilot: ['view'],
    settings: [],
    audit_logs: [],
  },
};

/**
 * Checks if a user has a specific permission for a module
 */
export function hasPermission(
  user: User | null | undefined,
  module: ModuleName,
  action: PermissionAction
): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;

  // Check custom user overrides first
  if (user.customPermissions && user.customPermissions[module]) {
    return user.customPermissions[module]!.includes(action);
  }

  // Fallback to role defaults
  const permissions = DEFAULT_ROLE_PERMISSIONS[user.role]?.[module] || [];
  return permissions.includes(action);
}

export function getRoleDisplayName(role: Role): string {
  const map: Record<Role, string> = {
    super_admin: 'Super Admin (Platform)',
    school_owner: 'School Owner / Trust',
    school_admin: 'School Administrator',
    principal: 'Principal',
    vice_principal: 'Vice Principal',
    accountant: 'Chief Accountant',
    teacher: 'Teacher / Faculty',
    class_teacher: 'Class Teacher',
    parent: 'Parent / Guardian',
    student: 'Student',
    staff: 'Office Staff',
  };
  return map[role] || role;
}
