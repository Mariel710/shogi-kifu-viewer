import { View, Text, StyleSheet } from 'react-native';
import type { GameMeta } from '@/hooks/useKifuPlayer';
import { COLORS } from '@/lib/shogi/constants';

interface GameInfoBarProps {
  meta: GameMeta;
  isLoaded: boolean;
}

export default function GameInfoBar({ meta, isLoaded }: GameInfoBarProps) {
  if (!isLoaded) return null;

  const hasMeta = meta.sente || meta.gote || meta.event;
  if (!hasMeta) return null;

  return (
    <View style={styles.container}>
      {(meta.sente || meta.gote) && (
        <Text style={styles.players} numberOfLines={1}>
          {meta.sente ? `☗${meta.sente}` : '☗先手'}
          {'  vs  '}
          {meta.gote ? `☖${meta.gote}` : '☖後手'}
        </Text>
      )}
      {(meta.event || meta.date) && (
        <Text style={styles.info} numberOfLines={1}>
          {[meta.event, meta.date].filter(Boolean).join(' · ')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  players: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  info: {
    fontSize: 11,
    color: '#E8D5B0',
    textAlign: 'center',
    marginTop: 2,
  },
});
