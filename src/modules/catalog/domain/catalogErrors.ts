export class CatalogDomainError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "CatalogDomainError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class CatalogConfigurationError extends CatalogDomainError {
  constructor(message: string) {
    super("CATALOG_NOT_CONFIGURED", message, 503);
    this.name = "CatalogConfigurationError";
  }
}

export class CatalogConflictError extends CatalogDomainError {
  constructor(message: string, details?: unknown) {
    super("CATALOG_CONFLICT", message, 409, details);
    this.name = "CatalogConflictError";
  }
}

export class CatalogNotFoundError extends CatalogDomainError {
  constructor(message: string) {
    super("CATALOG_NOT_FOUND", message, 404);
    this.name = "CatalogNotFoundError";
  }
}
