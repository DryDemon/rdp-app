import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";

import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

export function GameFooter(props: any) {
	const {idPage ,...otherProps } = props;

	//EvilIcons chart
	// MaterialCommunityIcons progress-clock
	// FontAwesome5 coins
	//Feather shopping-cart
	// FontAwesome calendar-check-o
	//                    <Icon style={styles.gameLogo} name="calendar" size={20} color="#FFF"  />

	function gotoIcon(id: number) {
		console.log(id);
	}

	return (
		<View style={styles.footer}>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(1);
				}}
			>
				<EvilIcons name="chart" size={20} color="#000" />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(2);
				}}
			>
				<MaterialCommunityIcons
					name="progress-clock"
					size={20}
					color="#000"
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(3);
				}}
			>
				<FontAwesome5 name="coins" size={20} color="#000" />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(4);
				}}
			>
				<Feather name="shopping-cart" size={20} color="#000" />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(5);
				}}
			>
				<FontAwesome name="calendar-check-o" size={20} color="#000" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	iconContainer: {
		flex: 1,
		alignItems: "center",
	},
	footer: {
		height: 40,
		padding: 10,
		width: "100%",

		color: "#FFFFFF",
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
	},
});
