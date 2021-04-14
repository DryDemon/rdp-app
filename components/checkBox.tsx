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
			{onValueChange ? (
				<TouchableOpacity
					style={styles.container}
					onPress={onValueChange}
				>
					{props.value ? <View style={styles.check}></View> : null}
				</TouchableOpacity>
			) : (
				<View style={styles.container}>
					{props.value ? <View style={styles.check}></View> : null}
				</View>
			)}
			{props.text ? (
				<View style={{ flex: 1 }}>
					<Text>{props.text}</Text>
				</View>
			) : null}
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		borderColor: Colors.black,
		borderWidth: 2,
		width: 14,
		height: 14,
		borderRadius: 4,
	},
	check: {
		borderRadius: 2,
		width: 8,
		height: 8,
	},
	mainContainer: {
		padding: 10,
		flexDirection: "row",
	},
});
