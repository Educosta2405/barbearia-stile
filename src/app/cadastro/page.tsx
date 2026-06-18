import { redirect } from "next/navigation";
import { getCurrentUser, landingPath } from "@/lib/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default async function CadastroPage() {
  const user = await getCurrentUser();
  if (user) redirect(landingPath(user.role));

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Leva menos de um minuto para começar."
    >
      <RegisterForm />
    </AuthShell>
  );
}
