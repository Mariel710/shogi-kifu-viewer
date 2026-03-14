import * as SQLite from 'expo-sqlite';

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

type KifuRow = {
  id: number;
  jkf_data: string;
  title: string | null;
  sente: string | null;
  gote: string | null;
  event: string | null;
  date: string | null;
  memo: string | null;
  saved_at: string;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('kifu.db').then(async (db) => {
      await db.execAsync(`
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
      `);
      return db;
    });
  }
  return dbPromise;
}

export async function initDB(): Promise<void> {
  await getDB();
}

function rowToRecord(row: KifuRow): KifuRecord {
  return {
    id: row.id,
    jkfData: row.jkf_data,
    title: row.title ?? '',
    sente: row.sente ?? '',
    gote: row.gote ?? '',
    event: row.event ?? '',
    date: row.date ?? '',
    memo: row.memo ?? '',
    savedAt: row.saved_at,
  };
}

export async function saveKifu(record: Omit<KifuRecord, 'id'>): Promise<number> {
  const db = await getDB();
  const result = await db.runAsync(
    `INSERT INTO kifu (jkf_data, title, sente, gote, event, date, memo, saved_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    record.jkfData,
    record.title,
    record.sente,
    record.gote,
    record.event,
    record.date,
    record.memo,
    record.savedAt
  );
  return result.lastInsertRowId;
}

export async function loadKifu(id: number): Promise<KifuRecord | null> {
  const db = await getDB();
  const row = await db.getFirstAsync<KifuRow>(
    'SELECT * FROM kifu WHERE id = ?',
    id
  );
  return row ? rowToRecord(row) : null;
}

export async function listKifu(): Promise<KifuRecord[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<KifuRow>(
    'SELECT * FROM kifu ORDER BY saved_at DESC'
  );
  return rows.map(rowToRecord);
}

export async function deleteKifu(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM kifu WHERE id = ?', id);
}
