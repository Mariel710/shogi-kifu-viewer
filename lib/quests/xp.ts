import type { Difficulty } from '@/types';

const XP_TABLE: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

const RP_TABLE: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 20,
};

export function getXpReward(difficulty: Difficulty): number {
  return XP_TABLE[difficulty];
}

export function getRpReward(difficulty: Difficulty): number {
  return RP_TABLE[difficulty];
}

export function getLevelFromXp(xp: number): number {
  // Level = floor(1 + sqrt(xp / 50))
  return Math.floor(1 + Math.sqrt(xp / 50));
}

export function getXpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 50;
}

export function getXpForNextLevel(level: number): number {
  return getXpForLevel(level + 1);
}
