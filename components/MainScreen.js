import {StatusBar} from "expo-status-bar";
import {StyleSheet, View, FlatList, Text} from "react-native";
import {Header, Button, Dialog} from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialIcons";
import {SafeAreaProvider} from "react-native-safe-area-context";
import React, {useState, useEffect} from "react";
import {ref, onValue, remove} from "firebase/database";
import {database} from "../firebase/database";

const buttonIcon = (
  <Icon
    type="material"
    reverse
    color="white"
    name="add-circle-outline"
    size={30}
  />
);

const defaultIcon = (
  <Icon type="material" reverse color="white" name="event-note" size={30} />
);

export default function MainScreen({navigation}) {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const dataRef = ref(database, "data/");
    onValue(dataRef, (snapshot) => {
      const countDownData = snapshot.val();
      dataWithKey = Object.keys(countDownData).map((key) => ({
        id: key,
        ...countDownData[key],
      }));
      setData(dataWithKey);
    });
  }, []);

  const CustomTitle = (item) => {
    return (
      <View style={{flexDirection: "column"}}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 24,
            color: "white",
            marginLeft: 24,
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            fontStyle: "italic",
            fontSize: 14,
            color: "white",
            marginLeft: 24,
          }}>
          {item.date.slice(0, 15)}
        </Text>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <Button
      icon={defaultIcon}
      title={CustomTitle(item)}
      onPress={() => navigation.navigate("CountdownScreen", {item})}
      buttonStyle={{
        backgroundColor: item.color,
        borderRadius: 20,
        height: 60,
      }}
      containerStyle={{
        width: 380,
        marginTop: 16,
      }}
      iconContainerStyle={{paddingRight: 30}}
      onLongPress={() => handleOpen(item.id)}
    />
  );

  const handleDelete = () => {
    remove(ref(database, "data/" + current));
    handleClose();
    navigation.navigate("Countdowns");
  };

  const handleOpen = (id) => {
    setVisible(true);
    setCurrent(id);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          placement="left"
          centerComponent={{
            text: "Countdowns",
            style: {
              color: "#fff",
              fontWeight: "bold",
              fontSize: 36,
            },
          }}
        />
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{color: "white"}}>No countdown</Text>
          }
        />

        <Button
          icon={buttonIcon}
          title=" New Countdown"
          onPress={() => navigation.navigate("NewCountdown")}
          buttonStyle={{
            backgroundColor: "#F08080",
            borderRadius: 30,
            height: 60,
          }}
          containerStyle={{
            width: 250,
            marginBottom: 24,
            marginTop: 12,
          }}
          titleStyle={{fontWeight: "bold", fontSize: 24}}
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
        <StatusBar style="auto" />
      </View>
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
    paddingBottom: 24,
    backgroundColor: "#F08080",
  },
});
