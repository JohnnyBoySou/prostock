import { Main, Row, colors, Title, Column, Label,  Button, ListSearch } from "@/ui";
import { PenLine } from "lucide-react-native";
import { Pressable } from 'react-native';

import { listCategory, searchCategory } from "@/api/category";

import { useNavigation } from "@react-navigation/native";
import { CategoryEmpty } from "@/ui/Emptys/category";

export default function CategoryListScreen() {

    return (
        <Main>

            <Column style={{ flex: 1 }}>
                <Categories />
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    <Button label='Criar categoria' route="CategoryAdd" />
                </Column>
            </Column>
        </Main>)
}

const Categories = () => {
    const Card = ({ category }) => {
        if(!category) return null;
        const navigation = useNavigation();
        const { nome, status, id, } = category;
        return (
            <Pressable style={{
                backgroundColor: "#fff",
                paddingVertical: 20, paddingHorizontal: 20,
                borderRadius: 8,
                marginVertical: 8,
            }}
                onPress={() => { navigation.navigate('CategoryEdit', { id: id }) }}
            >
                <Row justify='space-between'>
                    <Column gv={4}>
                        <Title size={20} fontFamily='Font_Medium'>{nome}</Title>
                        <Label>#{id} • {status}</Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch top spacing renderItem={({ item }) => <Card category={item} />} getSearch={searchCategory} getList={listCategory} empty={<CategoryEmpty />} />
        </Column>
    )
}
