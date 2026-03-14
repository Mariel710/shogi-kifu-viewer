import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SAMPLE_KIFU, type SampleKifu } from '@/assets/sample-kifu/samples';
import { COLORS } from '@/lib/shogi/constants';

interface SampleKifuListProps {
  onSelect: (content: string, filename: string) => void;
}

export default function SampleKifuList({ onSelect }: SampleKifuListProps) {
  return (
    <FlatList
      data={SAMPLE_KIFU}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: { item: SampleKifu }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelect(item.content, item.filename)}
          activeOpacity={0.7}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.boardLine,
    borderRadius: 8,
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#666',
  },
  sep: {
    height: 10,
  },
});
