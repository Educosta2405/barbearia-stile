import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Middleware de proteção de rotas usando a config edge-safe.
export default NextAuth(authConfig).auth;

export const config = {
  // Protege áreas autenticadas; ignora assets e a própria API de auth.
  matcher: ["/admin/:path*", "/perfil/:path*", "/agendar/:path*"],
};
