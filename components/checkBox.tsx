import React, { useEffect, useState } from "react";
import { SmallLineBreak, View, Text, SubText, TextTitle } from "./Themed";

import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

import Colors from "../constants/Colors";

export function CheckBox(props: any) {
	const value = props.value;
	const onValueChange = props.onValueChange;

	return (
		<View style={props.mainContainer}>
			<TouchableOpacity style={styles.container} onPress={onValueChange}>
				{props.value ? <View style={styles.check}></View> : null}
			</TouchableOpacity>
			{props.text ? (
				<View style={{flex:1}}>
					<Text>{props.text}</Text>
				</View>
			) : null}
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		borderColor: "black",
		borderWidth: 1,
		width: 12,
		height: 12,
		backgroundColor: "white",
		borderRadius: 4,
		padding: 1,
	},
	check: {
		backgroundColor: Colors.rdpColor,
		borderRadius: 2,
		width: 8,
		height: 8,
	},
	mainContainer: {
		padding: 10,
		flexDirection: "row",
	},
});
