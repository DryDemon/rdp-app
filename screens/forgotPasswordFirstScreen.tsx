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

async function sendDataLoginUser(email: string) {
	let succeded = false;
	const rawRep = await fetch(
		SERVER_API_URL + `/sendresetpasswordemail?email=${email}`
	);
	// const rawRep = await fetch(
	// 	`http://localhost:3001/api/sendresetpasswordemail?email=${email}`
	// );
	const rep = await rawRep.json();

	if (rep.success == 1) {
		succeded = true;
		if (ENVIRONEMENT == "dev") alert("dev message only, good");
	} else {
		if (ENVIRONEMENT == "dev") alert("dev message only, false");
	}
	return succeded;
}

export default function ForgotPasswordFirstScreen({ navigation }: any) {
	const [email, setEmail] = useState("");
	const [alertEmail, setAlertEmail] = useState("");

	const validateEmailRegexStr =
		"^[A-za-z0-9._%+-]+@[A-za-z.-]+\\.[A-za-z]{2,4}$";
	const validateEmailRegex = new RegExp(validateEmailRegexStr);

	function gotoForgotPasswordSecondPage() {
		if (checkForm())
			sendDataLoginUser(email).then((success: boolean) => {
				if (success) navigation.navigate("ForgotPasswordSecondScreen");
			});
	}

	function directGotoSecondPage() {
		navigation.navigate("ForgotPasswordSecondScreen");
	}

	useEffect(() => {
		checkForm();
	}, [email]);

	function checkForm() {
		let ok = true;
		//check Email
		if (!validateEmailRegex.test(email)) {
			ok = false;
			if (email != "")
				setAlertEmail(
					"Votre email n'est pas correct, Merci de le verifier"
				);
		} else {
			setAlertEmail(" ");
		}

		return ok;
	}

	return (
		<ViewContainer>
			<MainHeader back={"Login"} navigation={navigation} />
			<BasicScrollView>
				<LineBreak />
				<TextTitle style={styles.topTitle}>
					Mot de passe oublié ?
				</TextTitle>
				<LineBreak />
				<SubText>
					Pas d’inquiétude, on comprend. Entre simplement le mail lié
					à ton compte, et on t’envoie de ce pas les instructions à
					suivre pour changer de mot de passe.
				</SubText>
				<LineBreak />
				<TextLabel>Email du Compte</TextLabel>
				<TextInput
					value={email}
					keyboardType={"email-address"}
					onChangeText={(email: string) => {
						setEmail(email);
					}}
					placeholder={"exemple@mail.com"}
				/>
				<TextWarning>{alertEmail}</TextWarning>

				<SmallLineBreak />
				<Button
					title={"Continuer"}
					onPress={gotoForgotPasswordSecondPage}
				/>
				<View style={{ alignItems: "center" }}>
					<SubText>Fais attention la prochaine fois !</SubText>
					<SmallLineBreak />
					<SubText onPress={() => directGotoSecondPage()}>
						J'ai déjà un code.
					</SubText>
				</View>
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
