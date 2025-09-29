import { Label, Column, ScrollHorizontal, Pressable, colors } from "@/ui/index"

export default function Medida({ setValue, value, values }: { setValue: (value: string) => void, value: string, values: string[] }) {
    const theme = colors();
    return (
        <Column>
            <Label>Unidade de medida</Label>
            <ScrollHorizontal contentContainerStyle={{ gap: 12, marginVertical: 12, overflow: 'hidden', borderRadius: 6 }}>
                {values.map((item, index) => (
                    <Pressable key={index} onPress={() => { setValue(item) }}
                        style={{ backgroundColor: value == item ? theme.color.primary : theme.color.foreground, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6, }}
                    >
                        <Label color={item == value ? '#fff' : theme.color.label}>{item}</Label>
                    </Pressable>
                ))}
            </ScrollHorizontal>
        </Column>
    )
}
