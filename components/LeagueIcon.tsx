import React from "react";
import { View, Text, TextTitle, SubText } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LeagueSchema } from "../src/interaces/interfacesQuotes";

import EvilIcons from "react-native-vector-icons/EvilIcons";


export function LeagueIcon(props: any) {
	const callBack: any = props.callBack;
	const league: LeagueSchema = props.league;
    
    
    console.log(league)
	return (
		<TouchableOpacity onPress={callBack}>
			<View style={styles.leagueContainer}>
            <EvilIcons style={styles.leagueLogo} name="chart" size={20} color={"#000"} />
					

				<Text style={styles.leagueTitle}>
					{league?league.leagueName:"Tous"}
				</Text>
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
        fontSize:11,
		textAlign: "center",
	},
	leagueContainer: {
        margin:28,
        backgroundColor:'white',
        padding:4,
        width:44,
        height:44,
		flex: 1,
		borderRadius: 8,
	},
});
