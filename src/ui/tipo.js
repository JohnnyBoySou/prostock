import { Row, Column, Label, Title, ScrollHorizontal, colors } from '@/ui'
import { Pressable } from 'react-native'

export default function Status({ setvalue, value, }) {
    const values = [
        {
            name: 'Entrada',
            id: 'entrada'
        },
        {
            name: 'Saida',
            id: 'saida'
        },
        {
            name: 'Perda',
            id: 'perda'
        },
        {
            name: 'Devolução',
            id: 'devolucao'
        }]

    return (
        <Column>
            <Label>Tipo</Label>
            <ScrollHorizontal  contentContainerStyle={{ gap: 12, marginVertical: 12, }}>
                {values.map((item, index) => (
                    <Pressable key={index} onPress={() => { setvalue(item.id) }} style={{ backgroundColor: value == item.id ? colors.color.primary : '#FFF', flexGrow: 1, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>
                        <Label size={18} fontFamily="Font_Medium" color={item.id == value ? '#fff' : '#000'}>{item.name}</Label>
                    </Pressable>
                ))}
            </ScrollHorizontal>
        </Column>
    )
}
