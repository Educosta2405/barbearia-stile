/**
 * Seed de desenvolvimento.
 * Popula: serviços padrão, um ADMIN, dois barbeiros (com login) e
 * vincula todos os serviços a cada barbeiro.
 *
 * Rodar: npm run db:seed
 * Login admin:    admin@barbearia.dev    / senha: admin123
 * Login barbeiro: rafael@barbearia.dev   / senha: barber123
 */
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";
import { UserRole } from "../src/lib/enums";

const db = new PrismaClient();

/** Hash de senha simples (scrypt) — mesmo algoritmo usado no auth. */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  // ---------- Serviços ----------
  const services = [
    { name: "Corte de cabelo", durationMinutes: 30, priceCents: 4500 },
    { name: "Barba", durationMinutes: 20, priceCents: 3000 },
    { name: "Sobrancelha", durationMinutes: 15, priceCents: 2000 },
    { name: "Progressiva", durationMinutes: 90, priceCents: 12000 },
  ];

  const createdServices = [];
  for (const s of services) {
    const service = await db.service.upsert({
      where: { id: `seed-${s.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `seed-${s.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...s,
      },
    });
    createdServices.push(service);
  }
  console.log(`✓ ${createdServices.length} serviços`);

  // ---------- Admin ----------
  await db.user.upsert({
    where: { email: "admin@barbearia.dev" },
    update: {},
    create: {
      email: "admin@barbearia.dev",
      name: "Administrador",
      role: UserRole.ADMIN,
      passwordHash: hashPassword("admin123"),
      emailVerified: new Date(),
    },
  });
  console.log("✓ admin@barbearia.dev (senha: admin123)");

  // ---------- Barbeiros ----------
  const barbers = [
    { email: "rafael@barbearia.dev", name: "Rafael", bio: "Especialista em fade e barba." },
    { email: "marcos@barbearia.dev", name: "Marcos", bio: "Clássico e navalhado." },
  ];

  for (const b of barbers) {
    const user = await db.user.upsert({
      where: { email: b.email },
      update: {},
      create: {
        email: b.email,
        name: b.name,
        role: UserRole.BARBER,
        passwordHash: hashPassword("barber123"),
        emailVerified: new Date(),
      },
    });

    const barber = await db.barber.upsert({
      where: { userId: user.id },
      update: { bio: b.bio },
      create: { userId: user.id, bio: b.bio },
    });

    // vincula todos os serviços a este barbeiro
    for (const service of createdServices) {
      await db.barberService.upsert({
        where: {
          barberId_serviceId: { barberId: barber.id, serviceId: service.id },
        },
        update: {},
        create: { barberId: barber.id, serviceId: service.id },
      });
    }
    console.log(`✓ barbeiro ${b.name} (${b.email}, senha: barber123)`);
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
