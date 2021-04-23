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

import { CONST_BASE_MISE_PARI, ENVIRONEMENT } from "../constants/Environement";
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
import { ShowBonus } from "../components/showBonus";

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

	const [page, setPage] = useState<
		| "gameClassement"
		| "gamePlaceBet"
		| "gameListBets"
		| "gameCart"
		| "gamePlayerStats"
		| "gameMatchBets"
		| "gameInfo"
	>(ENVIRONEMENT == "prod" ? "gameInfo" : "gameListBets");

	const [betChoiceListGameHandler, setBetChoiceListGameHandler] = useState<
		Array<{
			matchId: string;
			betId: string;
			mise: number;
			isBase: boolean;
		}>
	>([]); //Use this to show the game page bets
	const [betChoiceMainInfo, setBetChoiceMainInfo] = useState<{
		miseGlobal: number;
	}>({ miseGlobal: CONST_BASE_MISE_PARI }); //Use this to show the game page bets

	const [showGamePage, setshowGamePage] = useState(false); //Use this to show the game page bets
	const [match, setmatch] = useState({});

	const [showBonus, setShowBonus] = useState(false);

	function toggleShowBonus() {
		setShowBonus(!showBonus);
	}

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

	//Sur chaque changement de page
	useEffect(() => {
		if (showBonus) setShowBonus(false);
	}, [page]);

	//When we want to show all the bets of a match
	function loadMatch(match: any) {
		setmatch(match);
		setshowGamePage(false);
	}

	function reloadGame() {
		loadGameData();
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

	//todo add Swipeable?
	return (
		<View>
			<GameHeader
				canShowBonus={!game?.isPublic}
				toggleShowBonus={toggleShowBonus}
				joinCode={joinCode}
				back={page != "gameMatchBets" ? "Dashboard" : undefined}
				callBackGameHeaderGotoBack={
					page == "gameMatchBets"
						? () => setPage("gamePlaceBet")
						: undefined
				}
				navigation={navigation}
				game={game}
				callbackQuestionMark={() => {
					setPage("gameInfo");
				}}
			/>

			<ViewContainer
				style={
					!showBonus && page == "gameClassement"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					<GameClassement
						reloadGame={reloadGame}
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
					!showBonus && page == "gamePlaceBet"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					<GamePlaceBet
						callbackShowMatchBet={(match: any) => {
							setmatch(match);
							setPage("gameMatchBets");
						}}
						reloadGame={reloadGame}
						jwt={jwt}
						joinCode={joinCode}
						betChoiceListGroup={[
							betChoiceListGameHandler,
							setBetChoiceListGameHandler,
						]}
					/>
				</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gameListBets"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					<GameListBets
						reloadGame={reloadGame}
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
					!showBonus && page == "gameCart"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					<GameCart
						betChoiceListGroup={[
							betChoiceListGameHandler,
							setBetChoiceListGameHandler,
						]}
						betChoiceMainInfoGroup={[
							betChoiceMainInfo,
							setBetChoiceMainInfo,
						]}
						reloadGame={reloadGame}
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
					!showBonus && page == "gamePlayerStats"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					<GameMatchsStats
						reloadGame={reloadGame}
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
					!showBonus && page == "gameMatchBets"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					<GameMatchBets
						betChoiceListGroup={[
							betChoiceListGameHandler,
							setBetChoiceListGameHandler,
						]}
						match={match}
						reloadGame={reloadGame}
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
					!showBonus && page == "gameInfo"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					<GameInfo
						reloadGame={reloadGame}
						jwt={jwt}
						user={user}
						joinCode={joinCode}
						game={game}
						logoUrl={logoUrl}
					/>
				</GameScrollView>
			</ViewContainer>

			{showBonus && joinCode && user ? (
				<ViewContainer
					style={
						showBonus && joinCode
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>
						<ShowBonus
							toggleShowBonus={toggleShowBonus}
							joinCode={joinCode}
							game={game}
							user={user}
							jwt={jwt}
							setPage={setPage}
						/>
					</GameScrollView>
				</ViewContainer>
			) : null}
			<GameFooter
				betChoiceList={betChoiceListGameHandler}
				joinCode={joinCode}
				page={page}
				setPage={(goto: any) => setPage(goto)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({});
