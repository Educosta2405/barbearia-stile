import type { NextAuthConfig } from "next-auth";
import { UserRole } from "@/lib/enums";

/**
 * Config base do Auth.js — sem providers que dependem de APIs do Node,
 * para ser segura no Edge (middleware). A lógica de credenciais fica em auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    /** Controle de acesso por rota (usado pelo middleware). */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      const isAdminArea = path.startsWith("/admin");
      const needsAuth =
        isAdminArea || path.startsWith("/perfil") || path.startsWith("/agendar");

      if (isAdminArea) {
        return (
          isLoggedIn && (role === UserRole.ADMIN || role === UserRole.BARBER)
        );
      }
      if (needsAuth) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
