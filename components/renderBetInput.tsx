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
import { Picker } from "@react-native-picker/picker";

export function getSystemName(
	length: number | undefined,
	choice: number | undefined
) {
	if (length && choice) {
		if (choice == 0) return length + " paris simples";
		else if (choice == length - 1) return length + " paris combinés";
		else return "Système " + (choice + 1) + "/" + length;
	}
	return length + " paris simples";
}

export function RenderBetInput(props: any) {
	let {
		onChange,
		odd,
		value,
		nbBets,
		system,
		systemChoice,
		setSystemChoice,
		...otherProps
	} = props;

	function renderSystemChoices() {
		let choices: any[] = [];

		for (let i = props.nbBase; i < nbBets; i++) {
			choices.push(
				<Picker.Item label={getSystemName(nbBets, i)} value={i} />
			);
		}

		return choices;
	}

	return (
		<View>
			<SmallLineBreak />

			{nbBets && !system ? (
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
								<Text style={styles.coteTotalText}>
									{odd.toFixed(2)}
								</Text>
							</View>
						</View>
					</View>
				</View>
			) : null}
			{system ? (
				<View>
					<Picker
						selectedValue={systemChoice}
						style={styles.systemPicker}
						onValueChange={(itemValue: any) => {
							setSystemChoice(parseInt(itemValue));
						}}
					>
						{renderSystemChoices()}
					</Picker>
				</View>
			) : null}

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
							style={
								value > 0
									? styles.buttonRevert
									: styles.buttonRevertUnavailable
							}
							onPress={
								value > 0 ? () => onChange(--value) : () => {}
							}
						>
							<Text
								style={
									value > 0
										? styles.buttonRevertText
										: styles.buttonRevertUnavailableText
								}
							>
								-
							</Text>
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

					{system ? ( //partie system juste sous l'input
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text>Côte totale</Text>
							<View style={styles.coteTotalContainer}>
								<Text style={styles.coteTotalText}>
									{odd.toFixed(2)}
								</Text>
							</View>
						</View>
					) : null}
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
	buttonRevertUnavailable: {
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
	buttonRevertUnavailableText: {
		color: Colors.gray,
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
	systemPicker: {
		paddingHorizontal: 2,
		paddingVertical: 2,
		borderRadius: 8,
		borderColor: Colors.rdpColor,
		margin: 10,
	},
});
