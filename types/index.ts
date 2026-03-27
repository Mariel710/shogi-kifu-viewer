export type SubscriptionTier = 'free' | 'pro';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = '守る' | '回してる' | '積む' | '着手する';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Profile {
  id: string;
  display_name: string;
  xp: number;
  level: number;
  rp: number;
  total_tasks: number;
  streak: number;
  best_streak: number;
  rounds_cleared: number;
  total_rp_earned: number;
  subscription_tier: SubscriptionTier;
  ai_calls_used: number;
  ai_calls_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  name: string;
  difficulty: Difficulty;
  category: Category | null;
  done: boolean;
  sort_order: number;
  created_at: string;
}

export interface QuestHistory {
  id: string;
  user_id: string;
  name: string;
  difficulty: Difficulty;
  category: Category | null;
  xp_earned: number;
  rp_earned: number;
  cleared_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface GachaItem {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  rarity: Rarity;
  obtained_at: string;
}

export interface ShopHistoryItem {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  rp_cost: number;
  purchased_at: string;
}

export interface TaskTemplate {
  id: string;
  user_id: string | null;
  name: string;
  description: string;
  category: Category | null;
  tasks: Array<{ name: string; difficulty: Difficulty; category: Category | null }>;
  is_public: boolean;
  created_at: string;
}

// API request/response types
export interface GenerateTasksRequest {
  goal: string;
  context?: string;
  count?: number;
  difficulty?: Difficulty | 'mixed';
}

export interface GenerateTasksResponse {
  tasks: Array<{
    name: string;
    difficulty: Difficulty;
    category: Category;
  }>;
  ai_calls_remaining: number;
}

export interface UpdateQuestRequest {
  name?: string;
  difficulty?: Difficulty;
  category?: Category | null;
  done?: boolean;
}

export interface UndoResponse {
  quest: Quest;
  xp_reverted: number;
  rp_reverted: number;
  new_xp: number;
  new_rp: number;
  level_changed: boolean;
}

export interface ParsedTask {
  name: string;
  difficulty: Difficulty;
}
