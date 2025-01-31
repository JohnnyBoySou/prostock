import React, { useState, useRef, useEffect } from 'react';
import { Pressable } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

import { Main, Column, Label, Title, Button, SCREEN_WIDTH, SCREEN_HEIGHT, colors, Loader, Row } from '@/ui';
import { Check, Flashlight, SwitchCamera, FlashlightOff } from 'lucide-react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

//API
import { sendImage } from '@/api/ia';

export default function OCRScreen({ navigation, route }) {
  const anexo = route?.params?.anexo;
  useEffect(() => { 
    if (anexo) {
      pickImage()
    }
  }, []);

  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const [cameraType, setCameraType] = useState('back');
  const [flash, setflash] = useState(false);
  const cameraRef = useRef();

  const toggleCameraType = () => {
    setCameraType((prevType) => (prevType === 'back' ? 'front' : 'back'));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      recognizeText(result.assets[0].base64);
    }
  };

  const [landscape, setlandscape] = useState();
  const rotateScreen = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      setlandscape(true);

    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setlandscape(false);
    }
  };


  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });

      recognizeText(photo.base64);
    }
  };

  const recognizeText = async (base64Image) => {
    setloading(true);
    try {
      const res = await sendImage(base64Image);
      navigation.navigate('AIResult', { data: res });
    } catch (error) {
      console.error(error);
      seterror(error)
    } finally {
      console.log('Processamento finalizado');
      setloading(false);
    }
  };

  const [permission, requestPermission] = useCameraPermissions();
  if (!permission) { return <Column />; }
  if (!permission?.granted) {
    return (
      <Column style={{ flex: 1 }} justify='center' align='center' mh={36} gv={32}>
        <Title align='center'>Você precisa liberar o acesso à câmera para prosseguir.</Title>
        <Button onPress={requestPermission} label="Solicitar permissão" />
      </Column>
    );
  }


  return (
    <Main style={{ backgroundColor: '#fff', }}>
      {loading ?
        <Column style={{ flex: 1 }} justify='center' align="center">
          <Column mh={10} gv={16} pv={20} ph={20} style={{ borderRadius: 12 }}>
            <Loader color={colors.color.primary} size={32} />
            {error ? <Column gv={12}>
              <Title size={22} fontFamily="Font_Medium">Tivemos um erro</Title>
              <Label>Algo deu errado e não conseguimos extrair dados da sua imagem.</Label>
              <Button label="Tentar novamente" onPress={() => { navigation.goBack() }} />
            </Column> : <Column gv={12}>
              <Title size={22} fontFamily="Font_Medium">Processando dados...</Title>
              <Label>Aguarde enquanto buscamos as informações no documento.</Label>
              <Button label="Aguarde um momento" />
            </Column>}
          </Column>
        </Column>
        :
        <Column style={{ width: landscape ? SCREEN_HEIGHT : SCREEN_WIDTH, height: landscape ? SCREEN_WIDTH : SCREEN_HEIGHT, }} >
          <CameraView
            style={{ flex: 1, }}
            mode='picture'
            onCameraReady={() => { console.log('Camera pronta') }}
            onMountError={(error) => { console.error(error) }}
            ref={cameraRef}
            facing={cameraType}
            enableTorch={flash}
          />
          {landscape ? <Row style={{ position: 'absolute', bottom: 50, left: SCREEN_HEIGHT / 3.49, width: SCREEN_WIDTH, transform: [{ rotate: '0deg' }] }} align='center' justify='center' gh={12}>
            <Pressable onPress={takePicture} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: colors.color.green, justifyContent: 'center', alignItems: 'center' }}>
              <Check size={32} color='#fff' />
            </Pressable>
            <Pressable onPress={toggleCameraType} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <SwitchCamera size={32} color={colors.color.green} />
            </Pressable>
            <Pressable onPress={rotateScreen} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name={landscape ? "phone-rotate-landscape" : "phone-rotate-portrait"} size={32} color={colors.color.green} />
            </Pressable>
            <Pressable onPress={pickImage} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name="upload-file" size={32} color={colors.color.green} />
            </Pressable>
            <Pressable onPress={() => { setflash(!flash) }} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              {flash ?
                <FlashlightOff size={32} color={colors.color.green} /> :
                <Flashlight size={32} color={colors.color.green} />}
            </Pressable></Row> :
            <Row style={{ position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: '#EDF0F1', borderRadius: 8 }} align='center' justify='center' gh={12} mh={26} pv={8} ph={8}>
              <Pressable onPress={takePicture} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: colors.color.green, justifyContent: 'center', alignItems: 'center' }}>
                <Check size={32} color='#fff' />
              </Pressable>
              <Pressable onPress={toggleCameraType} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <SwitchCamera size={32} color={colors.color.green} />
              </Pressable>
              <Pressable onPress={rotateScreen} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name={landscape ? "phone-rotate-landscape" : "phone-rotate-portrait"} size={32} color={colors.color.green} />
              </Pressable>
              <Pressable onPress={pickImage} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="upload-file" size={32} color={colors.color.green} />
              </Pressable>
              <Pressable onPress={() => { setflash(!flash) }} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                {flash ?
                  <FlashlightOff size={32} color={colors.color.green} /> :
                  <Flashlight size={32} color={colors.color.green} />}
              </Pressable>
            </Row>}
        </Column>
      }

    </Main>
  );
}
