import colors  from './colors_2'
import { Pressable } from 'react-native'
import { Column, ScrollHorizontal, } from './layout'
import { Label, Title } from './text'

export default function Medida({ setvalue, value, values }) {
    return (
        <Column>
            <Label>Unidade de medida</Label>
            <ScrollHorizontal contentContainerStyle={{gap: 12, marginVertical: 12,}}>
                {values.map((item, index) => (
                    <Pressable key={index} onPress={() => { setvalue(item) }}
                        style={{ backgroundColor: value == item ? colors.color.primary : '#fff', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6, }}
                    >
                        <Label color={item ==value? '#fff': '#000' }>{item}</Label>
                    </Pressable>
                ))}
            </ScrollHorizontal>
        </Column>
    )
}
