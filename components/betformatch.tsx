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
import Colors from "../constants/Colors";

export default function betForMatch(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const match: any = props.matchData;
	const joinCode = props.joinCode;
	const betChoiceListGroup = props.betChoiceListGroup;

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

	let fullMatchLiveOdds = match.mainBetLive;
	let numberOfLiveOdds = match.numOfRestBetsLive;

	if (!fullMatchOdds || !numberOfOdds) {
		if (ENVIRONEMENT == "dev") alert("bug.");
		fullMatchOdds = bets?.[0];
		numberOfOdds = " ";
	}

	if (!isLive)
		return (
			<View style={styles.matchContainer}>
				<View style={{ flexDirection: "row" }}>
					<TextTitle style={styles.matchName}>{matchName}</TextTitle>
					{time ? (
						<Text style={styles.matchTime}>{time}</Text>
					) : (
						<></>
					)}
				</View>

				<SmallLineBreak />
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					{fullMatchOdds
						? fullMatchOdds.odds.map((odd: any) => (
								<BasicBet
									betChoiceListGroup={betChoiceListGroup}
									joinCode={joinCode}
									key={odd.id}
									odd={odd}
									matchId={match.matchId}
								></BasicBet>
						  ))
						: null}
					{numberOfOdds === 0 ? (
						<BasicBet
							betChoiceListGroup={betChoiceListGroup}
							joinCode={joinCode}
							callbackShowMatchBet={callbackShowMatchBet}
							match={match}
							plus={numberOfOdds}
						></BasicBet>
					) : null}
				</View>
			</View>
		);
	else
		return (
			<View style={styles.matchContainer}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						// justifyContent: "space-between",
					}}
				>
					<View style={styles.liveIconContainer}>
						<Text style={styles.liveIconText}>LIVE</Text>
					</View>
					<View style={styles.liveTextLeagueNameContainer}>
						<Text style={styles.liveTextLeagueName}>
							{props.leagueName?props.leagueName:""}
						</Text>
					</View>
				</View>

				<Text>
					score en impimentation une fois que j'ai compris comment ça
					marche
				</Text>
				<SmallLineBreak />
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					{fullMatchLiveOdds
						? fullMatchLiveOdds.odds.map((odd: any) => (
								<BasicBet
									betChoiceListGroup={betChoiceListGroup}
									joinCode={joinCode}
									key={odd.id}
									odd={odd}
									matchId={match.matchId}
								></BasicBet>
						  ))
						: null}
					{numberOfLiveOdds === 0 ? (
						<BasicBet
							betChoiceListGroup={betChoiceListGroup}
							joinCode={joinCode}
							callbackShowMatchBet={callbackShowMatchBet}
							match={match}
							plus={numberOfLiveOdds}
						></BasicBet>
					) : null}
				</View>
			</View>
		);
}

const styles = StyleSheet.create({
	matchContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 12,
		marginVertical: 12,
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

	liveIconContainer: {
		backgroundColor: Colors.red,
		padding: 2,
		alignItems: "center",
		width: 33,
		borderRadius: 4,
	},
	liveIconText: {
		color: "white",
		fontWeight: "500",
		fontSize: 11,
		lineHeight: 13,

		alignItems: "center",
		textAlign: "center",
		letterSpacing: 0.066,
	},
	liveTextLeagueName: {
		fontWeight: "500",
		fontSize: 11,
		lineHeight: 13,
		color: Colors.gray,
	},
	liveTextLeagueNameContainer: {
		paddingHorizontal: 12,
	},
});
