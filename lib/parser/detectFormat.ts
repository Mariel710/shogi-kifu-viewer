export type KifuFormat = 'KIF' | 'KI2' | 'CSA' | 'SFEN' | 'JKF' | 'BOD' | 'unknown';

/**
 * Auto-detect the format of a kifu string.
 * Order matters — more specific checks first.
 */
export function detectFormat(text: string): KifuFormat {
  const t = text.trim();

  // JSON → JKF
  if (t.startsWith('{')) {
    try {
      JSON.parse(t);
      return 'JKF';
    } catch {
      // fall through
    }
  }

  // CSA: starts with "V2" version header or "P" position line or "PI" (initial)
  if (/^V2\.?|^PI\b|^\+|^-|^N\+|^N-/.test(t)) return 'CSA';

  // SFEN / USI
  if (
    t.startsWith('position sfen') ||
    t.startsWith('position startpos') ||
    /^[lnsgkpbrLNSGKPBR1-9+\/]+ [bw] [-A-Za-z0-9]+ \d+/.test(t)
  )
    return 'SFEN';

  // KIF: has 手数---- header row (standard KIF) or 手合割 header
  if (t.includes('手数----') || t.includes('手合割') || /^\s*\d+\s+[▲△☗☖]/.test(t))
    return 'KIF';

  // KI2: lines start with ▲ or △ notation
  if (/^[▲△]/.test(t) || /\n[▲△]/.test(t)) return 'KI2';

  // BOD: board position diagram
  if (t.includes('+--') || t.includes('後手の持駒')) return 'BOD';

  return 'unknown';
}

/**
 * Detect format from file extension.
 */
export function formatFromExtension(filename: string): KifuFormat | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'kif':
    case 'kifu':
      return 'KIF';
    case 'ki2':
    case 'ki2u':
      return 'KI2';
    case 'csa':
      return 'CSA';
    case 'json':
    case 'jkf':
      return 'JKF';
    default:
      return null;
  }
}
