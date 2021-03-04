import * as React from "react";
import { useState, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";

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
} from "../components/Themed";

export default function TabTwoScreen() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [alertUsername, setAlertUsername] = useState(" ");
	const [alertEmail, setAlertEmail] = useState(" ");
	const [alertPassword, setAlertPassword] = useState(" ");
	const [alertConfirmPassword, setAlertConfirmPassword] = useState(" ");

	const validateEmailRegexStr =	"^[A-za-z0-9._%+-]+@[A-za-z.-]+\\.[A-za-z]{2,4}$";
	const validateEmailRegex =  new RegExp(validateEmailRegexStr)
	
	useEffect(() => {
		checkForm();
	}, [password, confirmPassword, email]);
	useEffect(() => {
		checkUsername();
	}, [username]);
	
	function onRegister() {
		if (username && password && confirmPassword && email) {
			//On peut send les données.
		}
	}

	async function checkUsername() {}

	function checkForm() {
		//check Email
		if(!validateEmailRegex.test(email)){
			if (email != "")
				setAlertEmail(
					"Votre email n'est pas correct, merci de le verifier"
				);
		} else {
			setAlertEmail(" ");
		}

		

		//check password
		if (
			!(
				password.length > 7 &&
				password.split("").some((char) => char.toUpperCase() != char) &&
				password.split("").some((char) => char.toLowerCase() != char)
			)
		) {
			if (password != "")
				setAlertPassword(
					"Le mot de passe est sensé contenir au moins 8 characteres et une majuscule"
				);
		} else {
			setAlertPassword(" ");
		}

		//check confirm password
		if (password != confirmPassword) {
			if (confirmPassword != "")
				setAlertConfirmPassword(
					"Les mots de passent ne sont pas pareils"
				);
		} else {
			setAlertConfirmPassword(" ");
		}
	}

	return (
		<ViewContainer>
			<TextTitle>Bienvenu parmi nous,</TextTitle>
			<TextMainTitle>Futur Roi</TextMainTitle>

			<View
				style={styles.separator}
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>

			<TextLabel>Pseudo</TextLabel>
			<TextInput
				value={username}
				onChangeText={(username) => {
					setUsername(username);
				}}
				placeholder={"LeParieurDu93"}
			/>
			<TextWarning>{alertUsername}</TextWarning>

			<TextLabel>Email</TextLabel>
			<TextInput
				value={email}
				onChangeText={(email) => {
					setEmail(email);
				}}
				placeholder={"exemple@mail.com"}
			/>
			<TextWarning>{alertEmail}</TextWarning>

			<TextLabel>Mot De Passe</TextLabel>
			<TextInput
				value={password}
				onChangeText={(password) => {
					setPassword(password);
				}}
				placeholder={"8 lettres minimum, une majuscule"}
				secureTextEntry={true}
			/>
			<TextWarning>{alertPassword}</TextWarning>

			<TextLabel>Confirmation De Mot De Passe</TextLabel>
			<TextInput
				value={confirmPassword}
				onChangeText={(p) => {
					setConfirmPassword(p);
				}}
				placeholder={"Le même stp"}
				secureTextEntry={true}
			/>
			<TextWarning>{alertConfirmPassword}</TextWarning>

			<Text style={styles.conditions}>
				En vous inscrivant, vous déclarez accepter les conditions
				générales d'utilisations de RDP.
			</Text>
			{/* TODO faire les conditions */}

			<LineBreak />
			<Button title={"M'inscrire"} onPress={onRegister} />
			<LineBreak />

			<Text>Tu as déjà un compte? Connectes-toi</Text>
			<LineBreak />
			<LineBreak />
			<LineBreak />
		</ViewContainer>
	);
}

const styles = StyleSheet.create({
	separator: {
		marginVertical: 20,
		height: 1,
		width: "100%",
	},
	conditions: {
		fontSize: 12,
		fontStyle: "italic",
	},
});
