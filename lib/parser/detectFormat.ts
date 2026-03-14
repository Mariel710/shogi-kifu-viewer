// TODO: Phase 3 - implement format auto-detection

export type KifuFormat = 'KIF' | 'KI2' | 'CSA' | 'SFEN' | 'JKF' | 'BOD' | 'unknown';

export function detectFormat(text: string): KifuFormat {
  const trimmed = text.trim();

  if (trimmed.startsWith('V2') || trimmed.startsWith('PI')) return 'CSA';
  if (trimmed.includes('手数----指手')) return 'KIF';
  if (/^[▲△]/.test(trimmed)) return 'KI2';
  if (trimmed.startsWith('position') || trimmed.startsWith('sfen')) return 'SFEN';
  if (trimmed.startsWith('{')) {
    try {
      JSON.parse(trimmed);
      return 'JKF';
    } catch {
      // not JSON
    }
  }

  return 'unknown';
}
