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
import { Alert, Image, StyleSheet, ScrollView } from "react-native";
import { GameSchema, userBetInterface } from "../src/interaces/interfacesGame";
import { GameIcon } from "./GameIcon";
import Colors from "../constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

export function SeeDetails(props: any) {
	let bet = props.bet;
	const [show, setShow] = useState(false);

	return (
		<View>
			<TouchableOpacity
				style={styles.seeDetailsView}
				onPress={() => setShow(!show)}
			>
				<Text style={styles.seeDetailsText}>
					Voir le détail {show ? "+" : "-"}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	seeDetailsView: {
		backgroundColor: "#E2F1FF",
		padding: 4,
        borderRadius:4,
	},
	seeDetailsText: {
		fontSize: 12,
		fontWeight: "500",
	},
});
