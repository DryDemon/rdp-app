import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import {
	Alert,
	StyleSheet,
	Image,
	Share,
	TouchableOpacity,
} from "react-native";
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
	SmallLineBreak,
	TextSubTitle,
	SubText,
	GameScrollView,
} from "../components/Themed";

import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../constants/Server";
import { GameSchema } from "../src/interaces/interfacesGame";
import { validURL } from "../src/smallFuncts";

import { GameFooter } from "../components/GameFooter";
import Swipeable from "react-native-gesture-handler/Swipeable";
import GameClassement from "../components/gamePages/gameClassement";
import GameInfo from "../components/gamePages/gameInfo";
import GameListBets from "../components/gamePages/gameListBets";
import GameCart from "../components/gamePages/gameCart";
import GameMatchsStats from "../components/gamePages/gameMatchsStats";
import GamePlaceBet from "../components/gamePages/gamePlaceBet";
import GameMatchBets from "../components/gamePages/gameMatchBets";
import { GameHeader } from "../components/gameHeader";

const listPages = [
	"gameClassement",
	"gamePlaceBet",
	"gameListBets",
	"gameCart",
	"gamePlayerStats",
];

async function getCurrentGame(joinCode: string, jwt: string) {
	const rawResponse = await fetch(
		`${SERVER_API_URL}/getcurrentgameinfo?jwt=${jwt}&joinCode=${joinCode}`
	);
	const content = await rawResponse.json();

	return content;
}

export default function GameHandler({ navigation }: any) {
	const [jwt, setJwt] = useState<string>("");
	const [user, setUser] = useState<User>();
	const [joinCode, setJoinCode] = useState("");
	const [game, setGame] = useState<GameSchema>();

	const [logoUrl, setlogoUrl] = useState(SERVER_LOGO_URL);

	const [page, setPage] = useState<"gameClassement"|"gamePlaceBet"|"gameMatchBets"|"gameListBets"|"gameCart"|"gamePlayerStats"|"gameMatchBets"|"gameInfo">("gameCart");
	const [showGamePage, setshowGamePage] = useState(true); //Use this to show the game page bets
	const [match, setmatch] = useState({});

	async function loadGameData() {
		if (jwt && joinCode) {
			let content = await getCurrentGame(joinCode, jwt);

			if (content.success == 1) {
				setGame(content.game);
				AsyncStorage.setItem("@game", JSON.stringify(content.game));
			} else {
				navigation.navigate("Dashboard");
			}
		}
	}

	function checkIfConnected() {
		if (!jwt || !user) {
			navigation.navigate("Login");
		}
		if (!joinCode) {
			navigation.navigate("Dashboard");
		}
	}
	const onShare = async () => {
		try {
			const result = await Share.share({
				message:
					"Rejoins moi sur Roi Du Prono et viens dans mon contest : " +
					joinCode,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	//When we want to show all the bets of a match
	function loadMatch(match: any) {
		setmatch(match);
		setshowGamePage(false);
	}

	//reload game data each time
	useEffect(() => {
		if (!game) loadGameData();
	}, [joinCode, jwt]);

	useEffect(() => {
		if (!jwt || !user || !joinCode || !game) {
			try {
				if (!jwt) {
					AsyncStorage.getItem("@jwt").then(
						(value: string | null) => {
							if (value) setJwt(value);
						}
					);
				}
				if (!user) {
					AsyncStorage.getItem("@user").then(
						(value: string | null) => {
							if (value) setUser(JSON.parse(value));
						}
					);
				}
				if (!joinCode) {
					AsyncStorage.getItem("@joinCode").then(
						(value: string | null) => {
							if (value) setJoinCode(value);
						}
					);
				}
				if (!game) {
					//store it to get a better loading time
					AsyncStorage.getItem("@game").then(
						(value: string | null) => {
							if (value != null) setGame(JSON.parse(value));
						}
					);
					//and perform a in the use effect connected to jwt and joincode
				}
			} catch (e) {
				if (ENVIRONEMENT == "dev") alert(e);
			}
		}
	}, []);

	useEffect(() => {
		if (ENVIRONEMENT == "dev") console.log(game);

		if (game && game.logoUrl && validURL(game.logoUrl))
			setlogoUrl(game.logoUrl);
	}, [game]);

	return (
		<View>
			<Swipeable

			//Swipe left and swipe right, but this action is too sensitive

			// renderLeftActions={() => {
			// 	let currentPage = listPages.indexOf(page);
			// 	currentPage--;
			// 	if (currentPage < 0) currentPage = listPages.length - 1;

			// 	setPage(listPages[currentPage]);

			// 	return undefined;
			// }}
			// renderRightActions={() => {
			// 	let currentPage = listPages.indexOf(page);
			// 	currentPage++;
			// 	if (currentPage > listPages.length - 1) currentPage = 0;

			// 	setPage(listPages[currentPage]);

			// 	return undefined;
			// }}
			>
				<GameHeader back={"Dashboard"} navigation={navigation} callbackQuestionMark={()=>{setPage("gameInfo")}}/>
				{/* <Button title={"toggle"} onPress={() => {if(showGamePage) setshowGamePage(false); else setshowGamePage(true)}} /> */}

				<ViewContainer
					style={
						page == "gameClassement"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<GameClassement
							jwt={jwt}
							user={user}
							joinCode={joinCode}
							game={game}
							logoUrl={logoUrl}
						/>
					</GameScrollView>
				</ViewContainer>

				<ViewContainer
					style={
						page == "gamePlaceBet"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<GamePlaceBet
							callbackShowMatchBet={(match: any)=>{setmatch(match); setPage("gameMatchBets")}}
							jwt={jwt} 
							user={user}
							joinCode={joinCode}
							game={game}
							logoUrl={logoUrl}
						/>
					</GameScrollView>
				</ViewContainer>

				<ViewContainer
					style={
						page == "gameListBets"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<GameListBets
							jwt={jwt}
							user={user}
							joinCode={joinCode}
							game={game}
							logoUrl={logoUrl}
						/>
					</GameScrollView>
				</ViewContainer>

				<ViewContainer
					style={
						page == "gameCart"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<GameCart
							jwt={jwt}
							user={user}
							joinCode={joinCode}
							game={game}
							logoUrl={logoUrl}
						/>
					</GameScrollView>
				</ViewContainer>

				<ViewContainer
					style={
						page == "gamePlayerStats"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<GameMatchsStats
							jwt={jwt}
							user={user}
							joinCode={joinCode}
							game={game}
							logoUrl={logoUrl}
						/>
					</GameScrollView>
				</ViewContainer>

				<ViewContainer
					style={
						page == "gameMatchBets"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<GameMatchBets
							match={match}
							jwt={jwt}
							user={user}
							joinCode={joinCode}
							game={game}
							logoUrl={logoUrl}
						/>
					</GameScrollView>
				</ViewContainer>

				<ViewContainer
					style={
						page == "gameInfo"
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<GameInfo
							jwt={jwt}
							user={user}
							joinCode={joinCode}
							game={game}
							logoUrl={logoUrl}
						/>
					</GameScrollView>
				</ViewContainer>

				<GameFooter
					page={page}
					setPage={(goto: any) => setPage(goto)}
				/>
			</Swipeable>
		</View>
	);
}

const styles = StyleSheet.create({});
