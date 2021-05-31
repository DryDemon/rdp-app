import React from "react";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../constants/Server";
import { View, Text, TextTitle, SubText } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
	GameSchema,
	userStatsInterface,
} from "../src/interaces/interfacesGame";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validURL } from "../src/smallFuncts";
import Feather from "react-native-vector-icons/Feather";
import Icon from "../components/CustomIcon";


async function addUserInAGame(joinCode: string, jwt: string) {
	const rawResponse = await fetch(
		SERVER_API_URL + `/adduserinagame?joinCode=${joinCode}&jwt=${jwt}`
	);
	const content = await rawResponse.json();
	return content;
}

export function GameIcon(props: any) {
	const game: GameSchema = props.game;
	const create = props.create;
	const navigation: any = props.navigation;
	const username: string = props.username;
	const joinBeforeEntering: boolean | undefined = props.joinBeforeEntering;
	const needToAddUserInGame: boolean | undefined = props.needToAddUserInGame;
	const jwt: string = props.jwt;
	const user: any = props.user;

	function gotoGame(joinCode: string) {
		if (joinBeforeEntering && jwt && needToAddUserInGame) {
			addUserInAGame(joinCode, jwt).then((content: any) => {
				navigation.navigate("Game", {
					user: user,
					jwt: jwt,
					joinCode: joinCode,
					game: game,
				});
			});
		} else {
			navigation.navigate("Game", {
				user: user,
				jwt: jwt,
				joinCode: joinCode,
				game: game,
			});
		}
	}

	let url: string = SERVER_LOGO_URL;
	if (game && game.logoUrl && validURL(game.logoUrl)) {
		url = game.logoUrl;
	}

	if (create == 1) {
		return (
			<TouchableOpacity onPress={() => navigation.navigate("Create", {user: user, jwt: jwt})}>
				<View style={styles.gameContainer}>
					<View
						style={{
							width: 150,
							height: 150,
							alignItems: "center",
							marginLeft: "auto",
							marginRight: "auto",
							justifyContent: "center",
						}}
					>
						<Icon
							icon="plus_circle"
							size={28}
							color={"#2F4858"}
						/>
					</View>

					<TextTitle style={styles.gameTitle}>
						Créer un contest
					</TextTitle>
					<SubText style={styles.gameSubText}>
						et invites tes potes
					</SubText>
				</View>
			</TouchableOpacity>
		);
	}
	if (game) {
		let userList = "";
		if (game.userStats && username)
			game.userStats.forEach((stat: userStatsInterface) => {
				if (stat.username != username)
					userList = userList + ", " + stat.username;
			});
		if (userList.length > 22) {
			userList = userList.slice(2, 18);
			userList += "...";
		} else userList = userList.slice(2, 20);
		return (
			<TouchableOpacity
				onPress={() => {
					if (game.joinCode) gotoGame(game.joinCode);
				}}
			>
				<View style={styles.gameContainer}>
					<Image
						style={styles.gameLogo}
						source={{
							uri: url,
						}}
					/>
					<TextTitle style={styles.gameTitle}>{game.name}</TextTitle>
					<SubText style={styles.gameSubText}>{userList}</SubText>
				</View>
			</TouchableOpacity>
		);
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	gameLogo: {
		width: 150,
		height: 150,
		// display: "block",
		marginLeft: "auto",
		marginRight: "auto",
	},
	gameLogoCreate: {
		marginLeft: "auto",
		marginRight: "auto",
	},
	gameTitle: {
		fontSize: 15,
		fontWeight: "700",
		paddingHorizontal: 10,
		paddingTop: 16,
	},
	gameContainer: {
		backgroundColor: "#ECF2FE",
		borderRadius: 8,
		width: 210,
		height: 230,
		marginRight: 24,
		padding: 16,
		paddingBottom: 21,
	},
	gameSubText: {
		paddingHorizontal: 10,
	},
	gameContainerText: {},
});
