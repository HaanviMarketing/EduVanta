import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tenant, Role } from '../types';
import { repo } from '../lib/storage';

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  tenants: Tenant[];
  users: User[];
  isLoading: boolean;
  switchTenant: (tenantId: string) => void;
  switchRole: (role: Role) => void;
  switchUser: (userId: string) => void;
  login: (email: string) => boolean;
  logout: () => void;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = () => {
    const allTenants = repo.getTenants();
    setTenants(allTenants);

    const savedTenantId = localStorage.getItem('schoolos_current_tenant_id_v1');
    const selectedTenant =
      allTenants.find((t) => t.id === savedTenantId) || allTenants[0] || null;
    setCurrentTenant(selectedTenant);

    if (selectedTenant) {
      const allUsers = repo.getUsers(selectedTenant.id);
      setUsers(allUsers);

      const savedUserId = localStorage.getItem('schoolos_current_user_id_v1');
      const selectedUser =
        allUsers.find((u) => u.id === savedUserId) ||
        allUsers.find((u) => u.role === 'principal') ||
        allUsers[0] ||
        null;
      setCurrentUser(selectedUser);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const switchTenant = (tenantId: string) => {
    const targetTenant = tenants.find((t) => t.id === tenantId);
    if (!targetTenant) return;

    setCurrentTenant(targetTenant);
    localStorage.setItem('schoolos_current_tenant_id_v1', tenantId);

    const tenantUsers = repo.getUsers(tenantId);
    setUsers(tenantUsers);

    // Switch to principal or owner of that tenant
    const defaultUser =
      tenantUsers.find((u) => u.role === 'principal') ||
      tenantUsers.find((u) => u.role === 'school_admin') ||
      tenantUsers[0] ||
      null;
    setCurrentUser(defaultUser);
    if (defaultUser) {
      localStorage.setItem('schoolos_current_user_id_v1', defaultUser.id);
    }
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('schoolos_current_user_id_v1', user.id);
    }
  };

  const switchRole = (role: Role) => {
    if (!currentTenant) return;
    const match = users.find((u) => u.role === role);
    if (match) {
      setCurrentUser(match);
      localStorage.setItem('schoolos_current_user_id_v1', match.id);
    } else {
      // Create a temporary mock role user if not exists
      const tempUser: User = {
        id: `user-temp-${role}`,
        email: `${role}@${currentTenant.slug}.edu`,
        name: `Demo ${role.replace('_', ' ').toUpperCase()}`,
        role,
        tenantId: currentTenant.id,
        status: 'active',
      };
      setCurrentUser(tempUser);
    }
  };

  const login = (email: string): boolean => {
    const allUsers = repo.getUsers();
    const user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('schoolos_current_user_id_v1', user.id);
      const tenant = repo.getTenantById(user.tenantId);
      if (tenant) {
        setCurrentTenant(tenant);
        localStorage.setItem('schoolos_current_tenant_id_v1', tenant.id);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('schoolos_current_user_id_v1');
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTenant,
        tenants,
        users,
        isLoading,
        switchTenant,
        switchRole,
        switchUser,
        login,
        logout,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
