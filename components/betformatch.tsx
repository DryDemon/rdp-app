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
import { ENVIRONEMENT } from "../constants/Environement";

export default function betForMatch(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const match: any = props.matchData;
	const reloadCart = props.reloadCart;
	const joinCode = props.joinCode;
	const setReloadCart = props.setReloadCart;

	const time = format(parseISO(match.time), "dd/MM - H:mm", {});

	let bets = match.prematchOdds;
	const matchName = match.teamHome + " - " + match.teamAway;

	let isLive = match.liveId != undefined;
	
	let fullMatchOdds = match.mainBet;
	let numberOfOdds = match.numOfRestBets;

	if (!fullMatchOdds || !numberOfOdds) {
		if (ENVIRONEMENT == "dev") alert("bug.");
		fullMatchOdds = bets?.[0];
		numberOfOdds = " ";
	}

	return (
		<View style={styles.matchContainer}>
			<View style={{ flexDirection: "row" }}>
				<TextTitle style={styles.matchName}>{matchName}</TextTitle>
				{time ? <Text style={styles.matchTime}>{time}</Text> : <></>}
			</View>

			<SmallLineBreak />
			<View style={{flexDirection:"row", justifyContent:"space-between",}}>
				{fullMatchOdds
					? fullMatchOdds.odds.map((odd: any) => (
							<BasicBet
								setReloadCart={setReloadCart}
								joinCode={joinCode}
								reloadCart={reloadCart}
								key={odd.id}
								odd={odd}
								matchId={match.matchId}
							></BasicBet>
					  ))
					: null}
				<BasicBet
					setReloadCart={setReloadCart}
					joinCode={joinCode}
					reloadCart={reloadCart}
					callbackShowMatchBet={callbackShowMatchBet}
					match={match}
					plus={numberOfOdds}
				></BasicBet>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	matchContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 12,
		marginVertical:12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,

		elevation: 4,
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
