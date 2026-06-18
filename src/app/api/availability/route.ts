import { NextResponse } from "next/server";
import { availabilityQuerySchema } from "@/lib/validations/appointment";
import { getAvailableSlots } from "@/server/services/slots";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = availabilityQuerySchema.safeParse({
    barberId: searchParams.get("barberId"),
    serviceId: searchParams.get("serviceId"),
    date: searchParams.get("date"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  try {
    const slots = await getAvailableSlots(parsed.data);
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "Erro ao calcular horários" }, { status: 500 });
  }
}
