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
import GamePlayerStats from "../components/gamePages/gamePlayerStats";
import { GameHeader } from "../components/gameHeader";
import { ShowBonus } from "../components/showBonus";
import { MatchSchema } from "../src/interaces/interfacesQuotes";

async function getCurrentGame(joinCode: string, jwt: string) {
	const rawResponse = await fetch(
		`${SERVER_API_URL}/getcurrentgameinfo?jwt=${jwt}&joinCode=${joinCode}`
	);
	const content = await rawResponse.json();

	return content;
}

export default function GameHandler({ navigation, route: { params } }: any) {
	const [jwt, setJwt] = useState<string>("");
	const [user, setUser] = useState<User>();
	const [game, setGame] = useState<GameSchema | undefined>();

	const [page, setPage] = useState<
		| "gameClassement"
		| "gamePlaceBet"
		| "gameListBets"
		| "gameCart"
		| "gameMatchStats"
		| "gameMatchBets"
		| "gameInfo"
		| "gamePlayerStats"
	>(ENVIRONEMENT == "prod" ? "gameInfo" : "gameListBets");

	const [betChoiceListGameHandler, setBetChoiceListGameHandler] = useState<
		Array<{
			matchId: string;
			betId: string;
			mise: number;
			isBase: boolean;
			isLive: boolean | undefined;
		}>
	>([]); //Use this to show the game page bets
	const [betChoiceMainInfo, setBetChoiceMainInfo] = useState<{
		miseGlobal: number;
	}>({ miseGlobal: CONST_BASE_MISE_PARI }); //Use this to show the game page bets

	const [showGamePage, setshowGamePage] = useState(false); //Use this to show the game page bets
	const [matchs, setMatchs] = useState<MatchSchema[]>([]);
	const [userIdSelectedShowStats, setUserIdSelectedShowStats] =
		useState<string>(""); //This variable is used with GamePlayerStats Page, it remenbers which userId To Show

	const [showBonus, setShowBonus] = useState(false);

	const [gameMatchBetList, setGameMatchBetList] = useState<{
		[key: string]: any;
	}>({});
	const [visibleMatchId, setVisibleMatchId] = useState("");

	async function gameMatchLoader(match: MatchSchema) {
		return (
			<GameMatchBets
				betChoiceListGroup={[
					betChoiceListGameHandler,
					setBetChoiceListGameHandler,
				]}
				match={match}
				reloadGame={reloadGame}
				jwt={jwt}
				user={user}
				joinCode={game?.joinCode}
				game={game}
				logoUrl={game?.logoUrl || SERVER_LOGO_URL}
			/>
		);
	}

	useEffect(() => {
		if (userIdSelectedShowStats && userIdSelectedShowStats != "")
			pageSetter("gamePlayerStats");
	}, [userIdSelectedShowStats]);

	useEffect(() => {
		//prepare matchList
		if (matchs && matchs.length != 0) {
			Promise.all(
				matchs.map((match: MatchSchema) => {
					gameMatchLoader(match).then((value) => {
						let gameMatchBetListCpy = gameMatchBetList;
						gameMatchBetListCpy[match.matchId] = value;
						// console.log("Finished Loading matchId", match.matchId, value);
						// setGameMatchBetList(gameMatchBetListCpy);
					});
				})
			);
		}
	}, [matchs]);

	function toggleShowBonus() {
		setShowBonus(!showBonus);
	}

	async function loadGameData() {
		if (jwt && game?.joinCode) {
			let content = await getCurrentGame(game?.joinCode, jwt);

			if (content.success == 1) {
				setGame(content.game);
				// AsyncStorage.setItem("@game", JSON.stringify(content.game));
			} else {
				Alert.alert("Erreur", "Vous avez été déconnecté");
				navigation.navigate("Dashboard");
			}
		}
	}

	function checkIfConnected() {
		if (!jwt || !user) {
			navigation.navigate("Login");
		}
		if (!game?.joinCode) {
			navigation.navigate("Dashboard");
		}
	}
	const onShare = async () => {
		try {
			const result = await Share.share({
				message:
					"Rejoins moi sur Roi Du Prono et viens dans mon contest : " +
					game?.joinCode,
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
	function pageSetter(newPage: typeof page) {
		//todo : les differents setter ralentissent?
		if (showBonus) setShowBonus(false);
		if (newPage != "gameMatchBets") setVisibleMatchId("");
		if (newPage != "gamePlayerStats") setUserIdSelectedShowStats("");
		setPage(newPage);
	}

	function reloadGame() {
		loadGameData();
	}

	useEffect(() => {
		setJwt(params.jwt);
		setUser(params.user);
		setGame(params.game);
	}, [params]);

	const [gameInfoContainer, setGameInfoContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gameClassementContainer, setGameClassementContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gamePlaceBetContainer, setGamePlaceBetContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gameListBetContainer, setGameListBetContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gameCartContainer, setGameCartContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gameMatchStatsContainer, setGameMatchStatsContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gamePlayerStatsContainer, setGamePlayerStatsContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gameShowBonusContainer, setGameShowBonusContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gameFooterContainer, setGameFooterContainer] =
		useState<JSX.Element | undefined>(undefined);
	const [gameHeaderContainer, setGameHeaderContainer] =
		useState<JSX.Element | undefined>(undefined);

	useEffect(() => {
		setGameInfoContainer(
			<GameInfo
				jwt={jwt}
				user={user}
				joinCode={game?.joinCode}
				game={game}
				logoUrl={game?.logoUrl || SERVER_LOGO_URL}
			/>
		);
	}, [jwt, user, game]);
	useEffect(() => {
		setGameClassementContainer(
			<GameClassement
				setUserIdSelectedShowStats={setUserIdSelectedShowStats}
				user={user}
				game={game}
				logoUrl={game?.logoUrl || SERVER_LOGO_URL}
			/>
		);
	}, [setUserIdSelectedShowStats, user, game]);

	useEffect(() => {
		setGamePlaceBetContainer(
			<GamePlaceBet
				matchsGameHandlerState={[matchs, setMatchs]}
				callbackShowMatchBet={(matchId: string) => {
					setVisibleMatchId(matchId);
					pageSetter("gameMatchBets");
				}}
				jwt={jwt}
				joinCode={game?.joinCode}
				betChoiceListGroup={[
					betChoiceListGameHandler,
					setBetChoiceListGameHandler,
				]}
			/>
		);
	}, [matchs, jwt, betChoiceListGameHandler]);
	useEffect(() => {
		setGameListBetContainer(
			<GameListBets
				canShowBonus={!game?.isPublic}
				reloadGame={reloadGame}
				jwt={jwt}
				user={user}
				joinCode={game?.joinCode}
				game={game}
				logoUrl={game?.logoUrl || SERVER_LOGO_URL}
			/>
		);
	}, [game, jwt, user]);
	useEffect(() => {
		setGameCartContainer(
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
				joinCode={game?.joinCode}
				game={game}
				logoUrl={game?.logoUrl || SERVER_LOGO_URL}
				setPage={pageSetter}
			/>
		);
	}, [betChoiceListGameHandler, betChoiceMainInfo, jwt, user, game]);

	useEffect(() => {
		setGameMatchStatsContainer(
			<GameMatchsStats
				reloadGame={reloadGame}
				user={user}
				joinCode={game?.joinCode}
				game={game}
				logoUrl={game?.logoUrl || SERVER_LOGO_URL}
			/>
		);
	}, [user, game]);
	useEffect(() => {
		setGamePlayerStatsContainer(
			<GamePlayerStats
				user={user}
				game={game}
				userIdSelectedShowStats={userIdSelectedShowStats}
			/>
		);
	}, [user, game, userIdSelectedShowStats]);

	// useEffect(() => {
	// 	setGameShowBonusContainer(
	// 		<ShowBonus
	// 			toggleShowBonus={toggleShowBonus}
	// 			joinCode={game?.joinCode}
	// 			game={game}
	// 			user={user}
	// 			jwt={jwt}
	// 			setPage={pageSetter}
	// 		/>
	// 	);
	// }, [toggleShowBonus, game, user, jwt]);

	useEffect(() => {
		setGameFooterContainer(
			<GameFooter
				betChoiceList={betChoiceListGameHandler}
				joinCode={game?.joinCode}
				page={page}
				setPage={(goto: typeof page) => pageSetter(goto)}
			/>
		);
	}, [page, game, betChoiceListGameHandler]);

	useEffect(() => {
		setGameHeaderContainer(
			<GameHeader
				canShowBonus={!game?.isPublic}
				toggleShowBonus={toggleShowBonus}
				joinCode={game?.joinCode}
				back={
					page != "gameMatchBets" && page != "gamePlayerStats"
						? "Dashboard"
						: undefined
				}
				callBackGameHeaderGotoBack={() => {
					switch (page) {
						case "gameMatchBets":
							pageSetter("gamePlaceBet");
							break;
						case "gamePlayerStats":
							pageSetter("gameClassement");
							break;
					}
				}}
				navigation={navigation}
				game={game}
				callbackQuestionMark={() => {
					pageSetter("gameInfo");
				}}
			/>
		);
	}, [game, page]);

	//todo add Swipeable?
	return (
		<View>
			{gameHeaderContainer}

			<ViewContainer
				style={
					!showBonus && page == "gameClassement"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>{gameClassementContainer}</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gamePlaceBet"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>{gamePlaceBetContainer}</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gameListBets"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>{gameListBetContainer}</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gameCart"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>{gameCartContainer}</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gameMatchStats"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>{gameMatchStatsContainer}</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gameMatchBets"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>
					{/* GameMatchBetComponent */}
					{gameMatchBetList[visibleMatchId] ? (
						gameMatchBetList[visibleMatchId]
					) : (
						<Text>Loading...</Text>
					)}
				</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gameInfo"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>{gameInfoContainer}</GameScrollView>
			</ViewContainer>

			<ViewContainer
				style={
					!showBonus && page == "gamePlayerStats"
						? { display: "flex" }
						: { display: "none" }
				}
			>
				<GameScrollView>{gamePlayerStatsContainer}</GameScrollView>
			</ViewContainer>

			{showBonus && game?.joinCode && user ? (
				<ViewContainer
					style={
						showBonus && game?.joinCode
							? { display: "flex" }
							: { display: "none" }
					}
				>
					<GameScrollView>{gameShowBonusContainer}</GameScrollView>
				</ViewContainer>
			) : null}
			{gameFooterContainer}
		</View>
	);
}

const styles = StyleSheet.create({});
