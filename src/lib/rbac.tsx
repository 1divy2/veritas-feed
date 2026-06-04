import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "researcher" | "analyst" | "admin";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  hasRole: (roles: Role[]) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  // Default to admin for demonstration purposes
  const [role, setRole] = useState<Role>("admin");

  const hasRole = (roles: Role[]) => {
    return roles.includes(role);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, hasRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
