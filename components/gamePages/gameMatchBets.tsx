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
import {
	ENVIRONEMENT,
	RELOAD_LIVE_BETS_EVERY_SECONDS,
} from "../../constants/Environement";
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
import useInterval from "../../hooks/useInterval";
import { fetchLiveBetData } from "./gamePlaceBet";

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

	const isLive = match.liveId != undefined;

	const [currentOdds, setCurrentOdds] = useState<any>(
		match.liveId ? match.matchOdds : match.prematchOdds
	);
	useEffect(() => {
		setCurrentOdds(match.liveId ? match.matchOdds : match.prematchOdds);
	}, [match]);

	useInterval(
		async () => {
			let liveData = await fetchLiveBetData(jwt, match.matchId);

			if (liveData?.[match.matchId] != undefined) {
				setCurrentOdds(liveData[match.matchId]);
			}
		},
		match.liveId ? RELOAD_LIVE_BETS_EVERY_SECONDS * 1000 : null
	);

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>
				{match.teamHome + " - " + match.teamAway}
			</TextSubTitle>
			<View style={styles.textToMiddle}>
				<View>
					{currentOdds
						? // ? currentOdds.filter((bet: any) => isBetIdWhitelisted(bet.id)).map((bet: any) => (
						  currentOdds.map((bet: any, index: number) => (
								<BetListForGameMatchBets
									isLive={isLive}
									betChoiceListGroup={betChoiceListGroup}
									joinCode={joinCode}
									key={bet.id}
									bet={bet}
									matchId={match.matchId}
								></BetListForGameMatchBets>
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
