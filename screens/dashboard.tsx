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
	BasicScrollView,
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL } from "../constants/Server";
import { GameIcon } from "../components/GameIcon";
import { GameSchema } from "../src/interaces/interfacesGame";
import { MyLeaguesDash } from "../components/MyLeaguesDash";
import { GameHeader } from "../components/gameHeader";
import { PublicLeaguesDash } from "../components/PublicLeaguesDash";
import { MainHeader } from "../components/mainHeader";

async function fetchUserGames(jwt: string) {
	const rawResponse = await fetch(
		`${SERVER_API_URL}/getusergameslist?jwt=${jwt}` //TODO seulmenent les games en cours
	);
	const content = await rawResponse.json();

	return content;
}

export default function Dashboard({ navigation, route: { params } }: any) {
	const [jwt, setJwt] = useState<string>("");
	const [user, setUser] = useState<User>();
	const [games, setGames] = useState<Array<GameSchema>>([]);
	const [publicGames, setPublicGames] = useState<Array<GameSchema>>([]);

	function checkInCaseGamesHasntLoaded() {
		setTimeout(function () {
			if(games.length == 0){
				//fetch games
				if (jwt) {
					fetchUserGames(jwt).then((content) => {
						let isConnected = content.isConnected;
						let publicGames = content.publicGames;
						let privateGames = content.privateGames;
						if (isConnected == 0) {
							AsyncStorage.setItem("@jwt", "");
							navigation.navigate("Login");
						} else {
							setGames(privateGames);
							setPublicGames(publicGames);
						}
					});
				}		

			}
		}, 5000);
	}
	checkInCaseGamesHasntLoaded();

	if (!jwt || !user) {
		try {
			if (!jwt) {
				AsyncStorage.getItem("@jwt")
					.then((value: string | null) => {
						if (value) setJwt(value);
						else navigation.navigate("Login");
					})
					.catch((e) => {
						navigation.navigate("Login");
					});
			}
			if (!user) {
				AsyncStorage.getItem("@user")
					.then((value: string | null) => {
						if (value) setUser(JSON.parse(value));
						else navigation.navigate("Login");
					})
					.catch((e) => {
						navigation.navigate("Login");
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
			fetchUserGames(jwt).then((content) => {
				let isConnected = content.isConnected;
				let publicGames = content.publicGames;
				let privateGames = content.privateGames;
				if (isConnected == 0) {
					AsyncStorage.setItem("@jwt", "");
					navigation.navigate("Login");
				} else {
					setGames(privateGames);
					setPublicGames(publicGames);
				}
			});
		}
	});

	// useEffect(() => {
	// 	if (ENVIRONEMENT == "dev") {
	// 		// AsyncStorage.setItem("@joinCode", "BPLSRO");
	// 		// navigation.navigate("Game");
	// 	}
	// }, [games]);

	//if the usergoes back to dashboard, we reload the games
	useEffect(() => {
		if (jwt) {
			fetchUserGames(jwt).then((content) => {
				let isConnected = content.isConnected;
				let publicGames = content.publicGames;
				let privateGames = content.privateGames;
				if (isConnected == 0) {
					AsyncStorage.setItem("@jwt", "");
					navigation.navigate("Login");
				} else {
					setGames(privateGames);
					setPublicGames(publicGames);
				}
			});
		}
	}, [jwt]);

	useEffect(() => {
		if (jwt) {
			fetchUserGames(jwt).then((content) => {
				let isConnected = content.isConnected;
				let publicGames = content.publicGames;
				let privateGames = content.privateGames;
				if (isConnected == 0) {
					AsyncStorage.setItem("@jwt", "");
					navigation.navigate("Login");
				} else {
					setGames(privateGames);
					setPublicGames(publicGames);
				}
			});
		}
	}, []);

	return (
		<View>
			<MainHeader jwt={jwt} navigation={navigation} />
			<ViewContainer>
				<BasicScrollView isHeaderShown={true}>
					<MyLeaguesDash
						user={user}
						games={games}
						navigation={navigation}
						jwt={jwt}
					/>
					<PublicLeaguesDash
						user={user}
						jwt={jwt}
						privateJoinCodes={games.map(function (
							game: GameSchema
						) {
							return game.joinCode;
						})}
						publicGames={publicGames}
						navigation={navigation}
					/>
					<LineBreak />
				</BasicScrollView>
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
