import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextTitle,
	LineBreak,
	Button,
	SubText,
	TextInput,
	TextWarning,
	SmallLineBreak,
} from "./Themed";
import { Alert, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { SERVER_API_URL } from "../constants/Server";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { userStatsInterface } from "../src/interaces/interfacesGame";

export function PlayerIconName(props: any) {
	const user: userStatsInterface = props.user;
	const position: number = props.position;
	const onThrone: boolean | undefined = props.onThrone;
	const onSelect = props.onSelect;

	if (onThrone)
		return (
			<TouchableOpacity onPress={() => {onSelect()}}>
				<Text>1</Text>
				<MaterialCommunityIcons name="crown" size={20} color={"#000"} />

				<Text style={styles.mainClassementUsername}>
					{user.username}
				</Text>
				<Text style={styles.mainClassementCredits}>
					{user.credits?.toFixed(2)}
				</Text>
			</TouchableOpacity>
		);
	else
		return (
			<TouchableOpacity onPress={() => {onSelect()}}>
				<View style={styles.subClassement}>
					<Text style={styles.subClassementUsername}>
						{position + " : " + user.username}
					</Text>
					<Text style={styles.subClassementCredits}>
						{user.credits?.toFixed(2)}
					</Text>
				</View>
			</TouchableOpacity>
		);
}

const styles = StyleSheet.create({
	mainClassementUsername: {
		fontSize: 14,
		fontWeight: "500",
	},
	mainClassementCredits: {
		fontWeight: "700",
		fontSize: 16,
		color: Colors.rdpColor,
	},
	subClassementUsername: {
		fontSize: 15,
		fontWeight: "500",
	},
	subClassement: {
		width: "100%",
		flexDirection: "row",
		backgroundColor: "white",
		borderRadius: 12,
		padding: 24,
		margin: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,
		elevation: 4,
	},
	subClassementCredits: {
		fontWeight: "700",
		fontSize: 15,
		color: Colors.rdpColor,

		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
	},
});
