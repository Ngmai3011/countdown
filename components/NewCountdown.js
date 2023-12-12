import {StatusBar} from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {Header, Input} from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useState, useEffect} from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {ColorPicker} from "react-native-color-picker";
import convert from "color-convert";
import {push, ref} from "firebase/database";
import {database} from "../firebase/database";
import {getTomorrow} from "../utils/getTomorrow";

const default_image = require("../assets/default-image.png");
const imageUri = Image.resolveAssetSource(default_image).uri;

export default function NewCountdown({navigation, route}) {
  const [countdown, setCountDown] = useState({
    name: "",
    image: null,
    date: getTomorrow(),
    color: "red",
  });

  const inputChanged = (name, value) => {
    setCountDown({...countdown, [name]: value});
  };

  useEffect(() => {
    if (route.params) {
      const {imageName} = route.params;
      setCountDown({image: imageName});
    }
  }, [route]);

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCountDown({image: result.assets[0].uri});
    }
  };

  const handleSaved = () => {
    push(ref(database, "data/"), {
      name: countdown.name || "CountDown",
      image: countdown.image || imageUri,
      date: countdown.date.toString() || getTomorrow().toString(),
      color: countdown.color,
    });
    navigation.navigate("Countdowns");
  };

  const handleColorChange = (color) => {
    const rgb = convert.hsv.rgb([color.h, 100, 100]);
    const hexColor = convert.rgb.hex(rgb);
    inputChanged("color", `#${hexColor}`);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Header
          containerStyle={styles.header}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.navigate("Countdowns")}>
              <Text style={styles.headerComponents}> Cancel </Text>
            </TouchableOpacity>
          }
          centerComponent={{
            text: "New Countdown",
            style: {color: "#fff", fontSize: 18, fontWeight: "bold"},
          }}
          rightComponent={
            <TouchableOpacity onPress={handleSaved}>
              <Text style={styles.headerComponents}> Save </Text>
            </TouchableOpacity>
          }
        />
        <Input
          containerStyle={styles.nameInput}
          inputStyle={{color: "white"}}
          placeholder="Name your countdown"
          label="Pick a name"
          onChangeText={(name) => inputChanged("name", name)}
          value={countdown.name}
        />

        <Text style={styles.sectionLabel}>Pick an image</Text>
        <View style={styles.imageInput}>
          <Icon
            type="material"
            name="photo-camera"
            onPress={() => navigation.navigate("CameraScreen")}
            style={styles.imageIcon}
          />
          <Icon
            type="material"
            name="image"
            onPress={handleChooseImage}
            style={styles.imageIcon}
          />
        </View>
        {countdown.image && (
          <Image source={{uri: countdown.image}} style={styles.image} />
        )}

        <Text style={styles.sectionLabel}>Pick a date</Text>
        <DateTimePicker
          style={styles.datePicker}
          value={countdown.date || getTomorrow()}
          mode="datetime"
          themeVariant="dark"
          accentColor="rgb(250, 114, 114)"
          onChange={(_, date) => inputChanged("date", date)}
        />
        <Text style={styles.sectionLabel}>Pick a color</Text>
        <View style={styles.colorPicker}>
          <ColorPicker
            color={countdown.color}
            onColorChange={(color) => handleColorChange(color)}
            style={{flex: 1, width: 300}}
            hideSliders
          />
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  header: {
    paddingBottom: 18,
    backgroundColor: "rgb(250, 114, 114)",
  },
  headerComponents: {
    fontSize: 18,
    color: "#800000",
    fontWeight: "bold",
  },
  nameInput: {
    marginTop: 18,
  },
  sectionLabel: {
    color: "rgb(134, 147, 158)",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  imageInput: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 24,
  },
  imageIcon: {
    fontSize: 50,
    color: "white",
  },
  image: {
    width: 300,
    height: 200,
    marginTop: 30,
    alignSelf: "center",
  },
  datePicker: {
    marginTop: 32,
    marginBottom: 24,
    alignSelf: "center",
  },
  colorPicker: {height: 350, alignSelf: "center"},
});
