import { Column, ScrollHorizontal, colors, Pressable, Label, Row } from "@/ui/index"

export default function Tipo({ setValue, value, }: { setValue: (value: string) => void, value: string }) {
    const theme = colors();
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
        ]
/*
{
            name: 'Devolução',
            id: 'devolucao'
        }
*/
    return (
        <Column gv={12}>
            <Column >
                <Label>Tipo de movimentação</Label>
            </Column>
            <Row gh={10} pv={10} ph={10} style={{ gap: 12, marginVertical: 12, backgroundColor: theme.color.foreground, borderRadius: 6,}}>
                {values.map((item, index) => (
                    <Pressable key={index} onPress={() => { setValue(item.id) }} style={{ backgroundColor: value == item.id ? theme.color.primary : theme.color.foreground, flexGrow: 1, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>
                        <Label size={18} fontFamily="Font_Medium" color={item.id == value ? '#fff' : theme.color.label}>{item.name}</Label>
                    </Pressable>
                ))}
            </Row>
        </Column>
    )
}
