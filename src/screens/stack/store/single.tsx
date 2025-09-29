import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, ScrollVertical, } from "@/ui";
import { type Store, StoreService } from "@/services/store";

import StoreLoadingScreen from "./_loading";
import StoreError from "./_error";
import StoreEmpty from "./_empty";
import { Alert } from "react-native";
import { toast } from "../../../hooks/useToast";

export default function StoreSingleScreen({ navigation, route }) {
    const id = route.params.id;
    const { data: store, isLoading, error } = useFetch({
        key: ['store', id],
        fetcher: async () => {
            return await StoreService.single(id);
        }
    });

    if (isLoading) return <StoreLoadingScreen />
    if (error) return <StoreError />
    if (!store) return <StoreEmpty />

    return (
        <Main>
            <ScrollVertical>
                <About store={store} navigation={navigation} />
            </ScrollVertical>
        </Main>)
}

const About = ({ store, navigation }: { store: Store, navigation: any }) => {
    const {
        name,
        cnpj,
        email,
        phone,
        status,
        id,
        cep,
        city,
        state,
        address,
        createdAt,
        updatedAt,
        owner,
        _count
    } = store;
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

    const formatPhone = (phone: string) => {
        return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    };

    const formatCEP = (cep: string) => {
        return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    };

    const handleDelete = () => {
        Alert.alert('Excluir loja', 'Tem certeza que deseja excluir esta loja?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', onPress: () => { StoreService.delete(id); toast.showSuccess('Loja excluída com sucesso!'); navigation.navigate('StoreList') }, style: 'destructive' }
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
                onPress={() => { navigation.navigate('StoreEdit', { id: id }) }}
            >
                <Row justify='space-between' align='center'>
                    <Column gv={8} style={{ flex: 1 }}>
                        <Title size={24} fontFamily='Font_Medium'>
                            {name}
                        </Title>
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
                    <InfoRow label="Nome" value={name} />
                    <InfoRow label="CNPJ" value={formatCNPJ(cnpj)} />
                    <InfoRow label="Email" value={email} />
                    <InfoRow label="Telefone" value={formatPhone(phone)} />
                </Column>
            </Column>

            {/* Endereço */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Endereço</Title>

                <Column gv={12}>
                    <InfoRow label="CEP" value={formatCEP(cep)} />
                    <InfoRow label="Cidade" value={city} />
                    <InfoRow label="Estado" value={state} />
                    <InfoRow label="Endereço" value={address} />
                </Column>
            </Column>

            {/* Proprietário */}
            {owner && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Proprietário</Title>

                    <Column gv={12}>
                        <InfoRow label="Nome" value={owner.name} />
                        <InfoRow label="Email" value={owner.email} />
                    </Column>
                </Column>
            )}

            {/* Estatísticas */}
            {_count && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Estatísticas</Title>

                    <Column gv={12}>
                        <InfoRow label="Total de Produtos" value={_count.products || 0} />
                        <InfoRow label="Total de Usuários" value={_count.users || 0} />
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
                    onPress={() => navigation.navigate('StoreEdit', { id: id })}
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