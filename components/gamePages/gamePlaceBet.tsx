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
} from "../../components/Themed";

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

async function fetchBetData(joinCode: string, jwt: string) {
	const apiRoute =
		ENVIRONEMENT != "dev" ? "getnextmatchleaguedata" : "getmatchleaguedata";

	if (joinCode && jwt) {
		const rawResponse = await fetch(
			`${SERVER_API_URL}/${apiRoute}?jwt=${jwt}&joinCode=${joinCode}`
		);

		const content = await rawResponse.json();

		if (content.success == 1) return content;
	}
	return undefined;
}

export default function GamePlaceBet(props: any) {
	const {
		jwt,
		user,
		joinCode,
		game,
		logoUrl,
		callbackShowMatchBet,
		isShow,
		...otherProps
	} = props;

	const [matchs, setMatchs] = useState<Array<MatchSchema>>([]);
	const [leagues, setLeagues] = useState<Array<LeagueSchema>>([]);
	const [listFilter, setListFilter] = useState<Array<string>>([]);

	useEffect(() => {
		fetchBetData(joinCode, jwt).then((content) => {
			if (content) {
				setMatchs(content.matchs);
				setLeagues(content.leagues);
			}
		});
	}, [jwt, joinCode]);

	useEffect(() => {
		if (ENVIRONEMENT == "dev") console.log(leagues, matchs);
	}, [leagues, matchs]);

	useEffect(() => {
		if (ENVIRONEMENT == "dev") console.log(listFilter);
	}, [listFilter]);

	function updateFilterList(leagueId: string) {
		let cpyListFilter = listFilter;

		//toggle the league id from the list; remove itif it exist, otherwise, push it
		if (listFilter.some((x) => x == leagueId)) {
			setListFilter(listFilter.filter((value) => value != leagueId));
		} else {
			setListFilter([...listFilter, leagueId]);
		}
	}

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>Parier</TextSubTitle>
			<View style={styles.textToMiddle}>
				<ScrollView horizontal={true}>
					<LeagueIcon
						onPress={() => setListFilter([])}
						filter={listFilter}
					/>

					{leagues.map((league: LeagueSchema) => {
						if (league.leagueId)
							return (
								<LeagueIcon
									key={league.leagueId}
									league={league}
									onPress={(id: string) =>
										updateFilterList(id)
									}
									filter={listFilter}
								/>
							);
						else return null;
					})}
				</ScrollView>

				<View>
					<AllBets
						isShow={isShow}
						joinCode={joinCode}
						callbackShowMatchBet={callbackShowMatchBet}
						leagues={leagues}
						filter={listFilter}
						matchs={matchs}
					/>
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
		// alignItems: "center", //Notpossible,too large
	},
});
