
import { Row, colors, Title, Column, Label } from "@/ui";
import { useNavigation } from "@react-navigation/native";
import { Plus, Truck } from "lucide-react-native";
import { Pressable } from "react-native";
export const SupplierEmptyIA = ({ }) => {
    const navigation = useNavigation()
    return (
        <Column style={{ backgroundColor: '#fff', borderRadius: 12, }} pv={20} ph={20} justify='center' gv={12}>
            <Row gh={8} mv={12} justify='center'>
                <Truck size={52} color='#9747FF' />
            </Row>
            <Title align='center' size={22} fontFamily="Font_Medium">Nenhum fornecedor encontrado...</Title>
        </Column>
    )
}