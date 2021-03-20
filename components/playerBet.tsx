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

export function PlayerBet(props: any) {
	let bet: userBetInterface = props.bet;
	let simple = bet?.betsObjects?.length;
	let simpleBet = bet?.betsObjects?.[0];

	if (bet && simple && simpleBet && bet.betsObjects && bet.credits) {
		return (
			<View style={styles.betContainer}>
				<View style={styles.header}>
					{simple ? (
						<Text style={styles.title}>{simpleBet.matchName}</Text>
					) : (
						<Text style={styles.title}>
							Combiné ({bet.betsObjects.length})
						</Text>
					)}
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
					{bet.result ? (
						<View>
							<Text style={styles.credits}>Résultat : </Text>
							<Text>{bet.result}</Text>
						</View>
					) : null}
					<View style={styles.mainQuoteContainer}>
						<Text style={styles.mainQuoteText}>
							{bet.mainQuote}
						</Text>
					</View>
				</View>
				{!simple ? <SeeDetails bet={bet} /> : null}
			</View>
		);
	} else return null;
}

const styles = StyleSheet.create({
	betContainer: {
		borderRadius: 12,
		backgroundColor: "white",
		padding: 12,
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
});
