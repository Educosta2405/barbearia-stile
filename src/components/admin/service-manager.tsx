"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, formatDuration } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import {
  createServiceAction,
  updateServiceAction,
  toggleServiceAction,
} from "@/server/actions/admin";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  active: boolean;
};

export function ServiceManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [error, setError] = useState<string>();

  function save(formData: FormData, id?: string) {
    setError(undefined);
    const input = {
      name: formData.get("name") as string,
      durationMinutes: Number(formData.get("durationMinutes")),
      priceCents: Math.round(Number(formData.get("price")) * 100),
    };
    start(async () => {
      const res = id
        ? await updateServiceAction(id, input)
        : await createServiceAction(input);
      if (res.ok) {
        setEditing(null);
        router.refresh();
      } else setError(res.error);
    });
  }

  function toggle(id: string, active: boolean) {
    start(async () => {
      await toggleServiceAction(id, active);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-silver-bright">Serviços</h2>
        <Button size="sm" onClick={() => setEditing(editing === "new" ? null : "new")}>
          {editing === "new" ? "Fechar" : "+ Novo serviço"}
        </Button>
      </div>

      {editing === "new" && (
        <ServiceForm onSubmit={(fd) => save(fd)} pending={pending} error={error} />
      )}

      <div className="space-y-2">
        {services.map((s) =>
          editing === s.id ? (
            <ServiceForm
              key={s.id}
              service={s}
              onSubmit={(fd) => save(fd, s.id)}
              pending={pending}
              error={error}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-nardo-line/50 bg-ink-800/60 p-4"
            >
              <div>
                <p className="font-medium text-silver-bright">
                  {s.name}{" "}
                  {!s.active && <span className="text-xs text-silver-dim">(inativo)</span>}
                </p>
                <p className="text-sm text-silver-dim">
                  {formatDuration(s.durationMinutes)} · {formatPrice(s.priceCents)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(s.id)} disabled={pending}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => toggle(s.id, !s.active)}
                >
                  {s.active ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ServiceForm({
  service,
  onSubmit,
  onCancel,
  pending,
  error,
}: {
  service?: Service;
  onSubmit: (fd: FormData) => void;
  onCancel?: () => void;
  pending: boolean;
  error?: string;
}) {
  return (
    <form
      action={onSubmit}
      className="grid gap-3 rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-4 sm:grid-cols-3"
    >
      <div className="sm:col-span-3">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" defaultValue={service?.name} required />
      </div>
      <div>
        <Label htmlFor="durationMinutes">Duração (min)</Label>
        <Input
          id="durationMinutes"
          name="durationMinutes"
          type="number"
          min={5}
          step={5}
          defaultValue={service?.durationMinutes ?? 30}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={service ? (service.priceCents / 100).toFixed(2) : "0.00"}
          required
        />
      </div>
      <div className="flex items-end gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "..." : "Salvar"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-red-300 sm:col-span-3">{error}</p>}
    </form>
  );
}
