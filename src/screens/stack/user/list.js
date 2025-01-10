import { useState, useRef } from "react";
import { Main, Row, Loader, colors, Title, Column, Label, ScrollVertical, Tabs, useQuery, Button } from "@/ui";
import { ChevronRight, PenLine } from "lucide-react-native";
import { FlatList } from 'react-native';
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listUser } from '@/api/user';

export default function UserListScreen() {

    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await listUser(); return res.data;
        }
    });
  
    return (
        <Main>
            {isLoading ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <Column style={{ flex: 1 }}>
                   <Items data={data} />
                    <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                        <Button label='Criar usuário' route="UserAdd" />
                    </Column>
                </Column>
            }
        </Main>)
}

const Items = ({ data }) => {
    const values = [ { name: "NORMAL", id: "regular" }, { name: "ADMIN DE LOJA", id: "adminloja" }, { name: "SUPER ADMIN", id: "superadmin" }, ];
    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { nome, sobrenome, status, tipo, id, uiid, cpf, email, telefone  } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('UserEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome} {sobrenome}</Title>
                        <Label>{status} • {values.find((item) => item.id === tipo).name}</Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <FlatList
                data={data}
                ListHeaderComponent={<Column mb={12}>
                    <Label>Resultados</Label>
                </Column>}
                style={{ marginHorizontal: 26, paddingVertical: 26, }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<Column style={{ height: 200, }}/>}
                renderItem={({ item }) => <Card item={item} />}
            />
        </Column>
    )
}
