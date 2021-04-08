import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextTitle,
	LineBreak,
	Button,
	SubText,
	TextInput,
	TextWarning,
	SmallLineBreak,
} from "./Themed";
import { Alert, Image, StyleSheet, ScrollView } from "react-native";
import { GameSchema } from "../src/interaces/interfacesGame";
import { GameIcon } from "./GameIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import { SERVER_API_URL } from "../constants/Server";

async function addUserInAGame(joinCode: string, jwt: string) {
	const rawResponse = await fetch(
		SERVER_API_URL + `/adduserinagame?joinCode=${joinCode}&jwt=${jwt}`
	);
	const content = await rawResponse.json();
	return content;
}

export function MyLeaguesDash(props: any) {
	const [page, setPage] = useState(0); //0 : en cours, 1 : rejoindre
	const [joinCode, setJoinCode] = useState("");
	const [alertJoinCode, setAlertJoinCode] = useState(" ");

	const games: Array<GameSchema> = props.games;
	const navigation: any = props.navigation;
	const jwt: any = props.jwt;
	const username: string = props.username;

	function gotoGame() {
		AsyncStorage.setItem("@joinCode", joinCode).then(
			navigation.navigate("Game")
		);
	}

	function inGame() {
		setPage(0);
	}

	function joinGame() {
		setPage(1);
	}

	function createGame() {
		navigation.navigate("Create");
	}

	function onJoinGame() {
		if (joinCode) {
			addUserInAGame(joinCode, jwt).then((content: any) => {
				if (content.success == 0) {
					switch (content.error) {
						case "UNABLE_TO_JOIN_GAME_IS_CODE_VALID":
							setAlertJoinCode(
								"Impossible de rejoindre la partie, est ce que le code est valide?"
							);
							break;
					}
				} else gotoGame();
			});
		}
	}

	return (
		<View>
			<TextTitle style={{ marginTop:24, }}>Mes Contests</TextTitle>

			<View>
				<View style={{ flexDirection: "row", alignItems:"center", justifyContent: "space-between", marginVertical: 24, }}>
					<View style={{ flexDirection: "row", }}>
						<Text
							style={
								page == 1 ? styles.notSelected : styles.selected
							}
							onPress={inGame}
						>
							En Cours
						</Text>
						<Text
							style={
								page == 0 ? styles.notSelected : styles.selected		
							}
							onPress={joinGame}
						>
							Rejoindre
						</Text>
					</View>

					<Button style={styles.buttonChange} title={"+ Créer"} onPress={createGame} />
				</View>

				{page == 0 ? (
					<ScrollView style={{ overflow:"visible" }}horizontal={true}>
						<GameIcon
							create={1}
							navigation={navigation}
							username={username}
						/>
						{games
							? games.map((data: any) => {
									return (
										<GameIcon
											key={data.joinCode}
											game={data}
											username={username}
											navigation={navigation}
										/>
									);
							  })
							: null}
					</ScrollView>
				) : (
					<View>
						<Text>
							Rejoint un contest existant et éclate tes amis !
						</Text>

						<SubText>Et oublies pas, devient le roi ! </SubText>

						<TextInput
							autoCorrect={false}
							value={joinCode}
							onChangeText={(a) => {
								setJoinCode(a);
							}}
							placeholder={"Rentre ton code de 6 lettres"}
						/>
						<TextWarning>{alertJoinCode}</TextWarning>

						<Button title={"Rejoindre"} onPress={onJoinGame} />
					</View>
				)}
			</View>

			<LineBreak />
		</View>
	);
}

const styles = StyleSheet.create({
	selected: { color: Colors.black, paddingRight: 24 },
	notSelected: { color: Colors.gray, padding: 1 },
	buttonChange: {
		paddingHorizontal: 6,
		paddingVertical: 4,
		height: "auto",
	},
});
