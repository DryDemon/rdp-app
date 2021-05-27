import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
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
import { CheckBox } from "../checkBox";
import { RenderBetInput } from "../renderBetInput";

type DisplayType = {
	toDelete?: boolean;

	matchName: string;
	odd: number;
	betName: string;
	betSubName: string;
	betHandicap: string;
	betHeader: string;
	betId: string;
	matchId: string;
	mise: number;
	isBase: boolean;
};

function getUserMultiplyBonus(game: GameSchema, userId: string) {
	let canBoostBet = false;
	let multiplyValue = 1.0;

	let bonusList = game?.bonusList;
	if (bonusList && userId) {
		for (let bonus of bonusList) {
			if (bonus.ownerUserId == userId) {
				if (bonus.typeBonus == 1 && bonus.multiplier && !bonus.isUsed) {
					//multiply bet
					canBoostBet = true;
					multiplyValue = bonus.multiplier;
				}
			}
		}
	}
	return [canBoostBet, multiplyValue];
}

//this function will make all the binary combinaisons forthe system choice
//ex : 3 bets, 2/3 choice => 011, 101, 110
function generateBinarySystemCodes(
	nb: number,
	choice: number,
	baseList: boolean[]
) {
	let out: Array<Array<number>> = [];

	let code = Array.from({ length: nb }, () => 0);
	while (code.reduce((prev, current) => prev + current, 0) != nb) {
		for (let i = 0; i < nb; i++) {
			if (code[i] == 0) {
				code[i] = 1;
				break;
			} else {
				code[i] = 0;
			}
		}

		let isBaseOk = true;

		for (let i = 0; i < nb; i++) {
			if (baseList[i]) if (code[i] != 1) isBaseOk = false;
		}

		if (
			code.reduce((prev, current) => prev + current, 0) == choice &&
			isBaseOk
		)
			out.push(Object.assign([], code));
	}

	return out;
}

async function getMatchFromIds(jwt: string, matchsIds: Array<string>) {
	if (jwt && matchsIds.length != 0) {
		const rawRep = await fetch(
			SERVER_API_URL +
				`/getmatchsdata?matchIds=${matchsIds.toString()}&jwt=${jwt}`
		);
		const rep = await rawRep.json();
		if (rep.success == 1) {
			return rep.matchs;
		}
	}

	return undefined;
}

async function sendBetToServer(
	jwt: string,
	joinCode: string,
	credits: number,
	betIds: Array<string>,
	matchIds: Array<string>,
	isSystem: number,
	systemChoice: number,
	listBaseBetId: Array<string>,
	listBaseMatchId: Array<string>,
	usingBonus: boolean
) {
	if (
		jwt &&
		joinCode &&
		credits &&
		betIds &&
		matchIds &&
		matchIds.length == betIds.length
	) {
		let ids: Array<string> = [];
		let baseIds: Array<string> = [];

		for (let i = 0; i < betIds.length; i++) {
			ids.push(betIds[i] + "@" + matchIds[i]);
		}

		for (let i = 0; i < listBaseBetId.length; i++) {
			baseIds.push(listBaseBetId[i] + "@" + listBaseMatchId[i]);
		}

		let usingBonusQuery = 0;
		if (usingBonus) usingBonusQuery = 1;

		const rawResponse = await fetch(
			`${SERVER_API_URL}/addbetingame?jwt=${jwt}&joinCode=${joinCode}&credits=${credits}&ids=${ids.toString()}&system=${isSystem}&systemChoice=${systemChoice}&baseIds=${baseIds.toString()}&usingBonus=${usingBonusQuery}`
		);

		const content = await rawResponse.json();

		return content.success == 1;
	}

	return false;
}

