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
import { Alert, Image, StyleSheet, ScrollView } from "react-native";
import { GameSchema, userBetInterface } from "../src/interaces/interfacesGame";
import { GameIcon } from "./GameIcon";
import Colors from "../constants/Colors";
import { SeeDetails } from "./seeDetailsPlayerBet";
import { getSystemName } from "./renderBetInput";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { getUserNameFromId } from "../src/smallFuncts";

export function PlayerBet(props: any) {
	let bet: userBetInterface = props.bet;
	let simple = bet?.betsObjects?.length == 1;
	let simpleBet = bet?.betsObjects?.[0];
	let system = bet?.isSystem;
	let game: GameSchema = props.game;

	if (bet && simpleBet && bet.betsObjects && bet.credits) {
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
							size={20}
							color={"#000"}
						/>
					) : null}
					{bet.status == 1 ? ( //WIN
						<EvilIcons
							style={styles.icon}
							name="trophy"
							size={20}
							color={"#5BD18F"}
						/>
					) : null}
					{bet.status == 2 ? ( //LOST
						<View
							style={{
								borderRadius: 100,
								backgroundColor: "#FDE7E7",
							}}
						>
							<Entypo
								style={styles.icon}
								name="cross"
								size={20}
								color={"#000"}
							/>
						</View>
					) : null}{" "}
				</View>
				{simple ? <SubText>{simpleBet.leagueName}</SubText> : null}
				<View style={styles.lineRow}>
					<Text style={styles.mise}>Mise : </Text>
					<Text style={styles.credits}>{bet.credits}</Text>
				</View>
				<View style={styles.lineRow}>
					<Text style={styles.mise}>Gains Potentiels : </Text>
					<Text style={styles.credits}>
						{bet.mainQuote * bet.credits}
					</Text>
				</View>
				<SmallLineBreak />
				<View style={styles.lineRow}>
						<View>
							<Text style={styles.credits}>{getUserNameFromId(game, bet.userId)}</Text>
						</View>
					<View style={styles.mainQuoteContainer}>
						<Text style={styles.mainQuoteText}>
							{bet.mainQuote}
						</Text>
					</View>
				</View>
					{bet.result ? (
						<View>
							<Text style={styles.credits}>Résultat : </Text>
							<Text>{bet.result}</Text>
						</View>
					) : null}
				{!simple ? <SeeDetails bet={bet} /> : null}
			</View>
		);
	} else return null;
}

const styles = StyleSheet.create({
	betContainer: {
		width: "100%",

		borderRadius: 12,
		backgroundColor: "white",
		padding: 12,
		margin: 6,
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
});
