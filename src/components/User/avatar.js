import React, { useEffect, useState } from 'react';
import { MotiImage } from 'moti';
import { Button } from '@theme/global';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getPreferences } from '@api/user/preferences';

const Avatar = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [img, setimg] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const usr = await getPreferences();
            if (usr?.avatar != null){
                setimg({uri: usr?.avatar});
            } else {
                setimg(require('@imgs/user_placeholder.png'));
            }
        };
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    return(     
        <Button onPress={() => { navigation.navigate('Account'); }} style={{ borderRadius: 100 }}>
            <MotiImage 
                from={{ opacity: 0, scale: 0.6 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 400 }} 
                source={img} 
                style={{ width: 40, height: 40, borderRadius: 100 }} 
            />
        </Button>
    );
};

export default Avatar;
