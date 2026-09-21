"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface ProfessorAutenticado {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextValue {
  professor: ProfessorAutenticado | null;
  isAuthenticated: boolean;
  login: (professor: ProfessorAutenticado) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [professor, setProfessor] = useState<ProfessorAutenticado | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      professor,
      isAuthenticated: professor !== null,
      login: setProfessor,
      logout: () => setProfessor(null),
    }),
    [professor],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
