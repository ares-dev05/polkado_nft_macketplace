export function requestArray(request: string | string[] | undefined | null) : string[] {
  if(Array.isArray(request)) {
    return request;
  }

  if(request == null) {
    return [];
  }

  return [request];
}