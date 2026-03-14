// TODO: Phase 10 - implement URL encoding/decoding for kifu sharing

export function encodeKifuToUrl(jkfData: string): string {
  // Base64 encode the JKF JSON string for URL embedding
  return Buffer.from(jkfData, 'utf-8').toString('base64');
}

export function decodeKifuFromUrl(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

export function buildShareUrl(baseUrl: string, jkfData: string): string {
  const encoded = encodeKifuToUrl(jkfData);
  return `${baseUrl}/kifu?data=${encoded}`;
}
