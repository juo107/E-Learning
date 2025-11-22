export interface UserInfo {
  email: string;
  role: string;
  fullName?: string;
}

export const getUserInfo = (): UserInfo | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr) as UserInfo;
  } catch {
    return null;
  }
};

export const getUserRole = (): string | null => {
  const user = getUserInfo();
  return user?.role || null;
};

export const isSuperAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'SystemSuperAdmin';
};

export const isTenantAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'TenantAdmin' || role === 'SystemSuperAdmin';
};

export const isContentAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'ContentAdmin' || role === 'SystemSuperAdmin';
};

export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'SystemSuperAdmin' || role === 'TenantAdmin' || role === 'ContentAdmin';
};

