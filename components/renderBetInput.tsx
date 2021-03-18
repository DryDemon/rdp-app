import React from "react";
import { View, Text, TextTitle, SubText, TextInput } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

export function RenderBetInput(props: any) {
	let { onChange, odd, value, ...otherProps } = props;

	return (
		<View>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						style={styles.buttonRevert}
						onPress={() => onChange(++value)}
					>
						<Text style={styles.buttonRevertText}>+</Text>
					</TouchableOpacity>
					<TextInput
						style={styles.input}
						value={value}
						onChangeText={(mise) => {
							onChange(mise);
						}}
						placeholder={"Mise"}
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={() => onChange(--value)}
					>
						<Text style={styles.buttonText}>-</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.gainPotentiel}>
					<Text>Gain potentiel : </Text>
					<Text>{(value * odd).toFixed(2)}</Text>
				</View>
			</View>

			<Text>input</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		alignItems: "center",
		width: 28,
		height: 28,
		borderRadius: 8,
		margin: 5,
		backgroundColor: Colors.rdpColor,
	},
	buttonText: {
		color: "white",
		fontSize: 14,
	},
	buttonRevert: {
		justifyContent: "center",
		alignItems: "center",
		width: 28,
		height: 28,
		borderRadius: 8,
		margin: 5,
		backgroundColor: "#ECF2FE",
	},
	buttonRevertText: {
		color: Colors.rdpColor,
		fontSize: 14,
	},
	input: {
		margin: 5,
	},
	gainPotentiel: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
	},
});
