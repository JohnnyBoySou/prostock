import React, { useState, useEffect } from "react";
import { Main, Button, Column, Input, ScrollVertical, Status, useFetch, useMutation, useToast } from "@/ui";
import { CategoryService } from "@/services/category";
import { KeyboardAvoidingView } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import CategoryLoading from "./_loading";

export default function CategoryEditScreen({ navigation, route }) {

    const toast = useToast();
    const id = route?.params?.id ? route.params.id : 1;
    const queryClient = useQueryClient();
    const { data: category, isLoading } = useFetch
        ({
            key: [...CategoryService.keys.single, id],
            fetcher: async () => {
                const res = await CategoryService.single(id); console.log(res); return res;
            }
        });

    const [status, setStatus] = useState<boolean>(true);
    const [aboutValues, setAboutValues] = useState<{
        name: string,
        description: string,
        code: string,
        color: string,
        icon: string
    }>({
        name: "",
        description: "",
        code: "",
        color: "",
        icon: "",
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async (params) => {
            return await CategoryService.update(id, params);
        },
        onSuccess: () => {
            toast.showSuccess('Categoria atualizada com sucesso!');
            queryClient.invalidateQueries({ queryKey: [...CategoryService.keys.single, id] });
            queryClient.invalidateQueries({ queryKey: CategoryService.keys.list });
            setTimeout(() => {
                navigation.navigate('CategoryList');
            }, 1000);
        },
        onError: (error) => {
            toast.showError(error.message || 'Erro ao atualizar categoria');
        }
    });

    const handleCreate = () => {
        const params = {
            name: aboutValues.name,
            description: aboutValues.description,
            code: aboutValues.code,
            color: aboutValues.color,
            icon: aboutValues.icon,
            status: status,
        };

        updateCategoryMutation.mutate(params);
    }


    useEffect(() => {
        if (category) {
            setAboutValues({
                name: category.name || "",
                description: category.description || "",
                code: category.code || "",
                color: category.color || "",
                icon: category.icon || "",
            });
            setStatus(category.status);
        }
    }, [category]);

    if (isLoading) return <CategoryLoading />

    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            <ScrollVertical>
                <About setStatus={setStatus} status={status} loading={updateCategoryMutation.isLoading} aboutValues={aboutValues} setAboutValues={setAboutValues} handleCreate={handleCreate} />
            </ScrollVertical>
        </KeyboardAvoidingView>
    </Main>)
}

interface AboutProps {
    aboutValues: {
        name: string,
        description: string,
        code: string,
        color: string,
        icon: string
    };
    loading: boolean;
    setAboutValues: React.Dispatch<React.SetStateAction<{
        name: string,
        description: string,
        code: string,
        color: string,
        icon: string
    }>>;
    setStatus: React.Dispatch<React.SetStateAction<boolean>>;
    status: boolean;
    handleCreate: () => void;
}

const About = React.memo(({ aboutValues, loading, setAboutValues, setStatus, status, handleCreate }: AboutProps) => {
    const toast = useToast();
    const handleChange = (field: string, value: string) => {
        setAboutValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!aboutValues.name.trim()) {
            toast.showError("Por favor, insira o nome da categoria.");
            return;
        }
        handleCreate();
    };

    return (
        <Column mh={26} gv={26}>
            <Input
                label="Nome da categoria"
                value={aboutValues.name}
                setValue={(value) => handleChange("name", value)}
                placeholder="Ex.: Eletrônicos"
                keyboardType="default"
            />

            <Input
                label="Descrição"
                value={aboutValues.description}
                setValue={(value) => handleChange("description", value)}
                placeholder="Descrição da categoria"
                keyboardType="default"
            />

            <Input
                label="Código"
                value={aboutValues.code}
                setValue={(value) => handleChange("code", value)}
                placeholder="Ex.: ELET001"
                keyboardType="default"
            />

            <Input
                label="Cor"
                value={aboutValues.color}
                setValue={(value) => handleChange("color", value)}
                placeholder="Ex.: #FF5733"
                keyboardType="default"
            />

            <Input
                label="Ícone"
                value={aboutValues.icon}
                setValue={(value) => handleChange("icon", value)}
                placeholder="Ex.: icon-name"
                keyboardType="default"
            />

            <Status setvalue={setStatus} value={status} />

            <Button
                label="Salvar"
                loading={loading}
                onPress={handleSubmit}
            />
        </Column>
    )
})



