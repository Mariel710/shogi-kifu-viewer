export function encodeKifuToUrl(jkfData: string): string {
  return encodeURIComponent(jkfData);
}

export function decodeKifuFromUrl(encoded: string): string {
  return decodeURIComponent(encoded);
}

export function buildShareUrl(baseUrl: string, jkfData: string): string {
  const encoded = encodeKifuToUrl(jkfData);
  return `${baseUrl}/kifu?data=${encoded}`;
}
