import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import {
	Alert,
	StyleSheet,
	Image,
	Share,
	TouchableOpacity,
	ScrollView,
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
} from "../Themed";

import { format, parseISO } from "date-fns";
import { ENVIRONEMENT } from "../../constants/Environement";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../../constants/Server";
import { GameSchema } from "../../src/interaces/interfacesGame";
import {
	LeagueSchema,
	MatchSchema,
} from "../../src/interaces/interfacesQuotes";
import { validURL } from "../../src/smallFuncts";
import { LeagueIcon } from "../LeagueIcon";
import BetListForGameMatchBets from "../betListForGameMatchBets";
import { isBetIdWhitelisted } from "../../constants/Bets";

export default function GameMatchBets(props: any) {
	const {
		jwt,
		user,
		joinCode,
		game,
		logoUrl,
		match,
		betChoiceListGroup,
		...otherProps
	} = props;

	const odds = match.prematchOdds;
	const length = odds?.length;
	const isLive = match.liveId != undefined;

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>
				{match.teamHome + " - " + match.teamAway}
			</TextSubTitle>
			<View style={styles.textToMiddle}>
				<View>
					{odds
						? // ? odds.filter((bet: any) => isBetIdWhitelisted(bet.id)).map((bet: any) => (
						  odds.map((bet: any, index: number) =>
								index < length / 3 ? (
									<BetListForGameMatchBets
										isLive={isLive}
										betChoiceListGroup={betChoiceListGroup}
										joinCode={joinCode}
										key={bet.id}
										bet={bet}
										matchId={match.matchId}
									></BetListForGameMatchBets>
								) : null
						  )
						: null}
					{odds
						? // ? odds.filter((bet: any) => isBetIdWhitelisted(bet.id)).map((bet: any) => (
						  odds.map((bet: any, index: number) =>
								index > length / 3 &&
								index < (length * 2) / 3 ? (
									<BetListForGameMatchBets
										isLive={isLive}
										betChoiceListGroup={betChoiceListGroup}
										joinCode={joinCode}
										key={bet.id}
										bet={bet}
										matchId={match.matchId}
									></BetListForGameMatchBets>
								) : null
						  )
						: null}
					{odds
						? // ? odds.filter((bet: any) => isBetIdWhitelisted(bet.id)).map((bet: any) => (
						  odds.map((bet: any, index: number) =>
								index > (length * 2) / 3 ? (
									<BetListForGameMatchBets
										isLive={isLive}
										betChoiceListGroup={betChoiceListGroup}
										joinCode={joinCode}
										key={bet.id}
										bet={bet}
										matchId={match.matchId}
									></BetListForGameMatchBets>
								) : null
						  )
						: null}
				</View>

				<SmallLineBreak />
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
});
