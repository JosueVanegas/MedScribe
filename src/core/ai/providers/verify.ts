export class InvalidApiKeyError extends Error {
  constructor(providerName: string) {
    super(`La API key de ${providerName} no es válida.`);
  }
}

/** GETs a cheap authenticated endpoint (usually "list models") to validate a key. */
export async function verifyWithRequest(
  providerName: string,
  url: string,
  headers: Record<string, string>
): Promise<void> {
  let res: Response;
  try {
    res = await fetch(url, { headers });
  } catch {
    throw new Error(
      `No se pudo contactar con ${providerName}. Revisa tu conexión a internet.`
    );
  }
  if (res.status === 400 || res.status === 401 || res.status === 403) {
    throw new InvalidApiKeyError(providerName);
  }
  if (!res.ok) {
    throw new Error(`${providerName} respondió con un error (${res.status}).`);
  }
}
