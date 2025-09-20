import { View, Pressable, Text, Dimensions } from "react-native";
import { colors, } from '@/ui'
import { ScrollView } from "react-native-gesture-handler";
import * as Haptics from 'expo-haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Tabs({ types, setValue, value }) {
  const theme = colors();
  const width = SCREEN_WIDTH / types.length;
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ backgroundColor: theme.color.header, }}>
      {types.map((type, index) => (
        <Pressable onPress={() => {
          setValue(type);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }} key={index}
          style={{
            justifyContent: 'center', alignItems: 'center', paddingVertical: 12,
            width: width,
            borderBottomWidth: 2, borderBottomColor: value === type ? theme.color.primary : 'transparent'
          }}>
          <Text style={{
            fontFamily: value === type ? 'Font_Medium' : 'Font_Book',
            fontSize: 16,
            color: value === type ? theme.color.primary : '#8C8C8C',
            textTransform: 'uppercase',
          }}>{type}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )

}