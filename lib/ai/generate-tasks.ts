import Anthropic from '@anthropic-ai/sdk';
import type { Difficulty, Category } from '@/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたはタスク管理RPGゲーム「QUEST BOARD」のクエスト生成AIです。
ユーザーの目標を具体的なタスク（クエスト）に分解してください。

## ルール
- 各タスクは1日〜数日で完了できる粒度にする
- タスク名は具体的で行動可能な形にする（例: ×「ブログを頑張る」→ ○「choge-blog 新規記事の構成案を作成する」）
- 難易度の基準:
  - easy（初級）: 30分以内で完了、単純作業
  - medium（中級）: 1〜3時間、思考や創作が必要
  - hard（上級）: 半日以上、高度な集中力が必要
- カテゴリを以下から選択:
  - 守る: 既存の主力チャネルの維持
  - 回してる: 定期的に回すルーティン
  - 積む: ストック型の資産構築
  - 着手する: 新規プロジェクトの立ち上げ

## 出力形式
JSON配列のみを返してください。マークダウンや説明文は不要です。
[{"name": "タスク名", "difficulty": "medium", "category": "回してる"}]`;

export interface GeneratedTask {
  name: string;
  difficulty: Difficulty;
  category: Category;
}

export async function generateTasks(
  goal: string,
  context?: string,
  count: number = 7
): Promise<GeneratedTask[]> {
  const userMessage = context
    ? `目標: ${goal}\n補足: ${context}\nタスク数: ${count}個`
    : `目標: ${goal}\nタスク数: ${count}個`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cache_control: { type: 'ephemeral' } as any,
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';

  // Remove markdown code fences if present
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as GeneratedTask[];
}
