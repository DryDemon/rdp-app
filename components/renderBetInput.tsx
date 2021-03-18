import React from "react";
import {
	View,
	Text,
	TextTitle,
	SubText,
	TextInput,
	SmallLineBreak,
} from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

export function RenderBetInput(props: any) {
	let { onChange, odd, value, nbBets, system, ...otherProps } = props;

	return (
		<View>
			<SmallLineBreak />

			{nbBets ? (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<View
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<Text style={{ fontSize: 12 }}>Nombre de paris : </Text>
						<Text style={{ fontSize: 12, fontWeight: "bold" }}>
							{nbBets}
						</Text>
					</View>
					<View style={styles.flexRight}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text>Côte totale</Text>
							<View style={styles.coteTotalContainer}>
								<Text style={styles.coteTotalText}>{odd}</Text>
							</View>
						</View>
					</View>
				</View>
			) : null}
			{system ? <Text>system</Text> : null}
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View style={{ flexShrink: 1 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TouchableOpacity
							style={styles.buttonRevert}
							onPress={() => onChange(--value)}
						>
							<Text style={styles.buttonRevertText}>-</Text>
						</TouchableOpacity>
						<TextInput
							maxLength={10}
							keyboardType="numeric"
							style={styles.input}
							value={value}
							onChangeText={(mise) => {
								onChange(mise);
							}}
							placeholder={"Mise"}
						/>
						<TouchableOpacity
							style={styles.button}
							onPress={() => onChange(++value)}
						>
							<Text style={styles.buttonText}>+</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.flexRight}>
					<Text style={{ fontSize: 12, fontWeight: "500" }}>
						Gain potentiel :
					</Text>
					<Text
						style={{
							fontSize: 12,
							fontWeight: "700",
							marginLeft: "auto",
							textAlign: "right",
						}}
					>
						{(value * odd).toFixed(2) + " €"}
					</Text>
				</View>
			</View>
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
		width: 100,
		margin: 5,
		borderRadius: 8,
		borderColor: Colors.rdpColor,
	},
	flexRight: {
		minWidth: "auto",
		marginLeft: "auto",
		textAlign: "right",
	},

	coteTotalContainer: {
		backgroundColor: Colors.rdpColor,
		alignItems: "center",
		margin: 8,
		paddingHorizontal: 2,
		paddingVertical: 2,
		borderRadius: 4,
	},
	coteTotalText: {
		fontWeight: "bold",
		fontSize: 15,
		color: "white",
	},
});
