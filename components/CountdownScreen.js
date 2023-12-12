import {StatusBar} from "expo-status-bar";
import {StyleSheet, View, Text, TouchableOpacity, Image} from "react-native";
import {Header, Dialog} from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialIcons";
import {SafeAreaProvider} from "react-native-safe-area-context";
import React, {useState, useEffect} from "react";
import CountDown from "react-native-countdown-component";
import {options} from "../utils/dateFormatOptions";
import {remove, ref} from "firebase/database";
import {database} from "../firebase/database";

export default function CountdownScreen({navigation, route}) {
  const [countDown, setCountDown] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (route.params) {
      const {item} = route.params;
      setCountDown(item);
    }
  }, [route]);

  const targetDate = new Date(countDown.date);
  if (isNaN(targetDate)) {
    return null;
  }
  const now = new Date();

  const secondsUntil = (targetDate - now) / 1000;

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    targetDate
  );

  const handleDelete = () => {
    remove(ref(database, "data/" + countDown.id));
    handleClose();
    navigation.navigate("Countdowns");
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: countDown.color,
          alignItems: "center",
        }}>
        <Header
          containerStyle={{backgroundColor: countDown.color, paddingBottom: 24}}
          placement="left"
          centerComponent={
            <TouchableOpacity
              onPress={() => navigation.navigate("Countdowns")}
              style={styles.left_right_header}>
              <Icon
                type="material"
                reverse
                color="white"
                name="arrow-back-ios"
                size={24}
              />
              <Text style={styles.headerComponents}> Countdowns </Text>
            </TouchableOpacity>
          }
          rightComponent={
            <View style={styles.left_right_header}>
              <Icon
                type="material"
                name="edit"
                reverse
                color="white"
                size={28}
                style={{marginRight: 18}}
                onPress={() =>
                  navigation.navigate("EditCountdownScreen", {countDown})
                }
              />
              <Icon
                type="material"
                name="delete"
                reverse
                color="white"
                size={28}
                onPress={handleOpen}
              />
            </View>
          }
        />
        <Dialog isVisible={visible} onBackdropPress={handleOpen}>
          <Dialog.Title title="Are you sure you want to delete?" />
          <Dialog.Actions>
            <Dialog.Button
              title="Yes"
              onPress={handleDelete}
              titleStyle={{color: "#F08080"}}
            />
            <Dialog.Button
              title="No"
              onPress={handleClose}
              titleStyle={{color: "#F08080"}}
            />
          </Dialog.Actions>
        </Dialog>

        {countDown.image && (
          <Image source={{uri: countDown.image}} style={styles.image} />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{countDown.name}</Text>
          <Text style={styles.date}>{countDown.date && formattedDate}</Text>
        </View>

        <CountDown
          until={secondsUntil} // seconds
          size={35}
          onFinish={() => alert("Countdown finished")}
          digitStyle={{backgroundColor: "white"}}
          digitTxtStyle={{color: countDown.color}}
          timeToShow={["D", "H", "M", "S"]}
          timeLabels={{d: "days", h: "hours", m: "minutes", s: "seconds"}}
          timeLabelStyle={{color: "white"}}
        />

        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerComponents: {
    fontSize: 28,
    color: "white",
  },
  left_right_header: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 150,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 30,
  },
  info: {
    marginTop: 36,
    alignItems: "center",
    marginBottom: 48,
  },
  name: {
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 16,
    color: "white",
  },
  date: {
    fontSize: 18,
    color: "white",
  },
});
