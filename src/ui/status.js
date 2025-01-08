import { Row, Column, Label, Title, Button, colors } from '@/ui'
import { Pressable } from 'react-native'

export default function Status({ setvalue, value,  }) {
    const values  = ['Ativo', 'Inativo', ]
    return (
        <Column>
            <Label>Status</Label>
            <Row gh={10} style={{ backgroundColor: '#FFF', borderRadius: 6,}} pv={10} ph={10} mv={12}>
                {values.map((item, index) => (
                    <Pressable key={index} onPress={() => { setvalue(item) }}
                        style={{ backgroundColor: value == item ? colors.color.primary : '#EDF0F1', flexGrow: 1, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}
                    >
                        <Label size={18} fontFamily="Font_Medium" color={item ==value? '#fff': '#000' }>{item}</Label>
                    </Pressable>
                ))}
            </Row>
        </Column>
    )
}
