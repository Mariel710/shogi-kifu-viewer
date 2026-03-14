import { useState, useEffect, useCallback } from 'react';
import {
  initDB,
  saveKifu as dbSaveKifu,
  listKifu as dbListKifu,
  deleteKifu as dbDeleteKifu,
  loadKifu as dbLoadKifu,
  type KifuRecord,
} from '@/lib/storage/kifuDB';

export type { KifuRecord };

export function useKifuLibrary() {
  const [kifuList, setKifuList] = useState<KifuRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const records = await dbListKifu();
      setKifuList(records);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initDB().then(refresh);
  }, [refresh]);

  const saveKifu = useCallback(
    async (jkfData: string, metadata: { title?: string; sente?: string; gote?: string; event?: string; date?: string; memo?: string }) => {
      await dbSaveKifu({
        jkfData,
        title: metadata.title ?? '',
        sente: metadata.sente ?? '',
        gote: metadata.gote ?? '',
        event: metadata.event ?? '',
        date: metadata.date ?? '',
        memo: metadata.memo ?? '',
        savedAt: new Date().toISOString(),
      });
      await refresh();
    },
    [refresh]
  );

  const deleteKifu = useCallback(
    async (id: number) => {
      await dbDeleteKifu(id);
      await refresh();
    },
    [refresh]
  );

  const loadKifu = useCallback(async (id: number) => {
    return dbLoadKifu(id);
  }, []);

  return { kifuList, loading, saveKifu, deleteKifu, loadKifu, refresh };
}
