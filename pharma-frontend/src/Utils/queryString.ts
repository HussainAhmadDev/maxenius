export function queryStringify(params: Record<string, string> | string[][]): string {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `?${queryString}` : "";
}
