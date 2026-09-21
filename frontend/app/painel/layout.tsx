import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function PainelLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-content px-6 pb-16 pt-28">{children}</main>
      </div>
    </AuthGuard>
  );
}
