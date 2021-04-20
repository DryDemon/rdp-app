import React from "react";
import { View, Text, TextTitle, SubText } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LeagueSchema } from "../src/interaces/interfacesQuotes";

import EvilIcons from "react-native-vector-icons/EvilIcons";
import Colors from "../constants/Colors";

export function LeagueIcon(props: any) {
	const league: LeagueSchema = props.league;
	const filter: Array<string> = props.filter;
	const isLive: boolean = props.isLive;

	return (
		<TouchableOpacity
			onPress={() => {
				if (league && league.leagueId) props.onPress(league.leagueId);
				else props.onPress();
			}}
		>
			<View
				style={
					!(
						(league?.leagueId &&
							filter.some(
								(value: any) => value == league.leagueId
							)) ||
						(filter.length == 0 && !league)
					)
						? styles.leagueContainer
						: styles.leagueContainerSelected
				}
			>
				<EvilIcons
					style={styles.leagueLogo}
					name="chart"
					size={20}
					color={
						!(
							(league?.leagueId &&
								filter.some(
									(value: any) => value == league.leagueId
								)) ||
							(filter.length == 0 && !league)
						)
							? "#000"
							: "#FFF"
					}
				/>

				<Text
					style={
						!(
							(league?.leagueId &&
								filter.some(
									(value: any) => value == league.leagueId
								)) ||
							(filter.length == 0 && !league)
						)
							? styles.leagueTitle
							: styles.leagueTitleSelected
					}
				>
					{league ? league.leagueName : "Tous"}
				</Text>

				{isLive ? (
					<View style={styles.liveContainer}>
						{" "}
						<Text style={styles.liveText}>Live</Text>
					</View>
				) : null}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	leagueLogo: {
		marginLeft: "auto",
		marginRight: "auto",
	},
	leagueTitle: {
		fontSize: 11,
		textAlign: "center",
	},
	leagueTitleSelected: {
		fontSize: 11,
		textAlign: "center",
		color: "white",
	},
	leagueContainer: {
		margin: 10,
		backgroundColor: "white",
		padding: 4,
		// width: 44,
		height: 44,
		flex: 1,
		borderRadius: 8,
	},
	leagueContainerSelected: {
		margin: 10,
		backgroundColor: Colors.rdpColor,
		padding: 4,
		// width: 44,
		height: 44,
		flex: 1,
		borderRadius: 8,
	},
	liveContainer: {
		backgroundColor: Colors.red,
	},
	liveText: {
		color: "white",
	},
});
