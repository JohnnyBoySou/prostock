import { Row, Column, Label, colors, Pressable } from '@/ui'

export interface StatusProps {
    setValue: (value: boolean) => void;
    value: boolean;
}

export default function Status({ setValue, value, }: StatusProps) {
    const theme = colors();
    const values = [
        { label: 'ativo', bool: true },
        { label: 'inativo', bool: false }
    ]
    return (
        <Column>
            <Label>Status</Label>
            <Row gh={10} style={{ backgroundColor: theme.color.foreground, borderRadius: 6, }} pv={10} ph={10} mv={12}>
                {values.map((item, index) => (
                    <Pressable key={index} onPress={() => { setValue(item.bool) }}
                        style={{ backgroundColor: value === item.bool ? theme.color.primary : theme.color.foreground, flexGrow: 1, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}
                    >
                        <Label size={18} fontFamily="Font_Medium" color={item.bool === value ? '#fff' : '#000'} style={{ textTransform: 'uppercase' }}>{item.label}</Label>
                    </Pressable>
                ))}
            </Row>
        </Column>
    )
}
