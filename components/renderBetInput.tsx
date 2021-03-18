import React from "react";
import { View, Text, TextTitle, SubText, TextInput } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

export function RenderBetInput(props: any) {
	let { onChange, odd, value, ...otherProps } = props;

	return (
		<View>
			<TouchableOpacity
				style={styles.button}
				onPress={() => onChange(++value)}
			>
				+
			</TouchableOpacity>
			<TextInput
				value={value}
				onChangeText={(mise) => {
					onChange(mise);
				}}
				placeholder={"Le nombre de crédits que tu veux parier"}
			/>
			<TouchableOpacity
				style={styles.button}
				onPress={() => onChange(--value)}
			>
				-
			</TouchableOpacity>

			<Text>input</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	button: { backgroundColor : Colors.rdpColor },
});
