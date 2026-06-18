/** Erros de domínio com mensagem amigável para a UI/API. */
export class DomainError extends Error {
  constructor(
    message: string,
    public code:
      | "CONFLICT"
      | "NOT_FOUND"
      | "VALIDATION"
      | "FORBIDDEN" = "VALIDATION",
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export const Conflict = (m: string) => new DomainError(m, "CONFLICT");
export const NotFound = (m: string) => new DomainError(m, "NOT_FOUND");
export const Forbidden = (m: string) => new DomainError(m, "FORBIDDEN");
export const Invalid = (m: string) => new DomainError(m, "VALIDATION");
