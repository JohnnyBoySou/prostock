import { View, Pressable, Text } from "react-native";
import { colors, SCREEN_WIDTH } from '@/ui'
import { ScrollView } from "react-native-gesture-handler";
import * as Haptics from 'expo-haptics';


export default function Tabs({ types, setValue, value }) {
  const width = SCREEN_WIDTH / types.length;
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ backgroundColor: '#fff', }}>
      {types.map((type, index) => (
        <Pressable onPress={() => {
          setValue(type);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }} key={index}
          style={{
            justifyContent: 'center', alignItems: 'center', paddingVertical: 12, width: width,
            borderBottomWidth: 2, borderBottomColor: value === type ? colors.color.primary : 'transparent'
          }}>
          <Text style={{
            fontFamily: value === type ? 'Font_Medium' : 'Font_Book',
            fontSize: 16,
            color: value === type ? colors.color.primary : '#8C8C8C',
            textTransform: 'uppercase',
          }}>{type}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )

}