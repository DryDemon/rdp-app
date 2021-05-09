import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";

import {
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
	BasicScrollView,
	SubText,
	SmallLineBreak,
} from "../components/Themed";
import { SERVER_API_URL } from "../constants/Server";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { User } from "../src/interaces/interfacesUsers";
import Colors from "../constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MainHeader } from "../components/mainHeader";
import { ENVIRONEMENT } from "../constants/Environement";

async function verifyUserToken(token: string) {
	let succeded = false;
	const rawRep = await fetch(
		SERVER_API_URL +
			`/resetpasswordsetpassword?validateToken=1&token=${token}`
	);

	const rep = await rawRep.json();

	let error = "";
	if (rep.success == 1) {
		if (+rep.isOutdated == 1) {
			error =
				"Tu as dépassé le temps limite pour remettre ton mot de passe à 0, tu peux demander un nouveau code sur la page précedente.";
		} else {
			succeded = true;
			if (ENVIRONEMENT == "dev") alert("dev message only, good");
		}
	} else {
		error =
			"Le code est incorrect, tu peux revenir en arrière pour en demander un nouveau.";

		if (ENVIRONEMENT == "dev") alert("dev message only, false");
	}
	return [succeded, error];
}

async function sendNewPassword(token: string, password: string) {
	let succeded = false;
	const rawRep = await fetch(
		SERVER_API_URL +
			`/resetpasswordsetpassword?newPassword=${password}&token=${token}`
	);

	const rep = await rawRep.json();

	let error = "";
	if (rep.success == 1) {
		succeded = true;
		if (ENVIRONEMENT == "dev") alert("dev message only, good");
	} else {
		if (ENVIRONEMENT == "dev") alert("dev message only, false");
	}
	return [succeded, error];
}

export default function userConditions({ navigation, route: { params } }: any) {

	return (
		<ViewContainer>
			<MainHeader
				back={"Register"}
				navigation={navigation}
			/>
			<BasicScrollView>
				<LineBreak />
				<TextTitle style={styles.topTitle}>
					Conditions D'utilisations
				</TextTitle>
				<LineBreak />
				<Text>blablabla</Text>
				<LineBreak />
			</BasicScrollView>
		</ViewContainer>
	);
}

const styles = StyleSheet.create({
	container: {
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
	topTitle: {
		marginTop: Constants.statusBarHeight,
	},
});
