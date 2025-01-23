import React, { useState, useRef } from 'react';
import { Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

import { Main, Column, Label, Title, Button, Image, SCREEN_WIDTH, SCREEN_HEIGHT, colors, Loader, Row } from '@/ui';
import { Check, Flashlight, SwitchCamera, FlashlightOff, Truck, LayoutGrid } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import  { manipulateAsync, SaveFormat} from 'expo-image-manipulator';

//API
import { sendImage } from '@/api/ia';

export default function OCRScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState(null);
  const [cameraType, setCameraType] = useState('back');
  const [landscape, setlandscape] = useState();
  const [flash, setflash] = useState(false);
  const cameraRef = useRef(null);

  const toggleCameraType = () => {
    setCameraType((prevType) => (prevType === 'back' ? 'front' : 'back'));
  };

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

  const [data, setdata] = useState();
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,  // Reduz a qualidade da imagem, se necessário
        base64: true,  // Obtém a imagem como base64 diretamente
      });
      const manipResult = await manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],  
        { compress: 0.5, format: SaveFormat.JPEG } 
      );
  
      setImage(manipResult.uri);  
      recognizeText(manipResult.base64);
    }
  };
   
  const recognizeText = async (base64Image) => {
    setloading(true);
    try {
      const res = await sendImage(base64Image);
      console.log(res);
      setdata(res);
    } catch (error) {
      console.log('Erro ao enviar a imagem');
      console.error(error);
    } finally {
      console.log('Processamento finalizado');
      setloading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <Column style={{ flex: 1 }} justify='center' align='center' mh={26}>
        <Title>Você precisa liberar o acesso à câmera para prosseguir.</Title>
        <Button onPress={requestPermission} label="Solicitar permissão" />
      </Column>
    );
  }

  return (
    <Main>
      {data ? <Column style={{ flex: 1 }} justify='center' align="center">
        <Label style={{ marginBottom: 6, }}>Inteligência Artificial</Label>
        <Title align='center' size={24}>O que você deseja fazer com esses dados?</Title>
          <Row justify='space-between' gh={12} mv={24} mh={26}>
            <Pressable onPress={() => { navigation.navigate('SupplierAdd',  {data: data}) }} style={{ padding: 16, borderWidth: 2, borderColor: '#FFB238', flexGrow: 1, borderRadius: 12, rowGap: 12, backgroundColor: '#FFF0D7', }}>
              <Truck size={32} color='#FFB238' />
              <Title size={16} fontFamily="Font_Medium" color='#FFB238'>Criar {'\n'}Movimentação</Title>
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('ProductAdd', {data: data}) }} style={{ padding: 16,  borderWidth: 2, borderColor: '#3590F3', flexGrow: 4, borderRadius: 12, rowGap: 12, backgroundColor: '#D7E9FD', }}>
              <LayoutGrid size={32} color='#3590F3' />
              <Title size={16} fontFamily="Font_Medium" color='#3590F3'>Criar {'\n'}Produto</Title>
            </Pressable>
          </Row>
      </Column> :
        <>
          {loading ?
            <Column style={{ flex: 1 }} justify='center' align="center">
              <Column mh={10} gv={16} pv={20} ph={20} style={{ backgroundColor: '#fff', borderRadius: 12 }}>
                <Image source={{ uri: image }} />
                <Loader color={colors.color.primary} size={32} />
                <Column>
                  <Title size={22} fontFamily="Font_Medium">Processando dados...</Title>
                  <Label>Aguarde enquanto buscamos as informações no documento.</Label>
                </Column>
                <Button onPress={() => setImage(null)} label="Tirar outra foto" />
              </Column>
            </Column>
            :
            <Column style={{ flex: 1 }} justify='center' align="center">
              <CameraView style={{ width: '100%', height: SCREEN_HEIGHT + 50, }} ref={cameraRef} facing={cameraType} autofocus enableTorch={flash} />
            </Column>
          }

          {landscape ? <Row style={{ position: 'absolute', bottom: 20, left: SCREEN_HEIGHT / 3.49, width: SCREEN_WIDTH, transform: [{ rotate: '0deg' }] }} align='center' justify='center' gh={12}>
            <Pressable onPress={takePicture} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: colors.color.green, justifyContent: 'center', alignItems: 'center' }}>
              <Check size={32} color='#fff' />
            </Pressable>
            <Pressable onPress={toggleCameraType} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <SwitchCamera size={32} color={colors.color.green} />
            </Pressable>
            <Pressable onPress={rotateScreen} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name={landscape ? "phone-rotate-landscape" : "phone-rotate-portrait"} size={32} color={colors.color.green} />
            </Pressable>
            <Pressable onPress={() => { setflash(!flash) }} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              {flash ?
                <FlashlightOff size={32} color={colors.color.green} /> :
                <Flashlight size={32} color={colors.color.green} />}
            </Pressable>
          </Row> :
            <Row style={{ position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#EDF0F1', borderRadius: 8 }} align='center' justify='center' gh={12} mh={26} pv={8} ph={8}>
              <Pressable onPress={takePicture} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: colors.color.green, justifyContent: 'center', alignItems: 'center' }}>
                <Check size={32} color='#fff' />
              </Pressable>
              <Pressable onPress={toggleCameraType} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <SwitchCamera size={32} color={colors.color.green} />
              </Pressable>
              <Pressable onPress={rotateScreen} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name={landscape ? "phone-rotate-landscape" : "phone-rotate-portrait"} size={32} color={colors.color.green} />
              </Pressable>
              <Pressable onPress={() => { setflash(!flash) }} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                {flash ?
                  <FlashlightOff size={32} color={colors.color.green} /> :
                  <Flashlight size={32} color={colors.color.green} />}
              </Pressable>
            </Row>}
        </>}
    </Main>
  );
}

