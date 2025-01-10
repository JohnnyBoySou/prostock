import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Row, Title, Column, colors, TextArea, Loader, Label, useQuery, Tipo, ScrollVertical, Tabs, Status, fields, validations, Form } from "@/ui";
import { FlatList, Pressable, } from "react-native";
import { Check, } from "lucide-react-native";


import { addMove } from "@/api/move";
import { listSupplier } from '@/api/supplier';
import { listProduct } from '@/api/product';
import { useUser } from '@/context/user';

export default function MoveAddScreen({ navigation }) {

    const [tab, settab] = useState("Produto");
    const types = ["Produto", "Fornecedor", "Observação",];

    const [tipo, settipo] = useState('Entrada');
    const [productId, setproductId] = useState();
    const [supplierId, setsupplierId] = useState();
    const [observation, setobservation] = useState();

    const [productValues, setProductValues] = useState();
    const [supplierValues, setSupplierValues] = useState();

    const [isLoading, setIsLoading] = useState();

    const [success, setsuccess] = useState();
    const [error, seterror] = useState();
    const handleCreate = async () => {
        seterror('')
        setsuccess('')
        setIsLoading(true);
        console.log(productValues)
        console.log(supplierValues)
        try {
            const formatDate = (date) => {
                const [day, month, year] = date.split('/');
                return `${year}-${month}-${day}`;
            };

            const params = {
                tipo: tipo,
                quantidade: productValues.quantidade,
                preco: productValues.preco.slice(3, 0).replace(',', '').replace('.', ''),
                produto_id: productId,
                
                fornecedor_id: supplierId,
                lote: supplierValues.lote,
                validade: formatDate(supplierValues.validade),
                
                observacoes: observation,
            }
            const res = await addMove(params)
            setsuccess(res.message);
            setTimeout(() => {
                navigation.navigate('MoveList');
            }, 1000);
        } catch (error) {
            seterror(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const { data: suppliers, isLoading: loadingSupplier } = useQuery({
        queryKey: ["supplier"],
        queryFn: async () => {
            const res = await listSupplier(); return res.data;
        }
    });
    const { data: products, isLoading: loadingProduct } = useQuery({
        queryKey: ["product"],
        queryFn: async () => {
            const res = await listProduct(); return res.data;
        }
    });

    return (<Main>
        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        {loadingProduct || loadingSupplier ? <Column style={{ flex: 1, }} justify="center" align='center'>
            <Loader size={32} color={colors.color.primary} /></Column> :
            <ScrollVertical>
                {tab === "Produto" && <Product setproductId={setproductId} productId={productId} data={products} settipo={settipo} tipo={tipo} settab={settab} value={productValues} setvalue={setProductValues} />}
                {tab === "Fornecedor" && <Supplier data={suppliers} setsupplierId={setsupplierId} supplierId={supplierId} settab={settab} value={supplierValues} setvalue={setSupplierValues} />}
                {tab === "Observação" && <Observation isLoading={isLoading} value={observation} setvalue={setobservation} handleCreate={handleCreate} />}
                <Column mh={26} mv={26}>
                    <Message error={error} success={success} />
                </Column>
            </ScrollVertical>}
    </Main>)
}

const Product = ({ productId, setproductId, data, settab, setvalue, value, settipo, tipo }) => {
    const fieldKeys = [
        'quantidade',
        'preco',
    ];
    const Card = ({ item }) => {
        const { id, status, nome, unidade } = item;
        return (
            <Pressable onPress={() => { productId ? setproductId() : setproductId(id) }} style={{
                backgroundColor: "#fff",
                borderColor: productId == item?.id ? colors.color.green : "#fff",
                borderWidth: 2,
                paddingVertical: 12, paddingHorizontal: 12,
                borderRadius: 6,
                marginVertical: 6,
            }}>
                <Row justify="space-between" style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome.length > 16 ? nome.slice(0, 16) + '...' : nome}</Title>
                        <Label>{unidade} • {status}</Label>
                    </Column>
                    <Column style={{ width: 36, height: 36, borderColor: productId == item?.id ? colors.color.green : '#d1d1d1', borderWidth: 2, borderRadius: 8, backgroundColor: productId == item?.id ? colors.color.green : '#fff', justifyContent: 'center', alignItems: 'center', }}>
                        <Check color='#FFF' size={24} />
                    </Column>
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <FlatList
                data={productId ? [data.find(item => item.id === productId)] : data}
                ListHeaderComponent={<Column mb={12}>
                    <Label>Produto</Label>
                </Column>}
                style={{ marginHorizontal: 26, }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
            />
            <Column mh={26} mv={16}>
                <Tipo setvalue={settipo} value={tipo} />
            </Column>
            <Form fieldKeys={fieldKeys} initialValues={value} onSubmit={(value) => {
                setvalue(value);
                settab('Fornecedor');
            }} />
        </Column>
    )
}
const Supplier = React.memo(({ supplierId, setsupplierId, data, settab, setvalue, value, }) => {
    const fieldKeys = [
        'lote',
        'validade',
    ];
    const Card = ({ item }) => {
        const { id, status, cep, cidade, cnpj, email, endereco, estado, telefone, cpf_responsavel, email_responsavel, id_loja, nome_fantasia, nome_responsavel, telefone_responsavel } = item;
        return (
            <Pressable onPress={() => { supplierId ? setsupplierId() : setsupplierId(id) }} style={{
                backgroundColor: "#fff",
                borderColor: supplierId == item?.id ? colors.color.green : "#fff",
                borderWidth: 2,
                paddingVertical: 12, paddingHorizontal: 12,
                borderRadius: 6,
                marginVertical: 6,
            }}>
                <Row justify="space-between" style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome_fantasia.length > 16 ? nome_fantasia.slice(0, 16) + '...' : nome_fantasia}</Title>
                        <Label>{cidade} • {status} </Label>
                    </Column>
                    <Column style={{ width: 36, height: 36, borderColor: supplierId == item?.id ? colors.color.green : '#d1d1d1', borderWidth: 2, borderRadius: 8, backgroundColor: supplierId == item?.id ? colors.color.green : '#fff', justifyContent: 'center', alignItems: 'center', }}>
                        <Check color='#FFF' size={24} />
                    </Column>
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <FlatList
                data={supplierId ? [data.find(item => item.id === supplierId)] : data}
                ListHeaderComponent={<Column mb={12}>
                    <Label>Fornecedores</Label>
                </Column>}
                style={{ marginHorizontal: 26, }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <Card item={item} />}
            />
            <Column mv={8} />
            <Form fieldKeys={fieldKeys} initialValues={value} onSubmit={(value) => {
                setvalue(value);
                settab('Observação');
            }} />
        </Column>
    )


})

const Observation = React.memo(({ setvalue, value, isLoading, handleCreate }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleNext = async () => {
        setSuccess("");
        setError("");
        handleCreate()
    };
    return (
        <Column mh={26} gv={26}>
            <TextArea
                label="Observação"
                placeholder="Ex.: Produto com defeito"
                value={value}
                setValue={setvalue}
                focused={true} 
            />
            <Message success={success} error={error} />
            <Button
                label="Criar movimentação"
                onPress={handleNext}
                loading={isLoading}
            />
        </Column>
    )
})

