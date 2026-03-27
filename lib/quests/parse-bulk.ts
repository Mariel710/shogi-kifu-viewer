import type { ParsedTask, Difficulty } from '@/types';

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  '[初]': 'easy',
  '[中]': 'medium',
  '[上]': 'hard',
};

export function parseBulkTasks(text: string): ParsedTask[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      for (const [prefix, difficulty] of Object.entries(DIFFICULTY_MAP)) {
        if (line.startsWith(prefix)) {
          return {
            name: line.slice(prefix.length).trim(),
            difficulty,
          };
        }
      }
      return { name: line, difficulty: 'medium' as const };
    });
}
