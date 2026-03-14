import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ImportScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#FAFAF5] p-4">
      <Text className="text-xl font-bold text-[#333333] mb-6">棋譜を読み込む</Text>

      <View className="gap-4">
        <TouchableOpacity className="bg-white border border-[#DEB887] rounded-lg p-4">
          <Text className="text-base font-semibold text-[#333333]">テキストを貼り付け</Text>
          <Text className="text-sm text-[#666666] mt-1">KIF/KI2/CSA/SFEN形式のテキストを貼り付けて読み込みます</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border border-[#DEB887] rounded-lg p-4">
          <Text className="text-base font-semibold text-[#333333]">ファイルを選択</Text>
          <Text className="text-sm text-[#666666] mt-1">.kif/.ki2/.csa形式のファイルを選択します</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border border-[#DEB887] rounded-lg p-4">
          <Text className="text-base font-semibold text-[#333333]">URLから読み込み</Text>
          <Text className="text-sm text-[#666666] mt-1">棋譜ファイルのURLを入力して読み込みます</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border border-[#DEB887] rounded-lg p-4">
          <Text className="text-base font-semibold text-[#333333]">サンプル棋譜</Text>
          <Text className="text-sm text-[#666666] mt-1">プリセットのサンプル棋譜を選択します</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-8 items-center"
        onPress={() => router.back()}
      >
        <Text className="text-[#5D4037] text-base">キャンセル</Text>
      </TouchableOpacity>
    </View>
  );
}
