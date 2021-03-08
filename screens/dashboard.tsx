import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";
import { User } from "../src/interaces/interfacesUsers";

import {
	ProtectedHeader,
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

async function fetchUserGames(jwt: string) {
	const rawResponse = await fetch(
		`${SERVER_API_URL}/getusergameslist?jwt=${jwt}`
	);
	const content = await rawResponse.json();

	return content;
}

export default function Dashboard({ navigation }: any) {
	const [jwt, setJwt] = useState<string>("");
	const [user, setUser] = useState<User>();
	const [games, setGames] = useState<Array<GameSchema>>([]);

	function joinGame() {}

	function createGame() {}

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

	useEffect(() => {
		console.log(jwt, user);
		// if (ENVIRONEMENT != "dev" && (!jwt || !user)) {
		if (!jwt || !user) {
			console.log("there");
			navigation.navigate("Login");
		}
		if (jwt) {
			fetchUserGames(jwt).then((data: any) => {
				setGames(data);
			});
		}
	}, [jwt, user]);

	useEffect(() => {
		if (ENVIRONEMENT == "dev") {
			console.log(games);
		}
	}, [games]);

	return (
		<View>
			<ProtectedHeader />
			<ViewContainer>
				<TextTitle>Mes Contests</TextTitle>

				<LineBreak />
				<View style={{ flexDirection: "row" }}>
					<View style={{ flex: 1 }}>
						<Text>En Cours</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text onPress={joinGame}>Rejoindre</Text>
					</View>
				</View>
				<View style={{ alignItems: "flex-end" }}>
					<Button title={"+ Créer"} onPress={createGame} />
				</View>

				<ScrollView horizontal={true}>
					{games.map((data) => {
						return <GameIcon game={data} />;
					})}
				</ScrollView>

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
