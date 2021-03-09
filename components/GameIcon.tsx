import React from "react";
import { SERVER_LOGO_URL } from "../constants/Server";
import { View, Text, TextTitle, SubText } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import { GameSchema } from "../src/interaces/interfacesGame";
import AsyncStorage from "@react-native-async-storage/async-storage";
import plusIcon from "../assets/images/plusIcon.svg"

function validURL(str: string) {
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
		"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(str);
}

export function GameIcon(props: any) {
	const game: GameSchema = props.game;
	const create = props.create;
	const navigation: any = props.navigation;

	function gotoGame(joinCode: string) {
		AsyncStorage.setItem("@joinCode", joinCode);
		navigation.navigate("GamePrincipal")
	}

	let url: string = SERVER_LOGO_URL;
	if (game && game.logoUrl && validURL(game.logoUrl)) {
		url = game.logoUrl;
	}

	if (create == 1) {
		return (
			<TouchableOpacity onPress={() => navigation.navigate("Create")}>
				<View style={styles.gameContainer}>
					<Image
						style={styles.gameLogo}
						source={plusIcon}
					/>
					<TextTitle style={styles.gameTitle}>Créer un contest</TextTitle>
					<SubText style={styles.gameSubText}>et invites tes potes</SubText>
				</View>
			</TouchableOpacity>
		);

	}
	if (game) {
		return (
			<TouchableOpacity onPress={() => gotoGame(game.joinCode)}>
				<View style={styles.gameContainer}>
					<Image
						style={styles.gameLogo}
						source={{
							uri: url,
						}}
					/>
					<TextTitle style={styles.gameTitle}>{game.name}</TextTitle>
					{/* <Text>{game.joinCode}</Text> */}
				</View>
			</TouchableOpacity>
		);
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	gameLogo: {
		width: 100,
		height: 100,
	},
	gameTitle: {
		fontSize: 15,
		fontWeight: "700",
		paddingHorizontal: 10,
		paddingTop: 16,
		textAlign: "center",
	},
	gameContainer: {
		backgroundColor: "#ECF2FE",
		borderRadius: 8,
		margin: 12,
		padding: 5,
		paddingBottom: 21,
	},
	gameSubText: {
		paddingHorizontal: 10,
	},
	gameContainerText: {},
});
