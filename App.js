import React from 'react';
import { StyleSheet, View } from 'react-native';
import SearchForBusStop from './app/screens/SearchForBusStop';
import LiveBusTimes from './app/screens/LiveBusTimes';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from "./app/classes/AppColors";
import * as Permissions from 'expo-permissions';

const Stack = createStackNavigator();

export default function App() {
  const [permission, askPermission, getPermission] = Permissions.usePermissions(Permissions.LOCATION, { ask: true });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SearchForBusStop">
        <Stack.Screen
          name="SearchForBusStop"
          component={SearchForBusStop}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="LiveBusTimes"
          component={LiveBusTimes}
          options={
            ({ route }) => ({
              title: "Stop " + route.params["stopId"],
              headerStyle: {
                backgroundColor: colors.green1,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              }
            })
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
