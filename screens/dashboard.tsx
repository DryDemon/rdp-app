import * as React from "react";
import { useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";
import MMKVStorage from "react-native-mmkv-storage";

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

const MMKV = new MMKVStorage.Loader().initialize(); // Returns an MMKV Instance

export default function Dashboard({ navigation }: any) {

	function joinGame() {}

	function createGame() {}

	let jwt = "";

	MMKV.getStringAsync("jwt").then((value) => {
		if (value) jwt = value;
		else
		if (ENVIRONEMENT != "dev") {
			navigation.navigate("Login");
		}
	});



	return (
		<View>
			<ProtectedHeader />
			<ViewContainer>
				<TextTitle>Mes Contests</TextTitle>
				<TextTitle>{jwt}</TextTitle>
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
