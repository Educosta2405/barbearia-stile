"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createTimeOffAction } from "@/server/actions/admin";

export function BlockTimeForm({
  barbers,
  defaultDate,
}: {
  barbers: { id: string; name: string }[];
  defaultDate: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  function submit(formData: FormData) {
    setError(undefined);
    const date = formData.get("date") as string;
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;
    const barberId = formData.get("barberId") as string;
    const reason = (formData.get("reason") as string) || undefined;

    const startTime = new Date(`${date}T${from}:00`).toISOString();
    const endTime = new Date(`${date}T${to}:00`).toISOString();

    start(async () => {
      const res = await createTimeOffAction({ barberId, startTime, endTime, reason });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        + Bloquear horário
      </Button>
    );
  }

  return (
    <form
      action={submit}
      className="grid gap-3 rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <Label htmlFor="barberId">Barbeiro</Label>
        <select
          id="barberId"
          name="barberId"
          required
          className="h-11 w-full rounded-xl border border-nardo-line/60 bg-ink-850/80 px-4 text-sm text-silver-bright focus:border-gold-soft/70 focus:outline-none"
        >
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="date">Data</Label>
        <Input id="date" name="date" type="date" defaultValue={defaultDate} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="from">Início</Label>
          <Input id="from" name="from" type="time" defaultValue="12:00" required />
        </div>
        <div>
          <Label htmlFor="to">Fim</Label>
          <Input id="to" name="to" type="time" defaultValue="13:00" required />
        </div>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="reason">Motivo (opcional)</Label>
        <Input id="reason" name="reason" placeholder="Almoço, folga..." />
      </div>
      {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando..." : "Bloquear"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
