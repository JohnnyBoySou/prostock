
import { Row, colors, Title, Column, Label } from "@/ui";
import { useNavigation } from "@react-navigation/native";
import { CircleDashed, MessageCircleDashed, SquareDashed, Plus, ArrowDownUp, Users } from "lucide-react-native";
import { Pressable } from "react-native";
export const UserEmpty = ({ }) => {
    const navigation = useNavigation()
    return (
        <Column style={{ backgroundColor: '#fff', borderRadius: 12, }} pv={20} ph={20} justify='center' gv={12}>
            <Row gh={8} mv={12} justify='center'>
                <Users size={52} color='#FFB238' />
            </Row>
            <Title align='center' size={22} fontFamily="Font_Medium">Nenhum usuário encontrado...</Title>
            <Pressable style={{ backgroundColor: colors.color.blue, borderRadius: 8, }} onPress={() => { navigation.navigate('UserAdd') }} >
                <Row justify="space-between" ph={14} align='center' gh={8} pv={14}>
                    <Label size={18} color='#fff'>Criar usuário</Label>
                    <Column style={{ backgroundColor: '#fff', borderRadius: 4, }} pv={6} ph={6}>
                        <Plus size={24} color={colors.color.blue} />
                    </Column>
                </Row>
            </Pressable>
        </Column>
    )
}