"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppointmentStatus } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import {
  updateAppointmentStatusAction,
  cancelAsStaffAction,
} from "@/server/actions/admin";

export function AppointmentActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(undefined);
    start(async () => {
      const res = await fn();
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
      {status === AppointmentStatus.PENDING && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(() => updateAppointmentStatusAction(id, AppointmentStatus.CONFIRMED))}
        >
          Confirmar
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run(() => updateAppointmentStatusAction(id, AppointmentStatus.COMPLETED))}
      >
        Concluir
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run(() => updateAppointmentStatusAction(id, AppointmentStatus.NO_SHOW))}
      >
        Faltou
      </Button>
      <Button
        size="sm"
        variant="danger"
        disabled={pending}
        onClick={() => run(() => cancelAsStaffAction(id))}
      >
        Cancelar
      </Button>
      {error && <span className="w-full text-xs text-red-300">{error}</span>}
    </div>
  );
}
