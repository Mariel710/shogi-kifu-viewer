import { JKFPlayer } from 'json-kifu-format';
import { detectFormat, formatFromExtension } from './detectFormat';
import { parseSfen } from './sfenParser';

export { detectFormat, formatFromExtension } from './detectFormat';
export { parseSfen } from './sfenParser';

/**
 * Parse a kifu string into a JKFPlayer instance.
 * Optionally provide a filename for extension-based format detection.
 * Throws an Error if parsing fails.
 */
export function parseKifu(text: string, filename?: string): JKFPlayer {
  // Extension-based detection takes priority
  if (filename) {
    const fmtFromExt = formatFromExtension(filename);
    if (fmtFromExt) {
      console.log('[parseKifu] format from extension:', fmtFromExt, 'file:', filename);
      return parseByFormat(text, fmtFromExt);
    }
  }

  // Content-based detection
  const fmt = detectFormat(text);
  console.log('[parseKifu] detected format:', fmt);
  return parseByFormat(text, fmt);
}

function parseByFormat(text: string, fmt: ReturnType<typeof detectFormat>): JKFPlayer {
  try {
    switch (fmt) {
      case 'KIF':
        return JKFPlayer.parseKIF(text);
      case 'KI2':
        return JKFPlayer.parseKI2(text);
      case 'CSA':
        return JKFPlayer.parseCSA(text);
      case 'JKF':
        return JKFPlayer.parseJKF(text);
      case 'SFEN':
        return parseSfen(text);
      default:
        // Last resort: let JKFPlayer try all formats
        return JKFPlayer.parse(text);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[parseKifu] parse failed (format=${fmt}):`, msg);
    console.error('[parseKifu] text head:', text.slice(0, 200));
    throw err;
  }
}
