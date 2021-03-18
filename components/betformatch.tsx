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

function findFullTimeOdd(bets: any) {
	for (let bet of bets) {
		if (bet.id == 40) {
			return bet;
		}
	}
	//Si on ne l'a pas trouvé, on renvoie le premier
	for (let odd of bets) {
		return odd;
	}

	return undefined;
}

function getTotalNumberOfOdds(bets: any, fullMatchOdds: any) {
	let count = 0;

	for (let bet of bets) {
		if (bet.odds) {
			for (let odd of bet.odds) {
				if (bet.id != fullMatchOdds.id) count++;
			}
		}
	}
	return count;
}

export default function betForMatch(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const match = props.matchData;
	const isShow = props.isShow;

	const time = format(parseISO(match.time), "dd/MM - H:mm", {});

	let bets = match.prematchOdds;
	const matchName = match.teamHome + " - " + match.teamAway;

	const fullMatchOdds = findFullTimeOdd(bets);
	const numberOfOdds = getTotalNumberOfOdds(bets, fullMatchOdds);

	return (
		<View style={styles.matchContainer}>
			<View style={{ flexDirection: "row" }}>
				<TextTitle style={styles.matchName}>{matchName}</TextTitle>
				{time ? <Text style={styles.matchTime}>{time}</Text> : <></>}
			</View>

			<SmallLineBreak />
			<SmallLineBreak />
			<ScrollView horizontal={true}>
				{fullMatchOdds
					? fullMatchOdds.odds.map((odd: any) => (
							<BasicBet isShow={isShow} key={odd.id} odd={odd} matchId={match.matchId}></BasicBet>
					  ))
					: null}
				<BasicBet isShow={isShow} callbackShowMatchBet={callbackShowMatchBet} match={match} plus={numberOfOdds}></BasicBet>
			</ScrollView>
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
