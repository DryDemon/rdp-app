import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";
import { User } from "../src/interaces/interfacesUsers";

import {
	Text,
	View,
	TextInput,
	Button,
	TextMainTitle,
	TextTitle,
	TextLabel,
	ViewContainer,
	ViewCenter,
	TextWarning,
	LineBreak,
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL } from "../constants/Server";
import { GameIcon } from "../components/GameIcon";
import { GameSchema } from "../src/interaces/interfacesGame";
import { MyLeaguesDash } from "../components/MyLeaguesDash";
import { GameHeader } from "../components/gameHeader";

async function fetchUserGames(jwt: string) {
	const rawResponse = await fetch(
		`${SERVER_API_URL}/getusergameslist?jwt=${jwt}` //TODO seulmenent les games en cours
	);
	const content = await rawResponse.json();

	return content;
}

export default function Dashboard({ navigation }: any) {
	const [jwt, setJwt] = useState<string>("");
	const [user, setUser] = useState<User>();
	const [games, setGames] = useState<Array<GameSchema>>([]);

	if (!jwt || !user) {
		try {
			if (!jwt) {
				AsyncStorage.getItem("@jwt").then((value: string | null) => {
					if (value) setJwt(value);
				});
			}
			if (!user) {
				AsyncStorage.getItem("@user").then((value: string | null) => {
					if (value) setUser(JSON.parse(value));
				});
			}
		} catch (e) {
			if (ENVIRONEMENT == "dev") alert(e);
		}
	}


	//onFocus
	navigation.addListener("focus", () => {
		// The screen is focused
		// Call any action

		if (jwt) {
			fetchUserGames(jwt).then((data: any) => {
				if (data?.isConnected == 0) {
					AsyncStorage.setItem("@jwt", "");
					navigation.navigate("Login");
				} else {
					setGames(data);
				}
			});
		}
	});

	useEffect(() => {
		// if (ENVIRONEMENT != "dev" && (!jwt || !user)) {
		if (!jwt && !user) {
			navigation.navigate("Login");
		}
	}, [jwt, user]);

	useEffect(() => {
		if (ENVIRONEMENT == "dev") {
			// AsyncStorage.setItem("@joinCode", "CFEVPU");
			// navigation.navigate("Game");
		}
	}, [games]);

	//if the usergoes back to dashboard, we reload the games
	useEffect(() => {
		if (jwt) {
			fetchUserGames(jwt).then((data: any) => {
				if (data?.isConnected && data.isConnected == 0) {
					AsyncStorage.setItem("@jwt", "");
					AsyncStorage.setItem("@user", "");
					navigation.navigate("Login");
				} else {
					setGames(data);
				}
			});
		}
	}, []);

	return (
		<View>
			<GameHeader />
			<ViewContainer>
				<MyLeaguesDash
					username={user?.username}
					games={games}
					navigation={navigation}
					jwt={jwt}
				/>
				<LineBreak />
			</ViewContainer>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
