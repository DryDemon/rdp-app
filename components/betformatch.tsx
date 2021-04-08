import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import BasicBet from "./basicbet";
import { SmallLineBreak, View, Text, SubText, TextTitle } from "./Themed";

import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { isBetIdWhitelisted } from "../constants/Bets";
import { MatchSchema } from "../src/interaces/interfacesQuotes";

export default function betForMatch(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const match = props.matchData;
	const reloadCart = props.reloadCart;
	const joinCode = props.joinCode;
	const setReloadCart = props.setReloadCart;

	const time = format(parseISO(match.time), "dd/MM - H:mm", {});

	let bets = match.prematchOdds;
	const matchName = match.teamHome + " - " + match.teamAway;

	const fullMatchOdds = match.mainBet;
	const numberOfOdds = match.numOfRestBets;

	return (
		<View style={styles.matchContainer}>
			<View style={{ flexDirection: "row" }}>
				<TextTitle style={styles.matchName}>{matchName}</TextTitle>
				{time ? <Text style={styles.matchTime}>{time}</Text> : <></>}
			</View>

			<SmallLineBreak />
			<SmallLineBreak />
			<View>
				{fullMatchOdds
					? fullMatchOdds.odds.map((odd: any) => (
							<BasicBet setReloadCart={setReloadCart} joinCode={joinCode} reloadCart={reloadCart} key={odd.id} odd={odd} matchId={match.matchId}></BasicBet>
					  ))
					: null}
				<BasicBet setReloadCart={setReloadCart} joinCode={joinCode} reloadCart={reloadCart} callbackShowMatchBet={callbackShowMatchBet} match={match} plus={numberOfOdds}></BasicBet>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	matchContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 12,
		margin: 10,
	},
	matchName: {
		fontSize: 15,
		fontWeight: "700",
	},
	matchTime: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
		fontSize: 12,
		fontWeight: "500",
	},
});
