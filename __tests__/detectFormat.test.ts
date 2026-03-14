import { describe, it, expect } from '@jest/globals';
import { detectFormat, formatFromExtension } from '../lib/parser/detectFormat';

describe('detectFormat', () => {
  it('detects JKF from JSON object', () => {
    expect(detectFormat('{"header":{},"moves":[]}')).toBe('JKF');
  });

  it('returns unknown for malformed JSON', () => {
    expect(detectFormat('{bad json')).toBe('unknown');
  });

  it('detects CSA from V2 header', () => {
    expect(detectFormat('V2\nN+Sente\n')).toBe('CSA');
  });

  it('detects CSA from PI initial position', () => {
    expect(detectFormat('PI\n+7776FU\n')).toBe('CSA');
  });

  it('detects SFEN position', () => {
    expect(detectFormat('position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1')).toBe('SFEN');
  });

  it('detects KIF from 手数---- header', () => {
    expect(detectFormat('手数----指手---------消費時間--\n   1 ７六歩(77)\n')).toBe('KIF');
  });

  it('detects KIF from 手合割 header', () => {
    expect(detectFormat('手合割：平手\n')).toBe('KIF');
  });

  it('detects KI2 from ▲ notation', () => {
    expect(detectFormat('▲７六歩 △３四歩\n')).toBe('KI2');
  });

  it('detects BOD from 後手の持駒 marker', () => {
    expect(detectFormat('後手の持駒：なし\n  ９ ８ ７\n+--+--+--+')).toBe('BOD');
  });

  it('returns unknown for empty string', () => {
    expect(detectFormat('')).toBe('unknown');
  });
});

describe('formatFromExtension', () => {
  it('returns KIF for .kif', () => {
    expect(formatFromExtension('game.kif')).toBe('KIF');
  });

  it('returns KIF for .kifu', () => {
    expect(formatFromExtension('game.kifu')).toBe('KIF');
  });

  it('returns KI2 for .ki2', () => {
    expect(formatFromExtension('game.ki2')).toBe('KI2');
  });

  it('returns CSA for .csa', () => {
    expect(formatFromExtension('game.csa')).toBe('CSA');
  });

  it('returns JKF for .jkf', () => {
    expect(formatFromExtension('game.jkf')).toBe('JKF');
  });

  it('returns JKF for .json', () => {
    expect(formatFromExtension('game.json')).toBe('JKF');
  });

  it('returns null for unknown extension', () => {
    expect(formatFromExtension('game.txt')).toBeNull();
  });
});
