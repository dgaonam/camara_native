import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import Button from "./components/button/Button";

import { useState, useRef, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Camera, CameraType } from 'expo-camera';

import CardImagen from './components/card/CardImagen';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permisos, setPermisos] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const cameraReferencia = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setPermisos(cameraStatus.status === 'granted');
    })();
  }, []);

  const tomarFoto = async () => {
    if (cameraReferencia) {
      try {
        const data = await cameraReferencia.current.takePictureAsync();
        setImage(data.uri);

        const asset = await MediaLibrary.createAssetAsync(data.uri);
        MediaLibrary.createAlbumAsync('Expo', asset)
          .then(() => {
            console.log('Album created!');
          })
          .catch(error => {
            console.log('err', error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (!permisos) {
    return <View />;
  }

  if (!permisos.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Necesitas permisos para acceder a la camara </Text>
        <Button label={"Permisos"} onHandlerPress={setPermisos} size={20} color={"#FF00FF"} styles={styles} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} flashMwode={0} ref={cameraReferencia}>
        <View style={styles.buttonContainer}>
          <CardImagen url={""} diseño={styles} imagen={image} />

        </View>
      </Camera>
      <View style={styles.buttonContainer}>
        <Button label={"Tomar Foto"} onHandlerPress={tomarFoto} icon={"camera"} size={20} color={"#FF00FF"} styles={styles} />
        <Button label={"Cambiar camara"} onHandlerPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)} icon={"refresh"} size={20} color={"#FF00FF"} styles={styles} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
    margin: 10,
  },
  buttonIcon: {
    paddingRight: 10,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#25292e"
  },
  camera: {
    flex: 1,
    width: '80%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  imageContainer: {
    flex: 1,
    paddingTop: 5,
  },
  image: {
    width: '80%',
    height: '100%',
    borderRadius: 5,
    borderStyle: '1px solid #FFF'
  },
});