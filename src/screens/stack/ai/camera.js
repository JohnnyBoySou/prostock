import React, { useState, useRef } from 'react';
import { Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

import { Main, Column, Label, Title, Button, Image, SCREEN_WIDTH, SCREEN_HEIGHT, colors, Loader, Row } from '@/ui';
import { Check, RotateCw, Camera, Flashlight, SwitchCamera, FlashlightOff } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function OCRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [cameraType, setCameraType] = useState('back');
  const [landscape, setlandscape] = useState();
  const [flash, setflash] = useState(false);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      recognizeText(photo.uri);
    }
  };

  const recognizeText = async (imageUri) => {
    const apiKey = 'YOUR_API_KEY';
    const imageBase64 = await convertToBase64(imageUri);
    setloading(true);
    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageBase64 },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }),
      }
      );
      const result = await response.json();
      const detectedText = result.responses[0]?.fullTextAnnotation?.text || 'No text found';
      setText(detectedText);
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  };

  const convertToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.replace('data:image/jpeg;base64,', ''));
      reader.readAsDataURL(blob);
    });
  };

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

  if (!permission?.granted) {
    return (
      <Column style={{ flex: 1 }} justify='center' align='center'>
        <Title>Você precisa liberar o acesso à câmera para prosseguir.</Title>
        <Button onPress={requestPermission} label="Solicitar permissão" />
      </Column>
    );
  }

  return (
    <Main>
      {image ?
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
      {landscape ? <Row style={{ position: 'absolute', bottom: 20, left: SCREEN_HEIGHT / 3.49,  width: SCREEN_WIDTH, transform: [{ rotate: '0deg' }] }} align='center' justify='center' gh={12}>
      <Pressable onPress={takePicture} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: colors.color.green, justifyContent: 'center', alignItems: 'center' }}>
            <Check size={32} color='#fff' />
          </Pressable>
          <Pressable onPress={toggleCameraType} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
            <SwitchCamera size={32} color={colors.color.green} />
          </Pressable>
          <Pressable onPress={rotateScreen} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor:'#fff', justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name={landscape ? "phone-rotate-landscape" : "phone-rotate-portrait"} size={32} color={colors.color.green} />
          </Pressable>
          <Pressable onPress={() => {setflash(!flash)}} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor:'#fff', justifyContent: 'center', alignItems: 'center' }}>
            {flash ?
              <FlashlightOff size={32} color={colors.color.green} /> :
              <Flashlight size={32} color={colors.color.green} />}
          </Pressable>
      </Row> :
        <Row style={{ position: 'absolute', bottom: 30,  alignSelf: 'center', backgroundColor: '#EDF0F1', borderRadius: 8  }} align='center' justify='center' gh={12} mh={26} pv={8} ph={8}>
          <Pressable onPress={takePicture} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: colors.color.green, justifyContent: 'center', alignItems: 'center' }}>
            <Check size={32} color='#fff' />
          </Pressable>
          <Pressable onPress={toggleCameraType} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
            <SwitchCamera size={32} color={colors.color.green} />
          </Pressable>
          <Pressable onPress={rotateScreen} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor:'#fff', justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name={landscape ? "phone-rotate-landscape" : "phone-rotate-portrait"} size={32} color={colors.color.green} />
          </Pressable>
          <Pressable onPress={() => {setflash(!flash)}} style={{ width: 52, height: 52, borderRadius: 4, backgroundColor:'#fff', justifyContent: 'center', alignItems: 'center' }}>
            {flash ?
              <FlashlightOff size={32} color={colors.color.green} /> :
              <Flashlight size={32} color={colors.color.green} />}
          </Pressable>
        </Row>}
    </Main>
  );
}

