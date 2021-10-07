export function parseBigIntRequest(request: string | undefined, onError: () => void): BigInt | undefined {
  if(request === undefined || request === null) {
    return undefined;
  }

  try {
    return BigInt(request);
  }
  catch(e) {
    onError();
  }
}