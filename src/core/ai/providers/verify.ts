import { getMessages } from "@/i18n/store";

export class InvalidApiKeyError extends Error {
  constructor(providerName: string) {
    super(getMessages().errors.keyInvalidFor(providerName));
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
    throw new Error(getMessages().errors.cannotReach(providerName));
  }
  if (res.status === 400 || res.status === 401 || res.status === 403) {
    throw new InvalidApiKeyError(providerName);
  }
  if (!res.ok) {
    throw new Error(getMessages().errors.providerError(providerName, res.status));
  }
}
