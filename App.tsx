import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/dashboard";
import Create from "./screens/create";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ENVIRONEMENT } from "./constants/Environement";

import { useFonts } from "expo-font";
import { Font } from "expo";

import GameInfo from "./screens/gameInfo";
import GameClassement from "./screens/gameClassement";
import GameListBets from "./screens/gameListBets";
import GameCart from "./screens/gameCart";
import GamePlayerStats from "./screens/gamePlayerStats";

const Stack = createStackNavigator();

let customFonts = {
	"Neue Haas Grotesk Display Pro":
		"require('./assets/fonts/NeueHaasDisplayMedium.otf')",
	Orkney: "require('./assets/fonts/orkney-medium.otf')",
};

export default function App() {

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
						<Stack.Screen name="Create" component={Create} />
						
						<Stack.Screen name="gameInfo" component={GameInfo} />
						<Stack.Screen name="gameClassement" component={GameClassement} />
						<Stack.Screen name="gameListBets" component={GameListBets} />
						<Stack.Screen name="gameCart" component={GameCart} />
						<Stack.Screen name="gamePlayerStats" component={GamePlayerStats} />

					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		);
	}
}
