import React, { useState } from "react";
import { View, Text, TextTitle, SubText } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import AppLoading from "expo-app-loading";

import Colors from "../constants/Colors";

export function LoadingPage(props: any) {
	const [threedots, setThreedots] = useState(0);

	//TODO
	// function setThreeDotsTimer(){
	// 	setThreedots((threedots + 1) % 4);
	// 	setTimeout(() => {
	// 		setThreedots((threedots + 1) % 4);
	// 	}, 500);
	// 	setThreeDotsTimer()
	// }

	// setThreeDotsTimer();

	return (
		<View style={styles.container}>
			{/* <View style={styles.textContainer}> */}
			<TextTitle style={styles.text}>
				Chargement
				{() => {
					let out = "";
					for (let i = 0; i < threedots; i++) {
						out += ".";
					}
					return out;
				}}
			</TextTitle>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		justifyContent: "space-between",
		alignItems: "center",
	},
	text: {},
});
