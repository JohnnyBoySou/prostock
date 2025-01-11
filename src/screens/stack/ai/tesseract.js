import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import Tesseract from 'tesseract.js';

export default function OCRTesseractScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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
      const result = await Tesseract.recognize(
        imageUri, // Caminho da imagem
        'por', // Idioma (use 'por' para português)
        {
          logger: (info) => console.log(info), // Log do progresso
        }
      );
      setText(result.data.text); // Texto extraído
    } catch (error) {
      console.error('Erro no OCR:', error);
      setText('Erro ao processar a imagem.');
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
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
        <Camera style={{ flex: 1 }} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity onPress={takePicture} style={styles.button}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
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
