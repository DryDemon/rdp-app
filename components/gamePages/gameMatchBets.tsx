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
	ProtectedHeader,
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

export default function GameMatchBets(props: any) {
	const { jwt, user, joinCode, game, logoUrl, match, isShow, ...otherProps } = props;

	const odds = match.prematchOdds;
	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>
				{match.teamHome + " - " + match.teamAway}
			</TextSubTitle>
			<View style={styles.textToMiddle}>
				<View>

					{odds
						? odds.map((bet: any) => (
								<BetListForGameMatchBets isShow={isShow} key={bet.id} bet={bet} matchId={match.matchId}></BetListForGameMatchBets>
						  ))
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
