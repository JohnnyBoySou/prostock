import React, { useRef } from "react";
import { Main, Button, Column, Input, ScrollVertical, Status, useMutation, useToast, Icon, colors, Label } from "@/ui";
import { KeyboardAvoidingView, FlatList, TouchableOpacity, Text, TextInput } from "react-native";
import { CategoryService } from "@/services/category";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "O nome da categoria é obrigatório")
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .max(50, "O nome deve ter no máximo 50 caracteres")
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras e espaços"),

    description: z
        .string()
        .max(200, "A descrição deve ter no máximo 200 caracteres")
        .optional()
        .or(z.literal("")),

    code: z
        .string()
        .min(1, "O código da categoria é obrigatório")
        .min(3, "O código deve ter pelo menos 3 caracteres")
        .max(20, "O código deve ter no máximo 20 caracteres")
        .regex(/^[A-Z0-9]+$/, "O código deve conter apenas letras maiúsculas e números"),

    color: z.string().min(1, "A cor é obrigatória"),
    icon: z.string().min(1, "O ícone é obrigatório"),
    status: z.boolean()
});

type CategoryFormData = z.infer<typeof categorySchema>;

const COLORS = [
    { id: '1', color: '#FF6B6B', name: 'Vermelho' },
    { id: '2', color: '#4ECDC4', name: 'Turquesa' },
    { id: '3', color: '#45B7D1', name: 'Azul' },
    { id: '4', color: '#96CEB4', name: 'Verde' },
    { id: '5', color: '#FFEAA7', name: 'Amarelo' },
    { id: '6', color: '#DDA0DD', name: 'Roxo' },
    { id: '7', color: '#FFB347', name: 'Laranja' },
    { id: '8', color: '#87CEEB', name: 'Azul Claro' },
    { id: '9', color: '#98FB98', name: 'Verde Claro' },
    { id: '10', color: '#F0E68C', name: 'Cáqui' },
    { id: '11', color: '#FFB6C1', name: 'Rosa' },
    { id: '12', color: '#D3D3D3', name: 'Cinza' }
];

const ICONS = [
    { id: '2', name: 'Package', label: 'Pacote' },
    { id: '3', name: 'Tag', label: 'Etiqueta' },
    { id: '4', name: 'Box', label: 'Caixa' },
    { id: '5', name: 'Layers', label: 'Camadas' },
    { id: '6', name: 'Grid', label: 'Grade' },
    { id: '7', name: 'Folder', label: 'Pasta' },
    { id: '8', name: 'Archive', label: 'Arquivo' },
    { id: '9', name: 'Bookmark', label: 'Marcador' },
];

interface FormProps {
    control: any;
    errors: any;
    loading: boolean;
    onSubmit: () => void;
}

const ColorSelector = ({ selectedColor, onSelect }: { selectedColor: string, onSelect: (color: string) => void }) => {
    const theme = colors();
    const renderColorItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => onSelect(item.color)}
            style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: item.color,
                margin: 8,
                borderWidth: selectedColor === item.color ? 3 : 1,
                borderColor: selectedColor === item.color ? "#000" : '#ccc',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />
    );

    return (
        <Column>
            <Label size={16}>Selecione uma cor</Label>
            <FlatList
                data={COLORS}
                renderItem={renderColorItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </Column>
    );
};

const IconSelector = ({ selectedIcon, onSelect }: { selectedIcon: string, onSelect: (icon: string) => void }) => {
    const theme = colors();
    const renderIconItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => onSelect(item.name)}
            style={{
                width: 60,
                height: 70,
                flexGrow: 1,
                borderRadius: 8,
                backgroundColor: selectedIcon === item.name ? theme.color.green : '#f5f5f5',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: selectedIcon === item.name ? 2 : 1,
                borderColor: selectedIcon === item.name ? theme.color.green : '#ccc'
            }}
        >
            <Icon name={item.name} size={24} color={selectedIcon === item.name ? "#fff" : theme.color.label} />
        </TouchableOpacity>
    );

    return (
        <Column>
            <Label size={16}>Selecione um ícone</Label>
            <FlatList
                data={ICONS}
                renderItem={renderIconItem}
                keyExtractor={(item) => item.id}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingVertical: 12, }}
                columnWrapperStyle={{ gap: 12 }}
            />
        </Column>
    );
};

export default function CategoryAddScreen({ navigation }) {
    const toast = useToast();
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            code: "",
            color: COLORS[0].color,
            icon: ICONS[0].name,
            status: true,
        },
        mode: "onChange"
    });

    const createCategoryMutation = useMutation({
        mutationFn: async (params: CategoryFormData) => {
            return await CategoryService.create(params);
        },
        onSuccess: () => {
            toast.showSuccess('Categoria criada com sucesso!');
            queryClient.invalidateQueries({ queryKey: CategoryService.keys.list });
            setTimeout(() => {
                navigation.replace('CategoryList');
            }, 1000);
        },
        onError: (error) => {
            toast.showError(error.message || 'Erro ao criar categoria');
        }
    });

    const onSubmit = (data: CategoryFormData) => {
        createCategoryMutation.mutate(data);
    };

    return (
        <Main>
            <KeyboardAvoidingView behavior="padding">
                <ScrollVertical>
                    <Form
                        control={control}
                        errors={errors}
                        loading={createCategoryMutation.isLoading}
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </ScrollVertical>
            </KeyboardAvoidingView>
        </Main>
    )
}

const Form = React.memo(({ control, errors, loading, onSubmit }: FormProps) => {
    const nameRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const codeRef = useRef<TextInput>(null);

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={nameRef}
                        label="Nome da categoria"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: Eletrônicos"
                        keyboardType="default"
                        errorMessage={errors.name?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => descriptionRef.current?.focus()}
                    />
                )}
            />

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={descriptionRef}
                        label="Descrição"
                        value={value || ""}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex: Categoria de eletrônicos"
                        keyboardType="default"
                        errorMessage={errors.description?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => codeRef.current?.focus()}
                    />
                )}
            />

            <Controller
                control={control}
                name="code"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={codeRef}
                        label="Código"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: ELET001"
                        keyboardType="default"
                        errorMessage={errors.code?.message}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                            // No último campo, podemos fechar o teclado ou submeter o formulário
                            codeRef.current?.blur();
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name="color"
                render={({ field: { onChange, value } }) => (
                    <ColorSelector
                        selectedColor={value}
                        onSelect={onChange}
                    />
                )}
            />
            {errors.color && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {errors.color.message}
                </Text>
            )}

            <Controller
                control={control}
                name="icon"
                render={({ field: { onChange, value } }) => (
                    <IconSelector
                        selectedIcon={value}
                        onSelect={onChange}
                    />
                )}
            />
            {errors.icon && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {errors.icon.message}
                </Text>
            )}

            <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                    <Status setValue={onChange} value={value} />
                )}
            />

            <Button
                label="Criar categoria"
                loading={loading}
                onPress={onSubmit}
            />
        </Column>
    )
})