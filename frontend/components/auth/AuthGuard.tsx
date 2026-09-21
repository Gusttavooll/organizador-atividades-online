"use client";

import type { ReactNode } from "react";

/**
 * Placeholder: hoje deixa todo o conteúdo passar direto. Quando a
 * autenticação real for integrada, este componente deve redirecionar para
 * o login quando `useAuth().isAuthenticated` for falso.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
