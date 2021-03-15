import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import BasicBet from "./basicbet";
import { SmallLineBreak, View, Text, SubText, TextTitle } from "./Themed";

import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function betForMatch(props: any) {
	const match = props.matchData;

	const time = format(parseISO(match.time), "yyyy-MM-dd", {});

	let bets = match.prematchOdds;
	const matchName = match.teamHome + " - " + match.teamAway;

	return (
		<View style={styles.matchContainer}>
			<View style={{ flexDirection: "row" }}>
				<TextTitle style={styles.matchName}>{matchName}</TextTitle>
				{time ? <Text style={styles.matchTime}>{time}</Text> : <></>}
			</View>

			<SmallLineBreak />
			<SmallLineBreak />
			{bets.map((bet: any) => (
				<BasicBet
					key={bet.id}
					matchName={matchName}
					matchId={match.matchId}
					bet={bet}
				></BasicBet>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	matchContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 12,
	},
	matchName: {
		fontSize: 15,
		fontWeight: "700",
	},
	matchTime: {
        marginLeft:"auto",
		textAlign: "right",
		alignSelf:"flex-end",
        fontSize: 12,
		fontWeight: "500",
	},
});
