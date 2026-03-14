import { View, Text } from 'react-native';

export default function LibraryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#FAFAF5]">
      <Text className="text-xl font-bold text-[#333333] mb-2">棋譜ライブラリ</Text>
      <Text className="text-base text-[#666666] text-center px-8">
        保存した棋譜がここに表示されます
      </Text>
    </View>
  );
}
