import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/dashboard";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase";
import { firebaseConfig } from "./constants/FirebaseConfig";

const Stack = createStackNavigator();

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default function App() {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Dashboard">
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="Dashboard" component={Dashboard} />
					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		);
	}
}
