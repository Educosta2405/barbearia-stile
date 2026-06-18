"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createBarberAction, toggleBarberAction } from "@/server/actions/admin";

type Barber = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  active: boolean;
  appointments: number;
};

export function BarberManager({ barbers }: { barbers: Barber[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  function create(formData: FormData) {
    setError(undefined);
    start(async () => {
      const res = await createBarberAction({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        bio: (formData.get("bio") as string) || undefined,
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else setError(res.error);
    });
  }

  function toggle(id: string, active: boolean) {
    start(async () => {
      await toggleBarberAction(id, active);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-silver-bright">Barbeiros</h2>
        <Button size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? "Fechar" : "+ Novo barbeiro"}
        </Button>
      </div>

      {open && (
        <form
          action={create}
          className="grid gap-3 rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-4 sm:grid-cols-2"
        >
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Senha de acesso</Label>
            <Input id="password" name="password" type="text" required />
          </div>
          <div>
            <Label htmlFor="bio">Bio (opcional)</Label>
            <Input id="bio" name="bio" />
          </div>
          {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Salvando..." : "Criar barbeiro"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {barbers.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-nardo-line/50 bg-ink-800/60 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-nardo to-ink-600 font-display font-semibold text-silver-bright">
                {b.name.charAt(0)}
              </span>
              <div>
                <p className="font-medium text-silver-bright">
                  {b.name}{" "}
                  {!b.active && (
                    <span className="text-xs text-silver-dim">(inativo)</span>
                  )}
                </p>
                <p className="text-sm text-silver-dim">
                  {b.email} · {b.appointments} atendimentos
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant={b.active ? "ghost" : "outline"}
              disabled={pending}
              onClick={() => toggle(b.id, !b.active)}
            >
              {b.active ? "Desativar" : "Ativar"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
