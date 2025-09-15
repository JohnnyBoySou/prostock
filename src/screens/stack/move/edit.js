import React, { useState, useEffect } from "react";
import { Main, Button, Message, Row, Title, ListSearch, Column, colors, TextArea, Loader, Label, useQuery, Tipo, ScrollVertical, Tabs, Form } from "@/ui";
import { Pressable, KeyboardAvoidingView } from "react-native";
import { Check, } from "lucide-react-native";

import { editMove, showMove } from "@/services/movement";
import { listSupplier, searchSupplier } from 'src/services/supplier';
import { listProduct, searchProduct } from 'src/services/product';
import ProductEmpty from "@/ui/Emptys/product";
import SupplierEmpty from "@/ui/Emptys/supplier";

export default function MoveEditScreen({ navigation, route }) {

    const id = route?.params?.id ? route.params?.id : 1;
    const [tab, settab] = useState("Produto");
    const types = ["Produto", "Fornecedor", "Observação",];

    const { data: move, isLoading: loadingMove } = useQuery({
        queryKey: [`supplier edit ${id}`],
        queryFn: async () => {
            const res = await showMove(id); return res;
        }
    });

    useEffect(() => {
        if (move) {
            settipo(move?.tipo);
            setproductId(move?.produto_id?.id);
            setsupplierId(move?.fornecedor_id);
            setobservation(move?.observacoes);
            setProductValues({
                quantidade: String(move?.quantidade),
                preco: move?.preco,
            });
            setSupplierValues({
                lote: move?.lote,
                validade: formatDateToDDMMYYYY(move?.validade),
            });
        }
    }, [move]);

    const formatDate = (date) => {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    };
    const formatDateToDDMMYYYY = (date) => {
        const [year, month, day] = date?.split(' ')[0]?.split('-');
        return `${day}/${month}/${year}`;
    };

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
        try {
            const params = {
                tipo: tipo,
                quantidade: productValues.quantidade,
                preco: productValues.preco.slice(3).replace(',', '.'),
                produto_id: productId,

                fornecedor_id: supplierId,
                lote: supplierValues.lote,
                validade: formatDate(supplierValues.validade),

                observacoes: observation,
            }
            const res = await editMove(id, params)
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


    return (<Main>
        <KeyboardAvoidingView behavior="padding">

        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        {loadingMove  ? <Column style={{ flex: 1, }} justify="center" align='center'>
            <Loader size={32} color={colors.color.primary} /></Column> :
            <ScrollVertical>
                {!loadingMove && <>
                    {tab === "Produto" && <Product setproductId={setproductId} productId={productId} settipo={settipo} tipo={tipo} settab={settab} value={productValues} setvalue={setProductValues} />}
                </>}
                {tab === "Fornecedor" && <Supplier setsupplierId={setsupplierId} supplierId={supplierId} settab={settab} value={supplierValues} setvalue={setSupplierValues} />}
                {tab === "Observação" && <Observation isLoading={isLoading} value={observation} setvalue={setobservation} handleCreate={handleCreate} />}
                <Column mh={26} mv={26}>
                    <Message error={error} success={success} />
                </Column>
                </ScrollVertical>}
        </KeyboardAvoidingView>
            
    </Main>)
}

const Product = ({ productId, setproductId,settab, setvalue, value, settipo, tipo }) => {
    if (!value) return null;
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
                        <Title size={20} fontFamily='Font_Medium'>{nome?.length > 16 ? nome?.slice(0, 16) + '...' : nome}</Title>
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
            <ListSearch  selectID={productId} spacing={false} renderItem={({ item }) => <Card item={item} />} getSearch={searchProduct} getList={listProduct} empty={<ProductEmpty />} />
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
const Supplier = React.memo(({ supplierId, setsupplierId, settab, setvalue, value, }) => {
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
                        <Title size={20} fontFamily='Font_Medium'>{nome_fantasia?.length > 16 ? nome_fantasia?.slice(0, 16) + '...' : nome_fantasia}</Title>
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
            <ListSearch spacing={false} selectID={supplierId} renderItem={({ item }) => <Card item={item} />} getSearch={searchSupplier} getList={listSupplier} empty={<SupplierEmpty />} />
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
                label="Salvar"
                onPress={handleNext}
                loading={isLoading}
            />
        </Column>
    )
})

