import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator , Button, } from 'react-native';
import Tesseract from 'tesseract.js';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function OCRTesseractScreen() {
  
  const [permission, requestPermission] = useCameraPermissions();

  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);


  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      recognizeText(photo.uri);
    }
  };

  const recognizeText = async (imageUri) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(imageUri, 'por',{logger: (info) => console.log(info),});
      setText(result.data.text); 
    } catch (error) {
      console.error('Erro no OCR:', error);
      setText('Erro ao processar a imagem.');
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {image ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: image }} style={{ flex: 1 }} />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.textResult}>{text || 'Processing...'}</Text>
          )}
          <TouchableOpacity onPress={() => setImage(null)} style={styles.button}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView style={{ flex: 1 }} ref={cameraRef} facing='back'>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity onPress={takePicture} style={styles.button}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
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
