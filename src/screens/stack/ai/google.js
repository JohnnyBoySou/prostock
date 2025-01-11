import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function OCRScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
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
          <Text style={styles.textResult}>{text || 'Processing...'}</Text>
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
