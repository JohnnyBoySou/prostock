import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'; 
import { CameraView, useCameraPermissions } from 'expo-camera';


export default function OCRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
 
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const cameraRef = useRef(null);


  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      recognizeText(photo.uri);
    }
  };

  const recognizeText = async (imageUri) => {
    const apiKey = 'SUA_CHAVE_API_AQUI';
    const imageBase64 = await convertToBase64(imageUri);

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
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
          <Text style={styles.textResult}>{text || 'Processing...'}</Text>
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
