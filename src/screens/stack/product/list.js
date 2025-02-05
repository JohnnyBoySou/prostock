import { useState } from "react";
import { Main, Row, colors, Title, Column, Label, Tabs, Button, ListSearch } from "@/ui";
import { PenLine,  FileUp } from "lucide-react-native";
import { Pressable } from 'react-native';

import { listProduct, searchProduct, importProduct } from '@/api/product';

import { useNavigation } from "@react-navigation/native";
import { ProductEmpty } from "@/ui/Emptys/product";

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function ProductListScreen() {

    const [success, setsuccess] = useState();
    const [error, seterror] = useState();

    const handleImportFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                ],
                copyToCacheDirectory: true
            });
    
            if (result.type === 'success') {
                const fileUri = result.uri;
                const base64 = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64
                });
                
                await importProduct(base64);
                setsuccess('Dados importados com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao importar o arquivo:', error);
            seterror(error); 

        }
    };
    
    return (
        <Main>
            <Column style={{ flex: 1 }}>
                <Product />
                <Row gh={12} style={{ position: 'absolute',  bottom: 40, flexGrow: 1,  left: 26, right: 26, }}>
                    <Button label='Criar produto' route="ProductAdd" />
                    <Pressable onPress={handleImportFile} >
                        <Row style={{ backgroundColor: colors.color.blue, width: 64, height: 64, borderRadius: 12,  }} align='center' justify='center'>
                            <FileUp size={24} color='#fff'/>
                        </Row>
                    </Pressable>
                </Row>
            </Column>
        </Main>)
}

const Product = () => {
    const Card = ({ item }) => {
        const navigation = useNavigation();
        const { nome, status, unidade, id, estoque_maximo, estoque_minimo } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('ProductEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome} ({unidade})</Title>
                        <Label>{status} • Mín {estoque_minimo} • Máx {estoque_maximo}</Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch top spacing renderItem={({ item }) => <Card item={item} />} getSearch={searchProduct} getList={listProduct} empty={<ProductEmpty />} />
        </Column>
    )
}
