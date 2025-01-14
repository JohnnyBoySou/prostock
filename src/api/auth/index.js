import { fetchWithAuth } from "../../hooks/api";
import { createToken } from "../../hooks/token";
import { selectStore } from "../../hooks/store";

export const loginUser = async (email, password) => {
    try {
        const res = await fetchWithAuth("/auth", { method: "POST", data: { email: email, password: password } });
        await createToken(res.token);
        await selectStore(res.lojas[0])
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const listUser = async () => {
    try {
        const res = await fetchWithAuth("/usuarios/user", { method: "GET"});
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateUser = async (params) => {
    try {
        const res = await fetchWithAuth("/usuarios/user", { method: "PUT", data: params});
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const excludeUser = async (password) => {
    try {
        const res = await fetchWithAuth("/usuarios/user", { method: "DELETE", data: {password: password}});
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
};
