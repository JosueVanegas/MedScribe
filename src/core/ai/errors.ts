import { APICallError, RetryError } from "ai";
import { getMessages } from "@/i18n/store";

function unwrap(err: unknown): unknown {
  return RetryError.isInstance(err) ? err.lastError : err;
}

/** Turns vendor/SDK errors into messages a clinic can act on. */
export function describeAiError(err: unknown, fallback: string): string {
  const cause = unwrap(err);
  const t = getMessages().errors;

  if (APICallError.isInstance(cause)) {
    switch (cause.statusCode) {
      case 400:
        return /api key/i.test(cause.message)
          ? t.invalidKey
          : t.rejected(cause.message);
      case 401:
      case 403:
        return t.unauthorized;
      case 404:
        return t.modelNotFound;
      case 413:
        return t.audioTooLargeForProvider;
      case 429:
        return t.rateLimited;
      case 500:
      case 502:
      case 503:
      case 529:
        return t.overloaded;
    }
  }

  if (cause instanceof TypeError && /fetch/i.test(cause.message)) {
    return t.offline;
  }

  return cause instanceof Error ? cause.message : fallback;
}
