import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import BasicBet from "./basicbet";
import { SmallLineBreak, View, Text, SubText, TextTitle } from "./Themed";

import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../constants/Colors";

export default function CheckBox(props: any) {
	const value = props.value;

	return (
		<View style={props.style}>
			<TouchableOpacity
				style={styles.container}
				onPress={props.onValueChange(!value)}
			>
				{props.value ? <View style={styles.check}></View> : null}
			</TouchableOpacity>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		width: 10,
		height: 10,
		backgroundColor: "white",
		borderRadius: 4,
		padding: 2,
	},
	check: {
		backgroundColor: Colors.rdpColor,
		borderRadius: 2,
		width: 8,
		height: 8,
	},
});
