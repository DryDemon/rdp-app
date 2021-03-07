import * as React from "react";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import firebase from "firebase";
import "firebase/auth";
import { firebaseConfig } from "../constants/FirebaseConfig";

import {
	ProtectedHeader,
	Text,
	View,
	TextInput,
	Button,
	TextMainTitle,
	TextTitle,
	TextLabel,
	ViewContainer,
	ViewCenter,
	TextWarning,
	LineBreak,
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";

export default function Dashboard({ navigation }: any) {
	var user = firebase.auth().currentUser;

	if (ENVIRONEMENT != "dev") {
		if (user) {
			// User is signed in.
		} else {
			navigation.navigate("Login");
		}
	}

	return (
		<View>
			<ProtectedHeader />
			<ViewContainer>
				<Text>Salut Protected</Text>
				<LineBreak />
			</ViewContainer>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
