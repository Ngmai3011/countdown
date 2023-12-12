import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import MainScreen from "./components/MainScreen";
import NewCountdown from "./components/NewCountdown";
import CameraScreen from "./components/CameraScreen";
import CountdownScreen from "./components/CountdownScreen";
import EditCountdownScreen from "./components/EditCountdownScreen";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Countdowns"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Countdowns" component={MainScreen} />
        <Stack.Screen name="NewCountdown" component={NewCountdown} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="CountdownScreen" component={CountdownScreen} />
        <Stack.Screen
          name="EditCountdownScreen"
          component={EditCountdownScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
