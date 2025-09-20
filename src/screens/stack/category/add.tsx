import React, { useState } from "react";
import { Main, Button, Column, Input, ScrollVertical, Status, useMutation, useToast } from "@/ui";
import { KeyboardAvoidingView } from "react-native";
import { CategoryService } from "@/services/category";
import { useQueryClient } from "@tanstack/react-query";

export default function CategoryAddScreen({ navigation }) {
    const toast = useToast();
    const queryClient = useQueryClient();
    
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

    const createCategoryMutation = useMutation({
        mutationFn: async (params: any) => {
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

    const handleCreate = () => {
        const params = {
            name: aboutValues.name,
            description: aboutValues.description,
            code: aboutValues.code,
            color: aboutValues.color,
            icon: aboutValues.icon,
            status: status,
        };

        createCategoryMutation.mutate(params);
    }


    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            <ScrollVertical>
                <About setStatus={setStatus} status={status} loading={createCategoryMutation.isLoading} aboutValues={aboutValues} setAboutValues={setAboutValues} handleCreate={handleCreate} />
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
                label="Criar categoria"
                loading={loading}
                onPress={handleSubmit}
            />
        </Column>
    )
})



