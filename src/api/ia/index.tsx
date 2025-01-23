import { fetchWithAuth } from "../../hooks/api";

export const sendImage = async (image64: string) => {
    console.log(image64?.slice(0,12))
    try {
        const res = await fetchWithAuth("/usuarios/enviarnota", {
            method: "POST", 
            data: { imagem: image64 }
        });
        console.log(res);
        return res;
    } catch (error) {
        console.error(error.request);
        throw new Error(error.message);
    }
}