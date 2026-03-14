import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-[#FAFAF5]">
      <Text className="text-2xl font-bold text-[#333333] mb-4">棋譜ビューア</Text>
      <Text className="text-base text-[#666666] mb-8 text-center px-8">
        棋譜を読み込んで、1手ずつ再生できます
      </Text>
      <TouchableOpacity
        className="bg-[#5D4037] px-6 py-3 rounded-lg"
        onPress={() => router.push('/import')}
      >
        <Text className="text-white text-base font-semibold">棋譜を読み込む</Text>
      </TouchableOpacity>
    </View>
  );
}
