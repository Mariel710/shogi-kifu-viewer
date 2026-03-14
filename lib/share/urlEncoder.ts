/**
 * Encode UTF-8 string to base64 URL-safe format.
 * btoa() only handles ASCII, so we convert UTF-8 via percent-encoding first.
 */
export function encodeKifuToUrl(jkfJson: string): string {
  return btoa(
    encodeURIComponent(jkfJson).replace(/%([0-9A-F]{2})/g, (_, p1: string) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * Decode base64 URL-safe format back to UTF-8 string.
 */
export function decodeKifuFromUrl(encoded: string): string {
  return decodeURIComponent(
    Array.from(atob(encoded))
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Build a share URL by appending the encoded kifu data as a query parameter.
 * baseUrl should be obtained via Linking.createURL('kifu') from the caller.
 */
export function buildShareUrl(baseUrl: string, jkfJson: string): string {
  const encoded = encodeKifuToUrl(jkfJson);
  return `${baseUrl}?data=${encoded}`;
}
