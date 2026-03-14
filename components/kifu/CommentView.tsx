import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '@/lib/shogi/constants';

interface CommentViewProps {
  comments: string[];
}

/** Displays comments attached to the current move position. */
export default function CommentView({ comments }: CommentViewProps) {
  if (!comments.length) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        {comments.map((comment, i) => (
          <Text key={i} style={styles.text}>
            {comment}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    maxHeight: 100,
    backgroundColor: '#FFF8F0',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.boardLine,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scroll: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    color: COLORS.textMain,
    lineHeight: 20,
  },
});
