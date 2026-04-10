/**
 * Get localized label for a role
 * This is a pure utility function safe for Client Components
 * @param role - Role value ('admin', 'user', or 'agent')
 * @param dict - Dictionary object
 * @returns Localized role label
 */
export const getRoleLabel = (
  role: 'admin' | 'user' | 'agent',
  dict?: any
): string => {
  if (!dict?.roles) {
    // Fallback to English if dict not provided
    const fallback: Record<string, string> = {
      admin: 'Administrator',
      user: 'User',
      agent: 'Agent',
    };
    return fallback[role] || role;
  }
  
  return dict.roles[role] || role;
};
