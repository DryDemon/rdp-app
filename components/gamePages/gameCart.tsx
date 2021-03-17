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
} from "../../components/Themed";
import Colors from "../../constants/Colors";

import {
	CONST_BASE_MISE_PARI,
	ENVIRONEMENT,
} from "../../constants/Environement";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../../constants/Server";
import { GameSchema } from "../../src/interaces/interfacesGame";
import { MatchSchema } from "../../src/interaces/interfacesQuotes";
import { validURL } from "../../src/smallFuncts";

type DisplayType = {
	matchName: string;
	odd: string;
	betName: string;
	betSubName: string;
	betHandicap: string;
	betHeader: string;
	betId: string;
	matchId: string;
	mise: number;
};

async function getMatchFromIds(jwt: string, matchsIds: Array<string>) {
	const rawRep = await fetch(
		SERVER_API_URL +
			`/getmatchsdata?matchIds=${matchsIds.toString()}&jwt=${jwt}`
	);
	const rep = await rawRep.json();
	if (rep.success == 1) {
		return rep.matchs;
	} else {
		return undefined;
	}
}

export default function GameCart(props: any) {
	const { jwt, user, joinCode, game, logoUrl, ...otherProps } = props;

	const [bets, setBets] = useState<Array<any>>([]);
	const [betsToDisplay, setBetsToDisplay] = useState<Array<DisplayType>>([]);
	const [cartInfo, setcartInfo] = useState<any>({});
	const [type, setType] = useState<"simple" | "combiné" | "système">(
		"simple"
	);

	function loadCart() {
		AsyncStorage.getItem("@cart").then((input) => {
			let cart: any = [];
			if (input) cart = JSON.parse(input);
			if (ENVIRONEMENT == "dev") console.log(cart);
			setBets(cart);
		});
		AsyncStorage.getItem("@cart_info").then((input) => {
			let data;
			if (input) data = JSON.parse(input);
			else data = { type, miseGlobal: CONST_BASE_MISE_PARI };
			setcartInfo(data);
			setType(data.type);
		});
	}

	useEffect(() => {
		loadCart();
	}, []);

	function changeType(type: any) {
		setType(type);
		AsyncStorage.getItem("@cart_info").then((input) => {
			let data;
			if (input) data = JSON.parse(input);
			else data = { type, miseGlobal: CONST_BASE_MISE_PARI };
			data.type = type;
			AsyncStorage.setItem("@cart_info", data);
		});
	}

	function removeBet(betId: string, matchId: string) {
		AsyncStorage.getItem("@cart").then((input) => {
			let cart: any = [];
			if (input) cart = JSON.parse(input);

			cart = cart.filter((elem: any) => {
				return elem.matchId != matchId && elem.betId != betId;
			});

			AsyncStorage.setItem("@cart", JSON.stringify(cart));
			setBets(cart);
		});
	}

	useEffect(() => {
		if (bets && jwt) {
			let matchsIds: Array<string> = [];

			for (let bet of bets) {
				if (!matchsIds.some((element) => element == bet.matchId)) {
					matchsIds.push(bet.matchId);
				}
			}

			getMatchFromIds(jwt, matchsIds).then(
				(matchs: Array<MatchSchema>) => {
					let toDisplay: Array<DisplayType> = [];

					if (matchs) {
						for (let bet of bets) {
							for (let match of matchs) {
								if (match.matchId == bet.matchId) {
									for (let betFromMatch of match.prematchOdds) {
										if (betFromMatch && betFromMatch.odds) {
											for (let odds of betFromMatch.odds) {
												if (odds.id == bet.betId) {
													//match we got the match, the bet, and the odds
													let matchName =
														match.teamHome +
														" - " +
														match.teamAway;
													let oddForBet = odds.odds;
													let betName =
														betFromMatch.name;
													let betSubName = odds.name;
													let betHandicap =
														odds.handicap;
													let betHeader = odds.header;
													let mise = bet.mise;

													toDisplay.push({
														matchName,
														odd: oddForBet,
														betName,
														betSubName,
														betHandicap,
														betHeader,
														mise,
														betId: bet.betId,
														matchId: bet.matchId,
													});
												}
											}
										}
									}
								}
							}
						}
					}
					setBetsToDisplay(toDisplay);
				}
			);
		}
	}, [bets, jwt]);

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>Panier</TextSubTitle>

			<LineBreak />

			<View style={{ flexDirection: "row" }}>
				<TouchableOpacity
					onPress={() => changeType("simple")}
					style={
						type == "simple"
							? styles.betChoiceButtonTouched
							: styles.betChoiceButtonUntouched
					}
				>
					<Text
						style={
							type == "simple" ? { color: "white" } : undefined
						}
					>
						Simple{" "}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => changeType("combiné")}
					style={
						type == "combiné"
							? styles.betChoiceButtonTouched
							: styles.betChoiceButtonUntouched
					}
				>
					<Text
						style={
							type == "combiné" ? { color: "white" } : undefined
						}
					>
						Combiné
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => changeType("système")}
					style={
						type == "système"
							? styles.betChoiceButtonTouched
							: styles.betChoiceButtonUntouched
					}
				>
					<Text
						style={
							type == "système" ? { color: "white" } : undefined
						}
					>
						Système
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.textToMiddle}>
				<SmallLineBreak />

				<View style={styles.betsContainer}>
					{betsToDisplay && betsToDisplay.length > 0 ? (
						betsToDisplay.map((value: DisplayType) => (
							<View key={value.betId} style={styles.betContainer}>
								<View style={{ flexDirection: "row" }}>
									<Text style={styles.betMatchName}>
										{value.matchName}
									</Text>
									<TouchableOpacity
										onPress={() => {
											removeBet(
												value.betId,
												value.matchId
											);
										}}
										style={styles.removeBetContainer}
									>
										<Text style={styles.removeBet}>x</Text>
									</TouchableOpacity>
								</View>
								<View style={{ flexDirection: "row" }}>
									{value.betSubName ? (
										<Text style={{ flex: 1 }}>
											{value.betSubName}
										</Text>
									) : null}
									{value.betHeader ? (
										<Text style={{ flex: 1 }}>
											{value.betHeader}
										</Text>
									) : null}
									{value.betHandicap ? (
										<Text style={{ flex: 1 }}>
											{value.betHandicap}
										</Text>
									) : null}
								</View>

								<View style={{ flexDirection: "row" }}>
									<Text>{value.betName}</Text>
									<View style={styles.betOddContainer}>
										<Text style={styles.betOddText}>
											{value.odd}
										</Text>
									</View>
								</View>
							</View>
						))
					) : (
						<Text>
							Essaye de placer des paris avant de venir ici ;)
						</Text>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	titleGame: {
		fontSize: 22,
		fontWeight: "500",
	},
	textToMiddle: {
		alignItems: "center",
	},
	betChoiceButtonTouched: {
		flex: 1,
		fontSize: 12,
		borderRadius: 12,
		backgroundColor: Colors.rdpColor,
		minWidth: "auto",
		paddingHorizontal: 16,
		paddingVertical: 6,
		color: "white",
	},
	betChoiceButtonUntouched: {
		flex: 1,
		fontSize: 12,
		borderRadius: 12,
		minWidth: "auto",
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
	betsContainer: {
		minWidth: "80%",
		margin: 12,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
	},
	betContainer: {
		margin: 12,
	},
	betMatchName: {
		fontSize: 15,
		fontWeight: "700",
	},
	removeBetContainer: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
		margin: 0,
		padding: 5,
		borderRadius: 100,
		backgroundColor: "#ECF2FE",
	},
	removeBet: {
		color: Colors.rdpColor,
		fontSize: 20,
	},
	betOddContainer: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
		borderRadius: 4,
		backgroundColor: "#ECF2FE",
	},
	betOddText: {
		fontSize: 15,
		fontWeight: "700",
		color: Colors.rdpColor,
	},
});
