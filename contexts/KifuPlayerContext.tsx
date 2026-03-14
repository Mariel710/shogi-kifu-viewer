import { createContext, useContext, type ReactNode } from 'react';
import { useKifuPlayer } from '@/hooks/useKifuPlayer';
import type { KifuPlayerState, KifuPlayerControls } from '@/hooks/useKifuPlayer';

type KifuPlayerContextValue = KifuPlayerState & KifuPlayerControls;

const KifuPlayerContext = createContext<KifuPlayerContextValue | null>(null);

export function KifuPlayerProvider({ children }: { children: ReactNode }) {
  const player = useKifuPlayer();
  return (
    <KifuPlayerContext.Provider value={player}>
      {children}
    </KifuPlayerContext.Provider>
  );
}

export function useKifuPlayerContext(): KifuPlayerContextValue {
  const ctx = useContext(KifuPlayerContext);
  if (!ctx) throw new Error('useKifuPlayerContext must be used within KifuPlayerProvider');
  return ctx;
}
