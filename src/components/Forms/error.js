import { Title, Column, useTheme } from '@theme/global';
import { AlertCircle } from "lucide-react-native";
import Animated, { FadeInUp } from 'react-native-reanimated';

const Error = ({ msg}) => {
    const {font} = useTheme()
    return (
        <Animated.View entering={FadeInUp} >
        <Column style={{ alignItems: 'center', marginVertical: 12, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#CF5050', flexDirection: 'row',  }}>
            <Column style={{ width: 32, height: 32, backgroundColor: '#ffffff40', borderRadius: 100, justifyContent: 'center', alignItems: 'center',  }}>
                <AlertCircle size={18} color="#fff" />
            </Column>
            <Title style={{ fontSize: 14, marginLeft: 12, color: '#fff', lineHeight: 16, fontFamily: font.medium, marginRight: 12, }}>{msg}</Title>
        </Column>
        </Animated.View>
    )
}
export default Error;