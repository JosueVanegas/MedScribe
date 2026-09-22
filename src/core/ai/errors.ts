import { APICallError, RetryError } from "ai";

function unwrap(err: unknown): unknown {
  return RetryError.isInstance(err) ? err.lastError : err;
}

/** Turns vendor/SDK errors into messages a clinic can act on. */
export function describeAiError(err: unknown, fallback: string): string {
  const cause = unwrap(err);

  if (APICallError.isInstance(cause)) {
    switch (cause.statusCode) {
      case 400:
        return /api key/i.test(cause.message)
          ? "La API key no es válida. Revísala en Configuración."
          : `El proveedor rechazó la petición: ${cause.message}`;
      case 401:
      case 403:
        return "La API key no es válida o no tiene permisos. Revísala en Configuración.";
      case 404:
        return "El modelo elegido no existe o tu cuenta no tiene acceso. Cambia de modelo en Configuración.";
      case 413:
        return "El audio es demasiado grande para este proveedor.";
      case 429:
        return "Se alcanzó el límite de uso o saldo de tu cuenta del proveedor. Espera un momento o revisa tu facturación.";
      case 500:
      case 502:
      case 503:
      case 529:
        return "El proveedor está saturado en este momento. Pulsa Reintentar en unos segundos.";
    }
  }

  if (cause instanceof TypeError && /fetch/i.test(cause.message)) {
    return "Sin conexión con el proveedor. Revisa tu internet.";
  }

  return cause instanceof Error ? cause.message : fallback;
}
