import { nullOrWhitespace } from "src/string/null-or-white-space";

export function parseIntRequest(value: string | undefined | null, onError: () => void): number | undefined {
  if(nullOrWhitespace(value)) {
    return undefined;
  }

  const int = parseInt(value as string);
  if(Number.isNaN(int) || !Number.isFinite(int)) {
    onError();
  }
  return int;
}