export default function GameCart(props: any) {
	const {
		jwt,
		user,
		joinCode,
		game,
		logoUrl,
		reloadGame,
		betChoiceListGroup,
		betChoiceMainInfoGroup,
		setPage, 

		...otherProps
	} = props;

	const [
		betChoiceListGameHandler,
		setBetChoiceListGameHandler,
	] = betChoiceListGroup;
	const [betChoiceMainInfo, setBetChoiceMainInfo] = betChoiceMainInfoGroup;

	const [, forceUpdate] = useReducer((x) => x + 1, 0);

	const [betsToDisplay, setBetsToDisplay] = useState<Array<DisplayType>>([]);
	const [type, setType] = useState<"simple" | "combiné" | "système">(
		"simple"
	);

	const [mainOdd, setMainOdd] = useState<number>(1.0);

	const [blockSendButton, setblockSendButton] = useState(false);
	const [alertMessage, setalertMessage] = useState("");
	const [systemChoice, setSystemChoice] = useState(0);

	const [isUsingMultiplyBonus, setIsUsingMultiplyBonus] = useState(false);
	const [simpleBetBonusUsed, setSimpleBetBonusUsed] = useState<{
		matchId: string | undefined;
		betId: string | undefined;
	}>({ matchId: undefined, betId: undefined });

	let [canMultiplyBet, multiplyValue] = getUserMultiplyBonus(game, user?._id);

	useEffect(() => {
		[canMultiplyBet, multiplyValue] = getUserMultiplyBonus(game, user?._id);
	}, [game, betChoiceListGameHandler, user]);

	//validate the cart each time bet action
	useEffect(() => {
		validateCart()
	}, [betChoiceListGameHandler, betChoiceMainInfo, type]);

	//fonctions principales du panier
	function changeType(type: any) {
		setType(type);
	}

	function removeBet(betId: string, matchId: string) {
		let cart = betChoiceListGameHandler.slice();
		cart = cart.filter((elem: any) => {
			return !(elem.matchId == matchId && elem.betId == betId);
		});

		setBetChoiceListGameHandler(cart);
	}

	async function removeAllBetAndGotoListBets() {
		let cart: any[] = [];
		reloadGame(); //Pour charger les paris qui viennentd'être places

		setBetChoiceListGameHandler([]);

		setblockSendButton(false);

		setPage("gameListBets")
	}

	//fonction type == simple
	function updateSimpleBetMise(betId: string, matchId: string, mise: number) {
		//double the func from cart to speed up loading
		let cart = betChoiceListGameHandler.slice();

		for (let i = 0; i < cart.length; i++) {
			if (cart[i].matchId == matchId && cart[i].betId == betId) {
				cart[i].mise = mise;
			}
		}
		setBetChoiceListGameHandler(cart);
	}

	async function setisBaseBet(
		betId: string,
		matchId: string,
		value: boolean
	) {
		let cart = betChoiceListGameHandler.slice();

		for (let i = 0; i < cart.length; i++) {
			if (cart[i].matchId == matchId && cart[i].betId == betId) {
				cart[i].isBase = value;
			}
		}

		setBetChoiceListGameHandler(cart);
	}

	//fonctions type == combiné

	function generateBaseList() {
		let baseList: boolean[] = [];

		for (let bet of betsToDisplay) {
			baseList.push(bet.isBase);
		}

		return baseList;
	}
	function getNumberOfBase() {
		let list = generateBaseList();
		let out = 0;

		for (let elem of list) {
			if (elem) out++;
		}
		return out;
	}

	useEffect(() => {
		//Update the global odd for type == comboné
		if (type == "combiné") {
			let totalQuote = 1.0;

			for (let bet of betsToDisplay) {
				totalQuote *= bet.odd;
			}
			if (mainOdd != totalQuote) setMainOdd(totalQuote);
		}
		if (type == "système") {
			let totalQuote = 0.0;

			let codes = generateBinarySystemCodes(
				betsToDisplay.length,
				1 + systemChoice,
				generateBaseList()
			);

			for (let code of codes) {
				let localQuote = 1.0;
				for (let i = 0; i < code.length; i++) {
					if (code[i] == 1) localQuote *= betsToDisplay[i].odd;
				}

				totalQuote += localQuote;
			}

			if (mainOdd != totalQuote) setMainOdd(totalQuote);
		}
	}, [type, betsToDisplay, systemChoice]);

	function updateBetMainMise(mise: number) {
		setBetChoiceMainInfo({ miseGlobal: mise });
	}
	async function sendSimpleBets() {
		let cpy = betsToDisplay;
		for (let bet of cpy) {
			let tempValueIdUserMultiplyBonus = isUsingMultiplyBonus;
			if (
				tempValueIdUserMultiplyBonus &&
				bet.betId == simpleBetBonusUsed.betId &&
				bet.matchId == simpleBetBonusUsed.matchId
			)
				tempValueIdUserMultiplyBonus = true;
			let rep = await sendBetToServer(
				jwt,
				joinCode,
				bet.mise,
				[bet.betId],
				[bet.matchId],
				0, //simplebet
				-1, //simplebet
				[],
				[],
				isUsingMultiplyBonus
			);
			if (!rep) alert("Error");
		}
		await removeAllBetAndGotoListBets();
	}

	function onSend() {
		validateCart()
		if (alertMessage == "") {
			setblockSendButton(true);
			let betIds: Array<string> = [];
			let matchIds: Array<string> = [];

			switch (type) {
				case "simple":
					sendSimpleBets(); //TO launch the async function
					break;
				case "combiné":
					betIds = [];
					matchIds = [];

					for (let i = 0; i < betsToDisplay.length; i++) {
						betIds.push(betsToDisplay[i].betId);
						matchIds.push(betsToDisplay[i].matchId);
					}

					sendBetToServer(
						jwt,
						joinCode,
						betChoiceMainInfo.miseGlobal,
						betIds,
						matchIds,
						0, //combiné
						0,
						[],
						[],
						isUsingMultiplyBonus
					).then((rep) => {
						if (rep) removeAllBetAndGotoListBets();
						else alert("Erreur");
					});

					break;
				case "système":
					betIds = [];
					matchIds = [];

					let baseBetIds: string[] = [];
					let baseMatchIds: string[] = [];

					for (let i = 0; i < betsToDisplay.length; i++) {
						betIds.push(betsToDisplay[i].betId);
						matchIds.push(betsToDisplay[i].matchId);

						if (betsToDisplay[i].isBase) {
							baseBetIds.push(betsToDisplay[i].betId);
							baseMatchIds.push(betsToDisplay[i].matchId);
						}
					}

					sendBetToServer(
						jwt,
						joinCode,
						betChoiceMainInfo.miseGlobal,
						betIds,
						matchIds,
						1, //system
						systemChoice + 1,
						baseBetIds,
						baseMatchIds,
						isUsingMultiplyBonus
					).then((rep) => {
						if (rep) removeAllBetAndGotoListBets();
						else alert("Erreur");
					});

					break;
			}
		}
	}

	//to load the display of the cart
	useEffect(() => {
		if (betChoiceListGameHandler && jwt) {
			let matchsIds: Array<string> = [];

			//on regarde si il faut recharger en faisant une requete get match
			let needReload = false;
			for (let bet of betChoiceListGameHandler) {
				let isOkay = false;
				for (let betDisplay of betsToDisplay) {
					if (
						bet.betId == betDisplay.betId &&
						bet.matchId == betDisplay.matchId
					) {
						isOkay = true;
					}
				}
				if (!isOkay) {
					needReload = true;
				}
			}

			if (
				needReload ||
				betChoiceListGameHandler.length > betsToDisplay.length
			) {
				for (let bet of betChoiceListGameHandler) {
					if (!matchsIds.some((element) => element == bet.matchId)) {
						matchsIds.push(bet.matchId);
					}
				}

				getMatchFromIds(jwt, matchsIds).then(
					(matchs: Array<MatchSchema>) => {
						let toDisplay: Array<DisplayType> = [];

						if (matchs) {
							for (let bet of betChoiceListGameHandler) {
								for (let match of matchs) {
									if (match.matchId == bet.matchId) {
										for (let betFromMatch of match.prematchOdds) {
											if (
												betFromMatch &&
												betFromMatch.odds
											) {
												for (let odds of betFromMatch.odds) {
													if (odds.id == bet.betId) {
														//match we got the match, the bet, and the odds
														let matchName =
															match.teamHome +
															" - " +
															match.teamAway;
														let oddForBet = +odds.odds;
														let betName =
															betFromMatch.name;
														let betSubName =
															odds.name;
														let betHandicap =
															odds.handicap;
														let betHeader =
															odds.header;
														let mise = bet.mise;
														let isBase = bet.isBase;

														toDisplay.push({
															matchName,
															odd: oddForBet,
															betName,
															betSubName,
															betHandicap,
															betHeader,
															mise,
															betId: bet.betId,
															matchId:
																bet.matchId,
															isBase,
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
			} else {
				//on a pas besoin de reload

				let toDisplay: Array<DisplayType> = betsToDisplay;
				for (let i = 0; i < toDisplay.length; i++) {
					toDisplay[i].toDelete = true;

					for (let bet of betChoiceListGameHandler) {
						if (
							bet.betId == toDisplay[i].betId &&
							bet.matchId == toDisplay[i].matchId
						) {
							toDisplay[i].toDelete = false;

							//update mise ou d'autre truc nécessaires
							let mise = bet.mise;
							let isBase = bet.isBase;
							toDisplay[i].mise = mise;
							toDisplay[i].isBase = isBase;
						}
					}
				}

				toDisplay = toDisplay.filter(
					(value: DisplayType) => !value.toDelete
				);

				validateCart();
				setBetsToDisplay(toDisplay);
				forceUpdate();
			}
		}
	}, [betChoiceListGameHandler, jwt]);

	async function validateCart() {
		let message = "";

		//verifier que l'utilisateur à assez de credits pour parier
		//verifier qu'il pari au moins une somme positve
		let isBettingPositiveValue = true;
		let totalMise = 0.0;
		if (type != "simple") {
			totalMise = betChoiceMainInfo.miseGlobal;
			if (totalMise < 1) {
				isBettingPositiveValue = false;
			}
		} else {
			for (let bet of betsToDisplay) {
				totalMise += bet.mise;
				if (bet.mise < 1) {
					isBettingPositiveValue = false;
				}
			}
		}
		if (totalMise == 0) {
			if (message == "") message += "\n";
			message += "Vous ne pouvez pas parier une valeur nulle.";
		}
		if (totalMise > user?.credits) {
			if (message == "") message += "\n";
			message += "Vous n'avez pas assez de crédits pour parier.";
		}

		//verifier que pour un système il a au moins 3 paris
		if (type == "système" && betsToDisplay.length < 3) {
			if (message == "") message += "\n";
			message += "Vous devez placer au moins 3 paris pour un système.";
		}

		//verifier que pour un combiné il a au moins 2 paris
		if (type == "combiné" && betsToDisplay.length < 2) {
			if (message == "") message += "\n";
			message += "Vous devez placer au moins 2 paris pour un pari combiné.";
		}

		//verifier pour combiné ou ssytème que les paris ne sont pas du même match
		if (type != "simple") {
			let matchsIds: string[] = [];
			for (let bet of betsToDisplay) {
				//Si on trouve un doublon
				if (matchsIds.some((value: string) => value == bet.matchId)) {
					if (message == "") message += "\n";
					message +=
						"Vous ne pouvez pas faire un pari " +
						type +
						" avec des paris du même match.";
					break;
				}
				matchsIds.push(bet.matchId);
			}
		}

		setalertMessage(message);
	}

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
							type == "simple" ? { color: "white", textAlign: "center" } : {textAlign: "center"}
						}
					>
						Simple
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
							type == "combiné" ? { color: "white", textAlign: "center"} : {textAlign: "center"}
						}
					>
						Combiné
					</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity
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
				</TouchableOpacity> */}
			</View>
			<View style={styles.textToMiddle}>
				<SmallLineBreak />

				<View style={styles.betsContainer}>
					{betsToDisplay && betsToDisplay.length > 0 ? (
						<View>
							<View>
								{betsToDisplay.map((value: DisplayType) => (
									<View
										key={value.betId}
										style={styles.betContainer}
									>
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
												style={
													styles.removeBetContainer
												}
											>
												<Text style={styles.removeBet}>
													x
												</Text>
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
											<View
												style={styles.betOddContainer}
											>
												<Text style={styles.betOddText}>
													{value.odd}
												</Text>
											</View>
										</View>
										{type == "système" ? (
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<CheckBox
													value={value.isBase}
													onValueChange={() => {
														setisBaseBet(
															value.betId,
															value.matchId,
															!value.isBase
														);
														value.isBase = !value.isBase;
													}}
												/>
												<Text
													style={{ marginLeft: 10 }}
												>
													Base
												</Text>
											</View>
										) : null}

										{type == "simple" ? (
											<RenderBetInput
												onChange={(mise: any) =>
													updateSimpleBetMise(
														value.betId,
														value.matchId,
														mise
													)
												}
												odd={value.odd}
												value={value.mise}
											/>
										) : null}
										{type == "simple" && canMultiplyBet ? (
											<View>
												<Text>
													Utiliser le boost de
													{multiplyValue}
												</Text>
												<CheckBox
													value={
														isUsingMultiplyBonus &&
														simpleBetBonusUsed.betId ==
															value.betId &&
														simpleBetBonusUsed.matchId ==
															value.matchId
													}
													onValueChange={() => {
														setSimpleBetBonusUsed({
															matchId:
																value.matchId,
															betId: value.betId,
														});
														setIsUsingMultiplyBonus(
															!(
																simpleBetBonusUsed.betId ==
																	value.betId &&
																simpleBetBonusUsed.matchId ==
																	value.matchId &&
																isUsingMultiplyBonus
															)
														);
													}}
												/>
											</View>
										) : null}
									</View>
								))}
							</View>
							{type == "combiné" ? (
								<RenderBetInput
									onChange={(mise: any) => {
										setBetChoiceMainInfo({
											miseGlobal: mise,
										});
									}}
									nbBets={betsToDisplay.length}
									odd={mainOdd}
									value={betChoiceMainInfo.miseGlobal}
								/>
							) : null}
							{type == "système" ? (
								<RenderBetInput
									onChange={(mise: any) =>
										setBetChoiceMainInfo({
											miseGlobal: mise,
										})
									}
									odd={mainOdd}
									value={betChoiceMainInfo.miseGlobal}
									system={1}
									nbBets={betsToDisplay.length}
									systemChoice={systemChoice}
									setSystemChoice={setSystemChoice}
									nbBase={getNumberOfBase()}
								/>
							) : null}
						</View>
					) : (
						<Text style={{ padding: 15 }}>
							Essaye de placer des paris avant de venir ici ;)
						</Text>
					)}
				</View>
				{betsToDisplay && betsToDisplay.length > 0 ? (
					<View>
						{canMultiplyBet && type != "simple" ? (
							<View>
								<Text>
									Utiliser le boost de {multiplyValue}
								</Text>
								<CheckBox
									value={isUsingMultiplyBonus}
									onValueChange={() => {
										setIsUsingMultiplyBonus(
											!isUsingMultiplyBonus
										);
									}}
								/>
							</View>
						) : null}
						<View>
							<TextWarning>{alertMessage}</TextWarning>
							{betsToDisplay.length == 1 ? (
								<Button
									title={"Placer le pari"}
									onPress={onSend}
									disabled={
										blockSendButton && alertMessage != ""
									}
								/>
							) : (
								<Button
									title={"Placer les paris"}
									onPress={onSend}
									disabled={
										blockSendButton && alertMessage != ""
									}
								/>
							)}
						</View>
					</View>
				) : null}
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
		flexShrink: 1,
		flexWrap: "wrap",
		flex: 1,
		fontSize: 12,
		borderRadius: 12,
		backgroundColor: Colors.rdpColor,
		minWidth: "auto",
		paddingHorizontal: 8,
		paddingVertical: 6,
		color: "white",
	},
	betChoiceButtonUntouched: {
		flexShrink: 1,
		flexWrap: "wrap",
		flex: 1,
		fontSize: 12,
		borderRadius: 12,
		minWidth: "auto",
		paddingHorizontal: 8,
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
