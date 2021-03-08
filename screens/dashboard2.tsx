import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";
import {User} from "../src/interaces/interfacesUsers"

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

export default function Dashboard({ navigation }: any) {
	const [jwt, setJwt] = useState("");
	const [user, setUser] = useState<User>();
	function joinGame() {}

	function createGame() {}

	try {
		AsyncStorage.getItem("@jwt").then((value: any) => {
			if (value) setJwt(value);
		});
		AsyncStorage.getItem("@user").then((value: any) => {
			console.log(value)
			if (value) setUser((value));
		});
	} catch (e) {
		if (ENVIRONEMENT == "dev") alert(e);
	}

	useEffect(() => {		
		// if (ENVIRONEMENT != "dev" && (!jwt || !user)) {
		if ((!jwt || !user)) {
			navigation.navigate("Login");
		}
		console.log(user)
	}, [jwt, user])


	return (
		<View>
			<ProtectedHeader />
			<ViewContainer>
				<TextTitle>Mes Contests</TextTitle>
				<TextTitle>{user?.username}</TextTitle>
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

				<ScrollView horizontal={true}></ScrollView>

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
