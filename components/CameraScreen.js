import React, {useState, useEffect, useRef} from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Camera, CameraType} from "expo-camera";

export default function CameraScreen({navigation}) {
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [hasCameraPermission, setPermission] = useState(null);
  const [imageName, setImageName] = useState("");

  const camera = useRef(null);

  useEffect(() => {
    askCameraPermission();
  }, []);

  const askCameraPermission = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync();
    setPermission(status == "granted");
  };

  const handleCapture = async () => {
    if (camera) {
      const image = await camera.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      setImageName(image.uri);
    }
  };

  const handleFlipCamera = () => {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return (
    <View style={styles.container}>
      <Icon
        type="material"
        name="close"
        onPress={() => navigation.navigate("NewCountdown")}
        style={styles.closeIcon}
      />
      <Icon
        type="material"
        name="flip-camera-ios"
        onPress={handleFlipCamera}
        style={styles.flipIcon}
      />
      <Icon
        type="material"
        name="done"
        onPress={() => navigation.navigate("NewCountdown", {imageName})}
        style={styles.doneIcon}
      />
      {hasCameraPermission ? (
        <View>
          <Camera
            style={{flex: 4, minWidth: "100%", marginTop: 42}}
            ref={camera}
            type={cameraType}
          />
          <Icon
            type="material"
            name="brightness-1"
            onPress={handleCapture}
            style={styles.captureIcon}
          />
          <View>
            {imageName && <Image source={{uri: imageName}} style={{flex: 4}} />}
          </View>
        </View>
      ) : (
        <Text>No access to camera</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    zIndex: 2,
    fontSize: 30,
    color: "white",
    paddingTop: 60,
    paddingLeft: 12,
    alignSelf: "flex-start",
  },
  flipIcon: {
    position: "absolute",
    zIndex: 2,
    fontSize: 30,
    color: "white",
    paddingTop: 60,
    alignSelf: "center",
  },
  captureIcon: {
    position: "absolute",
    zIndex: 2,
    fontSize: 80,
    color: "white",
    paddingTop: 700,
    alignSelf: "center",
  },
  doneIcon: {
    position: "absolute",
    zIndex: 2,
    fontSize: 30,
    color: "white",
    paddingTop: 60,
    paddingRight: 12,
    alignSelf: "flex-end",
  },
});
