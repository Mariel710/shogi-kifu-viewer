import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@/lib/shogi/constants';

interface BranchIndicatorProps {
  branches: string[];
  onSelectBranch: (index: number) => void;
}

/** Shows alternative move branches when they exist at the current position. */
export default function BranchIndicator({ branches, onSelectBranch }: BranchIndicatorProps) {
  if (branches.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>変化手順:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {branches.map((branch, i) => (
          <TouchableOpacity
            key={i}
            style={styles.btn}
            onPress={() => onSelectBranch(i)}
            activeOpacity={0.7}
          >
            <Text style={styles.btnText} numberOfLines={1}>
              {branch || `変化 ${i + 1}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F0EAD6',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.boardLine,
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.textMain,
    fontWeight: '600',
    flexShrink: 0,
  },
  scroll: {
    flex: 1,
  },
  btn: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    marginRight: 6,
  },
  btnText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    maxWidth: 120,
  },
});
