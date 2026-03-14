// TODO: Phase 9 - implement expo-sqlite database operations

export interface KifuRecord {
  id: number;
  jkfData: string;
  title: string;
  sente: string;
  gote: string;
  event: string;
  date: string;
  memo: string;
  savedAt: string;
}

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS kifu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jkf_data TEXT NOT NULL,
    title TEXT,
    sente TEXT,
    gote TEXT,
    event TEXT,
    date TEXT,
    memo TEXT,
    saved_at TEXT NOT NULL
  )
`;

export async function initDB(): Promise<void> {
  // TODO: Phase 9 - initialize SQLite database
  console.log('DB init placeholder', CREATE_TABLE_SQL);
}

export async function saveKifu(_record: Omit<KifuRecord, 'id'>): Promise<number> {
  // TODO: Phase 9 - save kifu to database
  return 0;
}

export async function loadKifu(_id: number): Promise<KifuRecord | null> {
  // TODO: Phase 9 - load kifu from database
  return null;
}

export async function listKifu(): Promise<KifuRecord[]> {
  // TODO: Phase 9 - list all kifu from database
  return [];
}

export async function deleteKifu(_id: number): Promise<void> {
  // TODO: Phase 9 - delete kifu from database
}
