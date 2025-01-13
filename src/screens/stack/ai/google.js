import React, { useState, useRef } from 'react';
import { View,  StyleSheet, Pressable,  } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { Main, Column, Label, Title, Button, Image, SCREEN_WIDTH, SCREEN_HEIGHT, colors, Loader, TextArea } from '@/ui';
import { Check, } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export default function OCRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const cameraRef = useRef(null);

  const handleCopy = () => {
    Clipboard.setStringAsync(text);
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      recognizeText(photo.uri);
    }
  };

  const recognizeText = async (imageUri) => {
    const apiKey = 'AIzaSyAtcOwdHVfC_lOVc3WHtWkpYkBmnXMGnnk';
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
      setloading(true);
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

  if (!permission?.granted) {
    return (
      <Column style={{ flex: 1, }} justify='center' align='center'>
        <Title >Você precisa liberar o acesso à câmera para prosseguir.</Title>
        <Button onPress={requestPermission} label="Solicitar permissão" />
      </Column>
    );
  }

  return (
    <Main >
      {image && !text ?
        <Column style={{ flex: 1, }} justify='center' align="center">
          <Column mh={10} gv={16} pv={20} ph={20} style={{ backgroundColor: '#fff', borderRadius: 12, }}>
            <Image source={{ uri: image }} />
            <Loader color={colors.color.primary} size={32} />
            <Column>
              <Title size={22} fontFamily="Font_Medium">Processando dados...</Title>
              <Label>Aguarde enquanto buscamos as informações no documento.</Label>
            </Column>
            <Button onPress={() => setImage(null)} label="Tirar outra foto" />
          </Column>
        </Column> : null}

      {!text && !loading ? <Column mh={26} style={{ flex: 1, }} justify='center' align="center">
        <CameraView style={{ width: SCREEN_WIDTH - 52, height: SCREEN_HEIGHT * .8, borderRadius: 32, }} ref={cameraRef} facing='back'>
          <Column style={{ flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    alignItems: 'center', }}>
            <Pressable onPress={takePicture} style={{ width: 64, height: 64, borderRadius: 100, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', }}>
              <Check size={32} color={colors.color.green} />
            </Pressable>
          </Column>
        </CameraView>
      </Column> : null}

      {text?.length > 0 ?
        <Column gv={16} mh={26} mv={20}>
          <TextArea value={text} />
          <Button label='Copiar resultado' onPress={handleCopy} />
          <Button variant='destructive' onPress={() => { setText(false); setImage(null)}} label="Tirar outra foto" />
        </Column>
        : null
      }
    </Main>
  );
}

const styles = StyleSheet.create({
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  textResult: {
    padding: 10,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});
