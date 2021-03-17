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
import AllBets from "../allbets";
import { LeagueIcon } from "../LeagueIcon";

export default function GameMatchBets(props: any) {
	const { jwt, user, joinCode, game, logoUrl, match, ...otherProps } = props;

		return (
			<View>
				<SmallLineBreak />
				<TextSubTitle style={styles.titleGame}>Parier</TextSubTitle>
				<View style={styles.textToMiddle}>
					<View>
						<Text>{match.teamHome}</Text>
						<Text>{match.teamAway}</Text>
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
