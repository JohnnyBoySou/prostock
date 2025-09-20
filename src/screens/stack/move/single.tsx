import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, ScrollVertical } from "@/ui";
import { RefreshControl, FlatList, View } from "react-native";
import { ArrowUpDown, Package, Calendar, User, Store, DollarSign, AlertTriangle, CheckCircle, XCircle } from "lucide-react-native";

import { type Movement, MovementService } from "@/services/movement";

import MoveLoading from "./_loading";
import MoveError from "./_error";
import MoveEmpty from "./_empty";
import { useState } from "react";

export default function MoveSingleScreen({ navigation, route }) {
    const theme = colors();

    const id = route.params.id;
    const { data: movement, isLoading, error, refetch } = useFetch({
        key: `movement-${id}`,
        fetcher: async () => {
            const res = await MovementService.get(id); 
            console.log(res); 
            return res;
        }
    });

    if (isLoading) return <MoveLoading />
    if (error) return <MoveError />
    if (!movement) return <MoveEmpty />

    return (
        <Main>
            <ScrollVertical>
                <MovementCard movement={movement} navigation={navigation} />
            </ScrollVertical>
        </Main>)
}

const MovementCard = ({ movement, navigation }: { movement: Movement, navigation: any }) => {
    const {
        id,
        type,
        quantity,
        price,
        batch,
        expiration,
        note,
        balanceAfter,
        verified,
        verifiedAt,
        verifiedBy,
        cancelled,
        cancelledAt,
        cancelledBy,
        cancellationReason,
        createdAt,
        updatedAt,
        store,
        product,
        supplier,
        user
    } = movement;
    
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ENTRADA':
                return <ArrowUpDown size={24} color={theme.color.green} />;
            case 'SAIDA':
                return <ArrowUpDown size={24} color={theme.color.red} style={{ transform: [{ rotate: '180deg' }] }} />;
            case 'PERDA':
                return <AlertTriangle size={24} color={theme.color.yellow} />;
            default:
                return <Package size={24} color={theme.color.primary} />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'ENTRADA':
                return 'Entrada';
            case 'SAIDA':
                return 'Saída';
            case 'PERDA':
                return 'Perda';
            default:
                return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ENTRADA':
                return theme.color.green;
            case 'SAIDA':
                return theme.color.red;
            case 'PERDA':
                return theme.color.yellow;
            default:
                return theme.color.primary;
        }
    };

    return (
        <Column mh={20} gv={20}>
            {/* Header com tipo e status */}
            <Pressable
                style={{
                    backgroundColor: "#fff",
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                }}
                onPress={() => { navigation.navigate('MoveEdit', { id: id }) }}
            >
                <Row justify='space-between' align='center'>
                    <Column gv={8} style={{ flex: 1 }}>
                        <Row gv={8} align='center'>
                            {getTypeIcon(type)}
                            <Title size={24} fontFamily='Font_Medium' color={getTypeColor(type)}>
                                {getTypeLabel(type)}
                            </Title>
                        </Row>
                        <Row gv={8}>
                            <Label fontFamily='Font_Medium'>
                                Quantidade: {quantity}
                            </Label>
                            {product?.unitOfMeasure && (
                                <Label> • {product.unitOfMeasure}</Label>
                            )}
                        </Row>
                        {price && (
                            <Label fontFamily='Font_Medium' color={theme.color.green}>
                                R$ {price.toFixed(2).replace('.', ',')}
                            </Label>
                        )}
                    </Column>
                    <Column align='center' gv={4}>
                        {verified ? (
                            <CheckCircle size={24} color={theme.color.green} />
                        ) : cancelled ? (
                            <XCircle size={24} color={theme.color.red} />
                        ) : (
                            <Icon name='PenLine' color={theme.color.primary} size={24} />
                        )}
                        <Label size={12} color={verified ? theme.color.green : cancelled ? theme.color.red : theme.color.muted}>
                            {verified ? 'Verificado' : cancelled ? 'Cancelado' : 'Pendente'}
                        </Label>
                    </Column>
                </Row>
            </Pressable>

            {/* Informações do produto */}
            {product && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Produto</Title>
                    <InfoRow 
                        label="Nome" 
                        value={product.name} 
                        icon={<Package size={20} color={theme.color.primary} />}
                    />
                    {product.unitOfMeasure && (
                        <InfoRow label="Unidade" value={product.unitOfMeasure} />
                    )}
                </Column>
            )}

            {/* Informações da loja */}
            {store && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Loja</Title>
                    <InfoRow 
                        label="Nome" 
                        value={store.name} 
                        icon={<Store size={20} color={theme.color.primary} />}
                    />
                </Column>
            )}

            {/* Informações do fornecedor */}
            {supplier && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Fornecedor</Title>
                    <InfoRow 
                        label="Nome" 
                        value={supplier.corporateName} 
                        icon={<User size={20} color={theme.color.primary} />}
                    />
                </Column>
            )}

            {/* Informações da movimentação */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Detalhes da Movimentação</Title>

                <Column gv={12}>
                    <InfoRow label="Quantidade" value={`${quantity} ${product?.unitOfMeasure || ''}`} />
                    
                    {price && (
                        <InfoRow 
                            label="Preço" 
                            value={`R$ ${price.toFixed(2).replace('.', ',')}`}
                            icon={<DollarSign size={20} color={theme.color.green} />}
                        />
                    )}

                    {batch && (
                        <InfoRow label="Lote" value={batch} />
                    )}

                    {expiration && (
                        <InfoRow 
                            label="Validade" 
                            value={formatDate(expiration)}
                            icon={<Calendar size={20} color={theme.color.primary} />}
                        />
                    )}

                    {balanceAfter !== undefined && (
                        <InfoRow 
                            label="Saldo Após" 
                            value={`${balanceAfter} ${product?.unitOfMeasure || ''}`}
                        />
                    )}

                    {note && (
                        <InfoRow label="Observação" value={note} />
                    )}
                </Column>
            </Column>

            {/* Status de verificação */}
            {verified && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Verificação</Title>
                    <Column gv={12}>
                        <InfoRow 
                            label="Status" 
                            value="Verificado" 
                            icon={<CheckCircle size={20} color={theme.color.green} />}
                        />
                        {verifiedAt && (
                            <InfoRow label="Verificado em" value={formatDate(verifiedAt)} />
                        )}
                        {verifiedBy && (
                            <InfoRow label="Verificado por" value={verifiedBy} />
                        )}
                    </Column>
                </Column>
            )}

            {/* Status de cancelamento */}
            {cancelled && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Cancelamento</Title>
                    <Column gv={12}>
                        <InfoRow 
                            label="Status" 
                            value="Cancelado" 
                            icon={<XCircle size={20} color={theme.color.red} />}
                        />
                        {cancelledAt && (
                            <InfoRow label="Cancelado em" value={formatDate(cancelledAt)} />
                        )}
                        {cancelledBy && (
                            <InfoRow label="Cancelado por" value={cancelledBy} />
                        )}
                        {cancellationReason && (
                            <InfoRow label="Motivo" value={cancellationReason} />
                        )}
                    </Column>
                </Column>
            )}

            {/* Informações do usuário */}
            {user && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Usuário</Title>
                    <InfoRow 
                        label="Nome" 
                        value={user.name} 
                        icon={<User size={20} color={theme.color.primary} />}
                    />
                    {user.email && (
                        <InfoRow label="Email" value={user.email} />
                    )}
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
            <Row gv={12} mv={20}>
                <Button
                    label="Editar Movimentação"
                    onPress={() => navigation.navigate('MoveEdit', { id: id })}
                    style={{ flex: 1 }}
                />
            </Row>
        </Column>
    )
}

const InfoRow = ({ label, value, icon }: { label: string, value: any, icon?: any }) => {
    const theme = colors();
    return (
        <Row justify='space-between' align='center' pv={12}
            ph={16} style={{
                backgroundColor: "#fff",
                borderRadius: 8,
            }}>
            <Row gv={8} align='center'>
                {icon}
                <Label fontFamily='Font_Medium'>{label}:</Label>
            </Row>
            <Label>{value}</Label>
        </Row>
    )
}
