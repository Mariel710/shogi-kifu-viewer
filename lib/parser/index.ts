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
      return parseByFormat(text, fmtFromExt);
    }
  }

  // Content-based detection
  const fmt = detectFormat(text);
  return parseByFormat(text, fmt);
}

function parseByFormat(text: string, fmt: ReturnType<typeof detectFormat>): JKFPlayer {
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
}
