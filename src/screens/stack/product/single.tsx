import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, ScrollVertical, } from "@/ui";
import { type Product, ProductService } from "@/services/product";

import ProductLoading from "./_loading";
import ProductError from "./_error";
import ProductEmpty from "./_empty";
import { Alert } from "react-native";
import { toast } from "../../../hooks/useToast";

export default function ProductSingleScreen({ navigation, route }) {
    const id = route.params.id;
    const { data: product, isLoading, error } = useFetch({
        key: ProductService.get + id,
        fetcher: async () => {
            return await ProductService.get(id);
        }
    });

    if (isLoading) return <ProductLoading />
    if (error) return <ProductError />
    if (!product) return <ProductEmpty />

    return (
        <Main>
            <ScrollVertical>
                <About product={product} navigation={navigation} />
            </ScrollVertical>
        </Main>)
}

const About = ({ product, navigation }: { product: Product, navigation: any }) => {
    const {
        name,
        description,
        unitOfMeasure,
        referencePrice,
        status,
        id,
        stockMin,
        stockMax,
        alertPercentage,
        createdAt,
        updatedAt,
        category,
        supplier,
        store
    } = product;
    const theme = colors();
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const formatUnitOfMeasure = (unit: string) => {
        const units: { [key: string]: string } = {
            'UNIDADE': 'Unidade',
            'KG': 'Quilograma',
            'L': 'Litro',
            'ML': 'Mililitro',
            'M': 'Metro',
            'CM': 'Centímetro',
            'MM': 'Milímetro',
            'UN': 'Unidade',
            'DZ': 'Dúzia',
            'CX': 'Caixa',
            'PCT': 'Pacote',
            'KIT': 'Kit',
            'PAR': 'Par',
            'H': 'Hora',
            'D': 'Dia'
        };
        return units[unit] || unit;
    };

    const handleDelete = () => {
        Alert.alert('Excluir produto', 'Tem certeza que deseja excluir este produto?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', onPress: () => { ProductService.delete(id); toast.showSuccess('Produto excluído com sucesso!'); navigation.navigate('ProductList') }, style: 'destructive' }
        ]);
    }

    return (
        <Column mh={20} gv={20}>
            {/* Header com nome e status */}
            <Pressable
                style={{
                    backgroundColor: theme.color.card,
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    borderColor: theme.color.border,
                    borderWidth: 1,
                }}
                onPress={() => { navigation.navigate('ProductEdit', { id: id }) }}
            >
                <Row justify='space-between' align='center'>
                    <Column gv={8} style={{ flex: 1 }}>
                        <Title size={24} fontFamily='Font_Medium'>
                            {name}
                        </Title>
                        {description && (
                            <Label fontFamily='Font_Medium' color={theme.color.muted}>
                                {description}
                            </Label>
                        )}
                        <Row gv={8}>
                            <Label
                                fontFamily='Font_Medium'
                            >
                                {status ? "Ativo" : "Inativo"}
                            </Label>
                            <Label> • {formatPrice(referencePrice)}</Label>
                        </Row>
                    </Column>
                    <Icon name='PenLine' color={theme.color.primary} size={24} />
                </Row>
            </Pressable>

            {/* Informações básicas */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Informações</Title>

                <Column gv={12}>
                    <InfoRow label="Nome" value={name} />
                    
                    {description && (
                        <InfoRow label="Descrição" value={description} />
                    )}

                    <InfoRow label="Unidade de Medida" value={formatUnitOfMeasure(unitOfMeasure)} />

                    <InfoRow label="Preço de Referência" value={formatPrice(referencePrice)} />

                    {category && (
                        <InfoRow label="Categoria" value={category.name} />
                    )}

                    {supplier && (
                        <InfoRow label="Fornecedor" value={supplier.corporateName} />
                    )}

                    {store && (
                        <InfoRow label="Loja" value={store.name} />
                    )}
                </Column>
            </Column>

            {/* Controle de Estoque */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Controle de Estoque</Title>

                <Column gv={12}>
                    <InfoRow label="Estoque Mínimo" value={`${stockMin} ${formatUnitOfMeasure(unitOfMeasure)}`} />
                    <InfoRow label="Estoque Máximo" value={`${stockMax} ${formatUnitOfMeasure(unitOfMeasure)}`} />
                    <InfoRow label="Percentual de Alerta" value={`${alertPercentage}%`} />
                </Column>
            </Column>

            {/* Datas */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Datas</Title>

                <Column gv={12}>
                    <InfoRow label="Criado em" value={formatDate(createdAt)} />
                    <InfoRow label="Atualizado em" value={formatDate(updatedAt)} />
                </Column>
            </Column>

            {/* Botões de ação */}
            <Row gh={12} mv={20}>
                <Button
                    label="Editar"
                    onPress={() => navigation.navigate('ProductEdit', { id: id })}
                    style={{ flex: 1 }}
                />
                <Button
                    label="Excluir"
                    onPress={handleDelete}
                    variant="destructive"
                    style={{ flex: 1 }}
                />
            </Row>
        </Column>
    )
}

const InfoRow = ({ label, value }: { label: string, value: any }) => {
    const theme = colors();
    return (
        <Row justify='space-between' align='center' pv={12}
            ph={16} style={{
                backgroundColor: theme.color.card,
                borderRadius: 8,
            }}>
            <Label fontFamily='Font_Medium' >{label}:</Label>
            <Label >{value}</Label>
        </Row>
    )
}