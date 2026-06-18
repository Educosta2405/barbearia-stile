import { redirect } from "next/navigation";
import { getCurrentUser, landingPath } from "@/lib/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(landingPath(user.role));

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta para agendar.">
      <LoginForm />
    </AuthShell>
  );
}
