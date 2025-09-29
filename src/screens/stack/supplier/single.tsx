import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, ScrollVertical, } from "@/ui";
import { type Supplier, SupplierService } from "@/services/supplier";

import SupplierLoading from "./_loading";
import SupplierError from "./_error";
import SupplierEmpty from "./_empty";
import { Alert } from "react-native";
import { toast } from "../../../hooks/useToast";

export default function SupplierSingleScreen({ navigation, route }) {
    const id = route.params.id;
    const { data: supplier, isLoading, error } = useFetch({
        key: SupplierService.get + id,
        fetcher: async () => {
            return await SupplierService.get(id);
        }
    });

    if (isLoading) return <SupplierLoading />
    if (error) return <SupplierError />
    if (!supplier) return <SupplierEmpty />

    return (
        <Main>
            <ScrollVertical>
                <About supplier={supplier} navigation={navigation} />
            </ScrollVertical>
        </Main>)
}

const About = ({ supplier, navigation }: { supplier: Supplier, navigation: any }) => {
    const {
        corporateName,
        tradeName,
        cnpj,
        status,
        id,
        cep,
        city,
        state,
        address,
        createdAt,
        updatedAt,
        _count
    } = supplier;
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

    const formatCNPJ = (cnpj: string) => {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    };

    const handleDelete = () => {
        Alert.alert('Excluir fornecedor', 'Tem certeza que deseja excluir este fornecedor?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', onPress: () => { SupplierService.delete(id); toast.showSuccess('Fornecedor excluído com sucesso!'); navigation.navigate('SupplierList') }, style: 'destructive' }
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
                onPress={() => { navigation.navigate('SupplierEdit', { id: id }) }}
            >
                <Row justify='space-between' align='center'>
                    <Column gv={8} style={{ flex: 1 }}>
                        <Title size={24} fontFamily='Font_Medium'>
                            {corporateName}
                        </Title>
                        {tradeName && (
                            <Label fontFamily='Font_Medium' color={theme.color.muted}>
                                {tradeName}
                            </Label>
                        )}
                        <Row gv={8}>
                            <Label
                                fontFamily='Font_Medium'
                            >
                                {status ? "Ativo" : "Inativo"}
                            </Label>
                            <Label> • CNPJ: {formatCNPJ(cnpj)}</Label>
                        </Row>
                    </Column>
                    <Icon name='PenLine' color={theme.color.primary} size={24} />
                </Row>
            </Pressable>

            {/* Informações básicas */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Informações</Title>

                <Column gv={12}>
                    <InfoRow label="Razão Social" value={corporateName} />
                    
                    {tradeName && (
                        <InfoRow label="Nome Fantasia" value={tradeName} />
                    )}

                    <InfoRow label="CNPJ" value={formatCNPJ(cnpj)} />

                    {address && (
                        <InfoRow label="Endereço" value={address} />
                    )}

                    {city && (
                        <InfoRow label="Cidade" value={city} />
                    )}

                    {state && (
                        <InfoRow label="Estado" value={state} />
                    )}

                    {cep && (
                        <InfoRow label="CEP" value={cep} />
                    )}
                </Column>
            </Column>

            {/* Estatísticas */}
            {_count && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Estatísticas</Title>

                    <Column gv={12}>
                        <InfoRow label="Total de Produtos" value={_count.products || 0} />
                        <InfoRow label="Total de Movimentações" value={_count.movements || 0} />
                    </Column>
                </Column>
            )}

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
                    onPress={() => navigation.navigate('SupplierEdit', { id: id })}
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