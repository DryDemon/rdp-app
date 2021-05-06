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

export default function ForgotPasswordSecondScreen({ navigation }: any) {
	const [token, setToken] = useState("");
	const [mdp, setMdp] = useState("");
	const [mdpVerif, setMdpVerif] = useState("");
	const [alertMdp, setAlertMdp] = useState(" ");
	const [alertMdpVerif, setAlertMdpVerif] = useState(" ");
	const [isTokenGood, setIsTokenGood] = useState(false);

	useEffect(() => {
		checkForm();
	}, [mdp, mdpVerif]);

	function setNewPassword() {
		if (checkForm()) {
			sendNewPassword(token, mdp).then(([value, error]) => {
				if (value == true) {
					Alert.alert(
						"Parfait !",
						"Ton mot de passe a été changé, tu peux maintenant te connecter!"
					);
					navigation.navigate("Login");
				} else {
					if (error != "" && typeof error == "string")
						Alert.alert("Erreur", error);
				}
			});
		}
	}

	function checkUserToken() {
		verifyUserToken(token).then(([value, error]) => {
			if (value == true) {
				setIsTokenGood(true);
			} else {
				if (error != "" && typeof error == "string")
					Alert.alert("Erreur", error);
				setIsTokenGood(false);
			}
		});
	}

	function checkForm() {
		let ok = true;

		//check password
		if (
			!(
				mdp.length > 7 &&
				mdp.split("").some((char: any) => char.toUpperCase() != char) &&
				mdp.split("").some((char: any) => char.toLowerCase() != char)
			)
		) {
			ok = false;
			if (mdp != "")
				setAlertMdp(
					"Le mot de passe est sensé contenir au moins 8 characteres et une majuscule"
				);
		} else {
			setAlertMdp(" ");
		}

		//check confirm password
		if (mdp != mdpVerif) {
			ok = false;
			if (mdpVerif != "")
				setAlertMdpVerif("Les mots de passent ne sont pas pareils");
		} else {
			setAlertMdpVerif(" ");
		}
		return ok;
	}

	return (
		<ViewContainer>
			<MainHeader
				back={"ForgotPasswordFirstScreen"}
				navigation={navigation}
			/>
			<BasicScrollView>
				<LineBreak />
				<TextTitle style={styles.topTitle}>
					Mot de passe oublié ?
				</TextTitle>
				<LineBreak />
				<SubText>Rentre ici le code que tu as reçu par message</SubText>
				<SmallLineBreak />
				<TextLabel>Code</TextLabel>
				<TextInput
					value={token}
					onChangeText={(token: string) => {
						setToken(token);
					}}
					placeholder={""}
				/>
				{!isTokenGood ? (
					<Button title={"Continuer"} onPress={checkUserToken} />
				) : (
					<View>
						<LineBreak />
						<SubText>
							Tu peux maintenant rentrer ton nouveau mot de passe
						</SubText>
						<SmallLineBreak />
						<TextLabel>Nouveau mot de passe</TextLabel>
						<TextInput
							value={mdp}
							onChangeText={(mdpEntry: string) => {
								setMdp(mdpEntry);
							}}
							placeholder={"8 lettres minimum, une majuscule"}
							secureTextEntry={true}
						/>
						<TextWarning>{alertMdp}</TextWarning>
						<LineBreak />
						<TextLabel>Confirmation de mot de passe</TextLabel>
						<TextInput
							value={mdpVerif}
							onChangeText={(mdpEntry: string) => {
								setMdpVerif(mdpEntry);
							}}
							placeholder={""}
							secureTextEntry={true}
						/>
						<TextWarning>{alertMdpVerif}</TextWarning>

						<Button title={"Continuer"} onPress={setNewPassword} />
					</View>
				)}
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
