import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/dashboard";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ENVIRONEMENT } from "./constants/Environement";
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

let customFonts = {
	"Neue Haas Grotesk Display Pro":
		"require('./assets/fonts/NeueHaasDisplayMedium.otf')",
	"Orkney": "require('./assets/fonts/orkney-medium.otf')",
};

export default function App() {
  
  useFonts(customFonts);


  const isLoadingComplete = useCachedResources();

	let InitialRoute = "Login";

	if (ENVIRONEMENT != "dev") InitialRoute = "Login";
	else InitialRoute = "Dashboard";

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false,
						}}
						initialRouteName={InitialRoute}
					>
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="Dashboard" component={Dashboard} />
					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		);
	}
}
