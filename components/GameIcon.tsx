import React from "react";
import { SERVER_LOGO_URL } from "../constants/Server";
import { View, Text, TextTitle } from "./Themed";
import { Alert, Image, StyleSheet } from "react-native";
import { GameSchema } from "../src/interaces/interfacesGame";

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

	let url: string = SERVER_LOGO_URL;
	if (game && game.logoUrl && validURL(game.logoUrl)) {
		url = game.logoUrl;
	}

    if (game) {

        return (
			<View style={styles.gameContainer}>
				<Image
					style={styles.gameLogo}
					source={{
						uri: url,
					}}
				/>
				<TextTitle style={styles.gameTitle}>{game.name}</TextTitle>
				<Text>{game.joinCode}</Text>
			</View>
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
		fontWeight: "600",
		paddingHorizontal: 10,
		paddingVertical: 16,
	},
	gameContainer: {
		backgroundColor: "#ECF2FE",
		borderRadius: 8,
		margin: 12,
		padding: 5,
	},
	gameContainerText: {},
});
