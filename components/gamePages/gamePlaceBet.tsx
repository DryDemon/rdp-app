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
import AllBets from "../allbets";
import { LeagueIcon } from "../LeagueIcon";
import Colors from "../../constants/Colors";
import { DropDownPickerStyleSheep } from "../../screens/create";

import RNPickerSelect from "react-native-picker-select";
import useInterval from "../../hooks/useInterval";

async function fetchBetData(joinCode: string, jwt: string) {
	// const apiRoute =
	// 	ENVIRONEMENT != "dev" ? "getnextmatchleaguedata" : "getmatchleaguedata";

	if (joinCode && jwt) {
		const rawResponse = await fetch(
			`${SERVER_API_URL}/getnextmatchleaguedata?jwt=${jwt}&joinCode=${joinCode}`
		);

		const content = await rawResponse.json();
		if (content.success == 1) return content;
	}
	return undefined;
}

export async function fetchLiveBetData(jwt: string, matchIds: string[]) {
	// const apiRoute =
	// 	ENVIRONEMENT != "dev" ? "getnextmatchleaguedata" : "getmatchleaguedata";

	if (matchIds.length != 0 && jwt) {
		const rawResponse = await fetch(
			`${SERVER_API_URL}/getmatchsliveodds?jwt=${jwt}&matchIds=${matchIds.toString()}`
		);

		const content = await rawResponse.json();
		if (content.success == 1) return content.liveOdds;
	}
	return undefined;
}

// async function fetchLiveBetData(joinCode: string, jwt: string) {
// 	if (joinCode && jwt) {
// 		const rawResponse = await fetch(
// 			`${SERVER_API_URL}/getlivematchs?jwt=${jwt}&joinCode=${joinCode}`
// 		);

// 		const content = await rawResponse.json();
// 		if (content.success == 1) return content;
// 	}
// 	return undefined;
// }

export default function GamePlaceBet(props: any) {
	const {
		jwt,
		joinCode,
		callbackShowMatchBet,
		betChoiceListGroup,
		matchsGameHandlerState,
		...otherProps
	} = props;

	const [matchs, setMatchs] = matchsGameHandlerState;
	const [leagues, setLeagues] = useState<Array<LeagueSchema>>([]);

	const [listLiveLeagues, setListLiveLeagues] = useState<Array<string>>([]);
	const [listLiveMatchIds, setListLiveMatchIds] = useState<Array<string>>([]);

	const [listFilter, setListFilter] = useState<Array<string>>([]);
	const [isLive, setIsLive] = useState(ENVIRONEMENT == "dev" ? true : false);

	useInterval(async () => {
		let liveData = await fetchLiveBetData(jwt, listLiveMatchIds);
		if (liveData && liveData.length != 0) {
			let matchsCpy: MatchSchema[] = matchs;
			for (let i = matchsCpy.length - 1; i >= 0; i--) {
				let hasAMatch = false;
				Object.keys(liveData).forEach(function (key) {
					if (key == matchsCpy[i].matchId) {
						hasAMatch = true;
						let value = liveData[key];
						matchsCpy[i].matchOdds = value.odds;
						matchsCpy[i].matchStats = value.stats;

						if (value.odds == []) {
							//si jamais le match n'a plus d'odds en live, alors on l'enleve de la liste des matchs a afficher
							matchsCpy.splice(i, 1);

							//et on l'enleve des matchs a recharger... Peut bugger Peut etre besoin, de l'enlever dans le futur
							setListLiveMatchIds(
								listLiveMatchIds.filter(
									(valueFilterMatchId: string) =>
										valueFilterMatchId != key
								)
							);
						}
					}
				});
				if(!hasAMatch){
					if(matchsCpy[i].liveId){
						//si un match n'a pas reçu de réponse, on le supprimer
						setListLiveMatchIds(
							listLiveMatchIds.filter(
								(valueFilterMatchId: string) =>
									valueFilterMatchId != matchsCpy[i].matchId
							)
						);
					}
				}
			}

			setMatchs(matchsCpy);
		}
	}, RELOAD_LIVE_BETS_EVERY_SECONDS * 1000);

	useEffect(() => {
		fetchBetData(joinCode, jwt).then((content) => {
			if (content) {
				if (content.matchs) {
					setMatchs(content.matchs);
					let listLiveLeaguesCpy: string[] = [];
					let listLiveMatchCpy: string[] = [];
					content.matchs.forEach((value: MatchSchema) => {
						if (
							value.liveId &&
							value.leagueId &&
							listLiveLeaguesCpy.indexOf(value.leagueId) == -1
						) {
							setIsLive(true);
							listLiveLeaguesCpy.push(value.leagueId);
						}
						if (
							value.liveId != undefined &&
							value.matchId != undefined
						) {
							listLiveMatchCpy.push(value.matchId);
						}
					});
					setListLiveMatchIds(listLiveMatchCpy);
					setListLiveLeagues(listLiveLeaguesCpy);
				}
				if (content.leagues) setLeagues(content.leagues);
			}
		});

		// fetchLiveBetData(joinCode, jwt).then((content) => {
		// 	if (content) {
		// 		if (content.matchs) setLiveMatchs(content.matchs);
		// 		if (content.leagues) setLiveLeagues(content.leagues);
		// 	}
		// });
	}, [jwt, joinCode]);

	function updateFilterList(leagueId: string) {
		let cpyListFilter = listFilter;

		//toggle the league id from the list; remove itif it exist, otherwise, push it
		if (listFilter.some((x: any) => x == leagueId)) {
			setListFilter(listFilter.filter((value: any) => value != leagueId));
		} else {
			setListFilter([...listFilter, leagueId]);
		}
	}

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>Parier</TextSubTitle>
			<View style={styles.textToMiddle}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					{isLive ? (
						<View style={styles.liveIconContainer}>
							<Text style={styles.liveIconText}>LIVE</Text>
						</View>
					) : null}
					<RNPickerSelect
						style={DropDownPickerStyleSheep}
						useNativeAndroidPickerStyle={false}
						onValueChange={(value: string) => {
							if (value) {
								setListFilter(value.split(","));
							}
						}}
						items={[
							{
								label: "Toutes les compétitions",
								value: leagues.map<string>(
									(value: LeagueSchema) => {
										if (value.leagueId)
											return value.leagueId;
										return "";
									}
								),
							},
						].concat(
							leagues.map<{ label: string; value: string[] }>(
								(league: LeagueSchema) => {
									if (league.leagueName && league.leagueId)
										return {
											label: league.leagueName,
											value: [league.leagueId],
										};
									return { label: "", value: [""] };
								}
							)
						)}
					/>

					{/* {leagues.map((league: LeagueSchema) => {
						if (league.leagueId)
							return (
								<LeagueIcon
									isLive={listLiveLeagues.some(
										(value: string) =>
											value == league.leagueId
									)}
									key={league.leagueId}
									league={league}
									onPress={(id: string) =>
										updateFilterList(id)
									}
									filter={listFilter}
								/>
							);
						else return null;
					})} */}
				</View>

				<View>
					<AllBets
						joinCode={joinCode}
						callbackShowMatchBet={callbackShowMatchBet}
						leagues={leagues}
						filter={listFilter}
						matchs={matchs}
						betChoiceListGroup={betChoiceListGroup}
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
	liveIconContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 14,
		alignItems: "center",
		borderColor: "black",
		borderWidth: 1,
	},
	liveIconText: {
		fontWeight: "500",
		fontSize: 16,
		// lineHeight: 21,

		textAlign: "center",
		letterSpacing: -0.32,

		color: Colors.rdpColor,
	},
});
