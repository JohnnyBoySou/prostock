import { ScrollHorizontal, Column, Label, Title, Button, colors } from '@/ui'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function Users({ setvalue, value, values }) {
    return (
        <Column>
            <Label>Tipo</Label>
            <ScrollHorizontal contentContainerStyle={{ gap: 12, marginVertical: 12, }}>
                {values.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => { setvalue(item.id) }}
                        style={{ backgroundColor: value == item.id ? colors.color.primary : '#fff', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 6, }}
                    >
                        <Label color={item.id == value ? '#fff' : '#000'}>{item?.name}</Label>
                    </TouchableOpacity>
                ))}
            </ScrollHorizontal>
        </Column>
    )
}
