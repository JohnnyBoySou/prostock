import React, { useState } from "react";
import { Main, Button, Message, Row, Search, Title, Column, colors, TextArea, Loader, Label, ListSearch, useInfiniteQuery, useQuery, Tipo, ScrollVertical, Tabs, Status, fields, validations, Form, Input } from "@/ui";
import { FlatList, Pressable, KeyboardAvoidingView } from "react-native";
import { Check, Key, } from "lucide-react-native";

import { MovementService, type CreateMovementRequest } from "@/services/movement";
import { SupplierService } from 'src/services/supplier';
import { ProductService } from 'src/services/product';
import { ProductEmpty } from "@/ui/Emptys/product";
import { SupplierEmpty } from '@/ui/Emptys/supplier';

export default function MoveAddScreen({ navigation, route }) {

    const data = route?.params?.data

    const [tab, settab] = useState("Produto");
    const types = ["Produto", "Fornecedor", "Observação",];

    const [type, setType] = useState<'ENTRADA' | 'SAIDA' | 'PERDA'>('ENTRADA');
    const [productId, setProductId] = useState(data?.productId);
    const [supplierId, setSupplierId] = useState(data?.supplierId);
    const [storeId, setStoreId] = useState(data?.storeId || 'default-store-id'); // TODO: Implementar seleção de loja
    const [note, setNote] = useState<string>('');

    const [productValues, setProductValues] = useState({
        quantity: data?.quantity || 0,
        price: data?.price || 0,
    });
    const [supplierValues, setSupplierValues] = useState<{
        batch?: string;
        expiration?: string;
    }>({});

    const [isLoading, setIsLoading] = useState(false);

    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handleCreate = async () => {
        setError('')
        setSuccess('')
        setIsLoading(true);
        try {
            const formatDate = (date: string) => {
                const [day, month, year] = date.split('/');
                return `${year}-${month}-${day}`;
            };

            const params: CreateMovementRequest = {
                type: type,
                quantity: productValues.quantity,
                storeId: storeId,
                productId: productId!,
                supplierId: supplierId,
                batch: supplierValues.batch,
                expiration: supplierValues.expiration ? formatDate(supplierValues.expiration) : undefined,
                price: productValues.price > 0 ? productValues.price : undefined,
                note: note || undefined,
            }

            const res = await MovementService.create(params);
            setSuccess('Movimentação criada com sucesso!');
            setTimeout(() => {
                navigation.replace('MoveList');
            }, 1000);
        } catch (error: any) {
            setError(error.message || 'Erro ao criar movimentação');
        } finally {
            setIsLoading(false);
        }
    }

    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            <Column>
                <Tabs types={types} value={tab} setValue={settab} />
            </Column>
            <ScrollVertical>
                {tab === "Produto" && <Product setProductId={setProductId} productId={productId} setType={setType} type={type} settab={settab} value={productValues} setvalue={setProductValues} />}
                {tab === "Fornecedor" && <Supplier setSupplierId={setSupplierId} supplierId={supplierId} settab={settab} value={supplierValues} setvalue={setSupplierValues} />}
                {tab === "Observação" && <Observation isLoading={isLoading} value={note} setvalue={setNote} handleCreate={handleCreate} />}
                <Column mh={26} mv={26}>
                    <Message error={error} success={success} />
                </Column>
            </ScrollVertical>
        </KeyboardAvoidingView>
    </Main>)
}

const Product = ({ productId, setProductId, settab, setvalue, value, setType, type }: any) => {
    const theme = colors();
    const fieldKeys = [
        'quantity',
        'price',
    ];
    const Card = ({ item }) => {
        if (!item) return null;
        const { id, status, nome, unidade } = item;
        return (
            <Pressable onPress={() => { productId ? setProductId(undefined) : setProductId(id) }} style={{
                backgroundColor: "#fff",
                borderColor: productId == item?.id ? theme.color.green : "#fff",
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
                    <Column style={{ width: 36, height: 36, borderColor: productId == item?.id ? theme.color.green : '#d1d1d1', borderWidth: 2, borderRadius: 8, backgroundColor: productId == item?.id ? theme.color.green : '#fff', justifyContent: 'center', alignItems: 'center', }}>
                        <Check color='#FFF' size={24} />
                    </Column>
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch refresh={false} selectID={productId} spacing={false} renderItem={({ item }) => <Card item={item} />} getSearch={ProductService.search} getList={ProductService.list} empty={<ProductEmpty />} />
            <Column  mv={16}>
                <Tipo setvalue={setType} value={type} spacing/>
            </Column>
            <Form fieldKeys={fieldKeys} initialValues={value} onSubmit={setvalue} />
        </Column>
    )
}

const Supplier = React.memo(({ supplierId, setSupplierId, settab, setvalue, value, }: any) => {
    const theme = colors();
    const fieldKeys = [
        'batch',
        'expiration',
    ];
    const Card = ({ item }) => {
        const { id, status, cidade, nome_fantasia } = item;
        return (
            <Pressable onPress={() => { supplierId ? setSupplierId(undefined) : setSupplierId(id) }} style={{
                backgroundColor: "#fff",
                borderColor: supplierId == item?.id ? theme.color.green : "#fff",
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
                    <Column style={{ width: 36, height: 36, borderColor: supplierId == item?.id ? theme.color.green : '#d1d1d1', borderWidth: 2, borderRadius: 8, backgroundColor: supplierId == item?.id ? theme.color.green : '#fff', justifyContent: 'center', alignItems: 'center', }}>
                        <Check color='#FFF' size={24} />
                    </Column>
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch refresh={false} selectID={supplierId} spacing={false} renderItem={({ item }) => <Card item={item} />} getSearch={SupplierService.search} getList={SupplierService.list} empty={<SupplierEmpty />} />
            <Column mv={8} />
            <Form fieldKeys={fieldKeys} initialValues={value} onSubmit={setvalue} />
        </Column>
    )
})

const Observation = React.memo(({ setvalue, value, isLoading, handleCreate }: any) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleNext = async () => {
        setSuccess("");
        setError("");
        handleCreate()
    };
    return (
        <Column mh={26} gv={26}>
            <Input
                label="Observação"
                placeholder="Ex.: Produto com defeito"
                value={value}
                setValue={setvalue}
                multiline={true}
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

