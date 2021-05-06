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
import {
	Alert,
	Image,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { GameSchema, userBetInterface } from "../src/interaces/interfacesGame";
import { GameIcon } from "./GameIcon";
import Colors from "../constants/Colors";
import { SeeDetails } from "./seeDetailsPlayerBet";
import { getSystemName } from "./renderBetInput";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { getUserNameFromId } from "../src/smallFuncts";
import { sendUseBonusQuery } from "./showBonus";
import { User } from "../src/interaces/interfacesUsers";

function getUserBonus(game: GameSchema, userId: string) {
	let canCancelBet = false;
	let canDivideBet = false;
	let divideValue = 1.0;

	let bonusList = game.bonusList;
	if (bonusList) {
		for (let bonus of bonusList) {
			if (bonus.ownerUserId == userId) {
				if (bonus.typeBonus == 4 && !bonus.isUsed) {
					//cancel bet
					canCancelBet = true;
				}
				if (bonus.typeBonus == 6 && bonus.multiplier && !bonus.isUsed) {
					//divide bet
					canDivideBet = true;
					divideValue = bonus.multiplier;
				}
			}
		}
	}
	return [canCancelBet, canDivideBet, divideValue];
}

export function PlayerBet(props: any) {
	let bet: userBetInterface = props.bet;
	let simple = bet?.betsObjects?.length == 1;
	let simpleBet = bet?.betsObjects?.[0];
	let system = bet?.isSystem;
	let game: GameSchema = props.game;
	let jwt: string = props.jwt;
	let user: User = props.user;
	let userId = user._id;
	let reloadGame = props.reloadGame;

	let [canCancelBet, canDivideBet, divideValue] = getUserBonus(game, userId);

	const [showBetOption, setShowBetOption] = useState(false);

	let fullStatus = 0;
	for (let subbet of bet.betsObjects) {
		if (subbet.betStatus && subbet.betStatus > fullStatus)
			fullStatus = subbet.betStatus;
	}

	function toggleShowBetOption() {
		setShowBetOption(!showBetOption);
	}
	function cancelBet(betId: string | undefined) {
		if (betId && game.joinCode) {
			sendUseBonusQuery(game.joinCode, jwt, 4, betId).then(() => {
				reloadGame();
			});
		}
	}
	function divideQuote(betId: string | undefined) {
		if (betId && game.joinCode) {
			sendUseBonusQuery(game.joinCode, jwt, 6, betId).then(() => {
				reloadGame();
			});
		}
	}

	function renderShowBetOption() {
		return (
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
					{canCancelBet && bet.status == 0 && fullStatus == 0 ? ( //full status pour qu'il ne puisse utiliser le bonus que si tout les subbet nont pas été resolu du tout
						<Button
							title="Annuler le pari"
							onPress={() => cancelBet(bet._id)}
						/>
					) : null}
				</View>
				<View style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
					{canDivideBet && bet.status == 0 && fullStatus == 0 ? ( //full status pour qu'il ne puisse utiliser le bonus que si tout les subbet nont pas été resolu du tout
						<Button
							title="Diviser la quote"
							onPress={() => divideQuote(bet._id)}
						/>
					) : null}
				</View>
			</View>
		);
	}

	if (bet && simpleBet && bet.betsObjects && bet.credits && bet.mainQuote) {
		let systemName = getSystemName(
			bet?.betsObjects?.length,
			bet?.systemChoice
		);

		return (
			<View style={styles.betContainer}>
				<View style={styles.header}>
					<Text style={styles.title}>
						{simple ? simpleBet.matchName : null}
						{!simple && !system
							? "Combiné (" + bet.betsObjects.length + ")"
							: null}
						{system ? systemName : null}
					</Text>
					{bet.status == 0 ? ( //EN cOURS
						<MaterialCommunityIcons
							style={styles.icon}
							name="progress-clock"
							size={24}
							color={"#000"}
						/>
					) : null}
					{bet.status == 1 ? ( //WIN
						<EvilIcons
							style={styles.icon}
							name="trophy"
							size={24}
							color={"#5BD18F"}
						/>
					) : null}
					{bet.status == 2 ? ( //LOST
						<View
							style={{
								borderRadius: 100,
								backgroundColor: Colors.lightRed,
							}}
						>
							<Entypo
								style={styles.icon}
								name="cross"
								size={24}
								color={"#000"}
							/>
						</View>
					) : null}
					{canCancelBet || canDivideBet ? (
						<TouchableOpacity onPress={toggleShowBetOption}>
							<Entypo
								style={styles.icon}
								name="dots-three-vertical"
								size={24}
								color={"black"}
							/>
						</TouchableOpacity>
					) : null}
				</View>

				{showBetOption ? renderShowBetOption() : null}
				{simple ? (
					<SubText
						style={{
							marginBottom: 12,
							marginTop: 0,
							fontSize: 11,
							color: Colors.grayPlaceHolder,
						}}
					>
						{simpleBet.leagueName}
					</SubText>
				) : null}
				<View style={[{ marginBottom: 4 }, styles.lineRow]}>
					<Text style={styles.mise}>Mise : </Text>
					<Text style={styles.credits}>{bet.credits}</Text>
				</View>
				<View style={styles.lineRow}>
					<Text style={styles.mise}>Gains Potentiels : </Text>
					<Text style={styles.credits}>
						{bet.quoteBoost
							? (
									bet.mainQuote *
									bet.credits *
									bet.quoteBoost
							  ).toFixed(2)
							: (bet.mainQuote * bet.credits).toFixed(2)}
					</Text>
				</View>
				<SmallLineBreak />
				<View style={styles.lineRow}>
					{/*<View>
						<Text style={styles.credits}>
							{getUserNameFromId(game, bet.userId)}
						</Text>
					</View>*/}
					{simple &&
					(simpleBet.betName ||
						simpleBet.betSubName ||
						simpleBet.betHeader ||
						simpleBet.betHandicap ||
						simpleBet.betTeam) ? (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text style={styles.resultField}>Résultat : </Text>
							<Text style={styles.betInfo}>
								{simpleBet.betName
									? simpleBet.betName + "   "
									: null}
								{simpleBet.betSubName
									? simpleBet.betSubName + "   "
									: null}
								{simpleBet.betHeader
									? simpleBet.betHeader + "   "
									: null}
								{simpleBet.betHandicap
									? simpleBet.betHandicap
									: null}
								{simpleBet.betTeam
									? simpleBet.betTeam
									: null}
							</Text>
						</View>
					) : null}
					{!simple ? <SeeDetails bet={bet} /> : null}

					<View style={styles.mainQuoteContainer}>
						<Text style={styles.mainQuoteText}>
							{bet.mainQuote.toFixed(2)}
							{bet.quoteBoost ? " x " + bet.quoteBoost : ""}
						</Text>
					</View>
				</View>
			</View>
		);
	} else return null;
}

const styles = StyleSheet.create({
	betContainer: {
		width: "100%",
		borderRadius: 12,
		backgroundColor: Colors.white,
		padding: 12,
		marginVertical: 6,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,

		elevation: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		fontSize: 15,
		fontWeight: "700",
	},
	lineRow: {
		flexDirection: "row",
	},
	credits: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
		fontWeight: "700",
		fontSize: 12,
	},
	resultField: {
		fontWeight: "500",
		fontSize: 12,
	},
	mise: {
		fontSize: 12,
	},
	mainQuoteContainer: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
		backgroundColor: Colors.rdpColor,
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
	},
	mainQuoteText: {
		fontWeight: "700",
		color: "white",
		fontSize: 15,
	},
	icon: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
	},
	betInfo: {
		fontSize: 12,
		fontWeight: "700",
	},
});
