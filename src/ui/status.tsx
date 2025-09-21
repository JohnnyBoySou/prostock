import { Row, Column, Label, Title, Button, colors } from '@/ui'
import { Pressable } from 'react-native'

export default function Status({ setValue, value, }: { setValue: () => void, value: string }) {
    const theme = colors();
    const values = [
        { label: 'ativo', bool: true },
        { label: 'inativo', bool: false }
    ]
    return (
        <Column>
            <Label>Status</Label>
            <Row gh={10} style={{ backgroundColor: '#FFF', borderRadius: 6, }} pv={10} ph={10} mv={12}>
                {values.map((item, index) => (
                    <Pressable key={index} onPress={() => { setValue(item.bool) }}
                        style={{ backgroundColor: value === item.bool ? theme.color.primary : '#EDF0F1', flexGrow: 1, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}
                    >
                        <Label size={18} fontFamily="Font_Medium" color={item.bool === value ? '#fff' : '#000'} style={{ textTransform: 'uppercase' }}>{item.label}</Label>
                    </Pressable>
                ))}
            </Row>
        </Column>
    )
}
