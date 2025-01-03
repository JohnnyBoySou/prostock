import { Title, Column, useTheme } from '@theme/global';
import { CheckIcon } from "lucide-react-native";
import Animated, { FadeInUp } from 'react-native-reanimated';
const Success = ({ msg }) => {
    const {font} = useTheme()
    return (
        <Animated.View entering={FadeInUp} >
        <Column style={{ alignItems: 'center', marginVertical: 12, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#778428', flexDirection: 'row' }}>
            <Column style={{ width: 32, height: 32,  borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff40', }}>
                <CheckIcon size={24} color="#fff" />
            </Column>
            <Title style={{ fontSize: 14, marginLeft: 12, color: '#fff',  lineHeight: 16, fontFamily: font.medium, marginRight: 12, }}>{msg}</Title>
        </Column>
        </Animated.View>
    )
}
export default Success;