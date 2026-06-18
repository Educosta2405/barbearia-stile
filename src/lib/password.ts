import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Hash/verificação de senha com scrypt (nativo do Node, sem dependências).
 * Formato armazenado: "<salt_hex>:<hash_hex>".
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const candidate = scryptSync(password, salt, 64);
  return (
    hashBuffer.length === candidate.length &&
    timingSafeEqual(hashBuffer, candidate)
  );
}
