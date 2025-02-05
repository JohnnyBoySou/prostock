import { useState } from "react";
import { Main, Row, colors, Title, Column, Label, Button, Loader, Message } from "@/ui";
import { Pressable, Linking } from 'react-native';

import { importProduct } from '@/api/product';
import { importSupplier } from '@/api/supplier';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function ImportScreen({ navigation }) {

    const [success, setsuccess] = useState();
    const [error, seterror] = useState();
    const [type, settype] = useState('PRODUTO');
    const [loading, setloading] = useState(false);

    const handleImportFile = async () => {
        setsuccess('')
        seterror('')
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
                multiple: false
            });
            if (result.assets) {
                setloading(true);
                const fileUri = result.assets[0].uri;
                const base64 = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64
                });
                if (type == 'PRODUTO') {
                    const res = await importProduct(base64);
                    setsuccess(res.message);
                } else if (type == 'FORNECEDOR') {
                    const res = await importSupplier(base64);
                    setsuccess(res.message);
                }
            }
        } catch (error) {
            console.error('Erro ao importar o arquivo:', error);
            seterror(error.message);
        } finally {
            setloading(false);
        }
    };

    const handleDownloadTemplate = async (type) => {
        let url = type == 'FORNECEDOR' ? 'https://api.erp.cruzrepresentacoes.com.br/template/fornecedor.csv' : 'https://api.erp.cruzrepresentacoes.com.br/template/produto.csv';
        await Linking.canOpenURL(url);
    };


    return (
        <Main>
            <Column style={{ flex: 1 }}>
                <Column mh={20} gv={8} mv={20}>
                    <Title align='center'>Importar produtos ou fornecedores</Title>
                    <Label align='center'>Selecione o tipo de importação que deseja fazer</Label>
                    <Row gh={12} mv={12} style={{ alignSelf: 'center' }}>
                        <Pressable style={{ backgroundColor: type == 'PRODUTO' ? colors.color.primary : colors.color.primary + 20, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6 }} onPress={() => { settype('PRODUTO') }} >
                            <Label style={{ color: type == 'PRODUTO' ? "#fff" : colors.color.primary, fontFamily: 'Font_Medium' }}>PRODUTO</Label>
                        </Pressable>
                        <Pressable style={{ backgroundColor: type == 'FORNECEDOR' ? colors.color.primary : colors.color.primary + 20, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6 }} onPress={() => { settype('FORNECEDOR') }} >
                            <Label style={{ color: type == 'FORNECEDOR' ? "#fff" : colors.color.primary, fontFamily: 'Font_Medium' }}>FORNECEDOR</Label>
                        </Pressable>
                    </Row>

                    <Column>
                        {loading ? <Loader size={32} color={colors.color.blue} /> :
                            <>
                                <Pressable style={{ backgroundColor: colors.color.blue + 20, gap: 20, borderWidth: 1, borderColor: colors.color.blue, borderStyle: 'dashed', paddingVertical: 32, paddingHorizontal: 20, borderRadius: 6 }} onPress={handleImportFile} >
                                    <Column style={{ borderWidth: 2, borderColor: colors.color.blue, borderRadius: 8, }} pv={12} ph={20} mh={40}>
                                        <Label style={{ color: colors.color.blue, fontFamily: 'Font_Medium', textAlign: 'center' }}>Selecionar arquivo</Label>
                                    </Column>
                                    <Label style={{ fontFamily: 'Font_Book', textAlign: 'center' }}>Arquivos aceitos: .csv</Label>
                                </Pressable>
                                <Pressable onPress={handleDownloadTemplate} style={{ marginVertical: 12, }}>
                                    <Label style={{ textDecorationLine: 'underline', textAlign: 'center', color: colors.color.blue, }}>Baixar modelo</Label>
                                </Pressable>
                            </>
                        }
                    </Column>
                    <Message error={error} success={success} />

                   
                </Column>
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    <Button label='Voltar' route='Home' variant='ghost' />
                    </Column>
            </Column>
        </Main>)
}
