import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, ScrollVertical, Tabs } from "@/ui";
import { type Category, CategoryService } from "@/services/category";

import CategoryLoading from "./_loading";
import CategoryError from "./_error";
import CategoryEmpty from "./_empty";
import { useState } from "react";

export default function CategorySingleScreen({ navigation, route }) {
    const id = route.params.id;
    const { data: categories, isLoading, error } = useFetch({
        key: CategoryService.keys.single + id,
        fetcher: async () => {
            return await CategoryService.single(id);
        }
    });

    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Estatísticas"];

    if (isLoading) return <CategoryLoading />
    if (error) return <CategoryError />
    if (!categories) return <CategoryEmpty />

    return (
        <Main>
            <Column>
                <Tabs types={types} value={tab} setValue={settab} />
            </Column>
            <ScrollVertical>
                {tab === "Sobre" && <About category={categories} navigation={navigation} />}
                {tab === "Estatísticas" && <Stats category={categories} />}
            </ScrollVertical>
        </Main>)
}

const Stats = ({ category, }: { category: Category, }) => {
    const { _count } = category;
    const theme = colors();
    return (
        <Column mh={20} gv={20}>
            {/* Estatísticas */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Estatísticas</Title>
                <Row gh={12}>
                    <StatCard
                        title="Produtos"
                        value={_count.products}
                        color={theme.color.primary}
                    />
                    <StatCard
                        title="Subcategorias"
                        value={_count.children}
                        color={theme.color.green}
                    />
                </Row>
            </Column>

        </Column>
    )
}

const About = ({ category, navigation }: { category: Category, navigation: any }) => {
    const {
        name,
        status,
        id,
        description,
        code,
        color,
        icon,
        parentId,
        createdAt,
        updatedAt,
        parent,
        children,
        products,
        _count
    } = category;
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

    return (
        <Column mh={20} gv={20}>
            {/* Header com nome e status */}
            <Pressable
                style={{
                    backgroundColor: "#fff",
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                }}
                onPress={() => { navigation.navigate('CategoryEdit', { id: id }) }}
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
                            {code && (
                                <>
                                    <Label  > • Código: {code}</Label>
                                </>
                            )}
                        </Row>
                    </Column>
                    <Icon name='PenLine' color={theme.color.primary} size={24} />
                </Row>
            </Pressable>

            {/* Informações básicas */}
            <Column gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Informações</Title>

                <Column gv={12}>
                    {description && (
                        <InfoRow label="Descrição" value={description} />
                    )}

                    {code && (
                        <InfoRow label="Código" value={code} />
                    )}

                    {color && (
                        <InfoRow
                            label="Cor"
                            value={
                                <Row align='center' gv={8}>
                                    <Column
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            backgroundColor: color,
                                            borderWidth: 1,
                                            borderColor: theme.color.muted
                                        }}
                                    />
                                </Row>
                            }
                        />
                    )}

                    {icon && (
                        <InfoRow label="Ícone" value={icon} />
                    )}

                    {parent && (
                        <InfoRow label="Categoria Pai" value={parent.name} />
                    )}
                </Column>
            </Column>


            {/* Produtos 
            {products && products.length > 0 && (
                <Column gv={16}>
                    <Title size={18} fontFamily='Font_Medium'>Produtos ({products.length})</Title>

                    <Column gv={8}>
                        {products.map((product, index) => (
                            <ProductItem key={product.id || index} product={product} />
                        ))}
                    </Column>
                </Column>
            )}*/}

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
                    label="Editar Categoria"
                    onPress={() => navigation.navigate('CategoryEdit', { id: id })}
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
                backgroundColor: "#fff",
                borderRadius: 8,
            }}>
            <Label fontFamily='Font_Medium' >{label}:</Label>
            <Label >{value}</Label>
        </Row>
    )
}

const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => {
    const theme = colors();
    return (
        <Column
            align='center'
            pv={12}
            ph={16}
            style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                flex: 1,
                marginHorizontal: 4,
            }}
        >
            <Title size={24} fontFamily='Font_Bold' color={color}>{value}</Title>
            <Label fontFamily='Font_Medium'>{title}</Label>
        </Column>
    )
}

const ProductItem = ({ product }: { product: any }) => {
    const theme = colors();
    return (
        <Row
            justify='space-between'
            align='center'
            style={{
                backgroundColor: "#fff",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderLeftWidth: 3,
                borderLeftColor: theme.color.primary,
            }}
        >
            <Column gv={4}>
                <Label fontFamily='Font_Medium'>{product.name}</Label>
                {product.description && (
                    <Label color={theme.color.muted} size={12}>{product.description}</Label>
                )}
            </Column>
            <Label
                color={product.status ? theme.color.green : theme.color.red}
                fontFamily='Font_Medium'
                size={12}
            >
                {product.status ? "Ativo" : "Inativo"}
            </Label>
        </Row>
    )
}