"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { registerAction, type FormState } from "@/server/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Criando conta..." : "Criar conta"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    registerAction,
    {},
  );
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="animate-fade-in rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" autoComplete="name" required />
        {fe.name && <p className="mt-1 text-xs text-red-300">{fe.name}</p>}
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        {fe.email && <p className="mt-1 text-xs text-red-300">{fe.email}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(11) 90000-0000" />
        {fe.phone && <p className="mt-1 text-xs text-red-300">{fe.phone}</p>}
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        {fe.password && <p className="mt-1 text-xs text-red-300">{fe.password}</p>}
      </div>
      <SubmitButton />
      <p className="pt-2 text-center text-sm text-silver-dim">
        Já tem conta?{" "}
        <Link href="/login" className="text-gold-glow hover:text-gold-soft">
          Entrar
        </Link>
      </p>
    </form>
  );
}
