import { getPreferences } from '@hooks/preferences';

const getToken = async () => {
    const preferences = await getPreferences();
    if (preferences?.token) {
        return preferences.token;
    }
    return null;
}

export default getToken;
