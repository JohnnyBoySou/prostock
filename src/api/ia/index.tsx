import { fetchWithAuth } from "../../hooks/api";

export const sendImage = async (image64: string) => {
    try {
        const res = await fetchWithAuth("/usuarios/enviarnota", {
            method: "POST", 
            data: { imagem: image64 }
         });
        return res;
    } catch (error) {
        console.error(error.request);
        throw new Error(error.message);
    }
}