import * as React from "react";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import firebase from "firebase";
import "firebase/auth";
import { firebaseConfig } from "../constants/FirebaseConfig";

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
import { SERVER_API_URL } from "../constants/Server";

firebase.initializeApp(firebaseConfig);



export default function Login() {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	
	const [alertEmail, setAlertEmail] = useState(" ");
	const [alertPassword, setAlertPassword] = useState(" ");
	
	function onLogin(){
		firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
		  // Signed in
		  var user = userCredential.user;
			//redirect
		  // ...
		})
		.catch((error: any) => {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  Alert.alert("Erreur : ", errorMessage);
		});
	}

	
	return (
		<ViewContainer>
			<TextTitle>Bon retour parmi nous,</TextTitle>
			{/* <TextMainTitle>Futur Roi</TextMainTitle> //TODO ROI PAUL...*/} 

			<View
				style={styles.separator}
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>

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

			<LineBreak />
			<Button title={"M'inscrire"} onPress={onLogin} />
			<LineBreak />

			<Text>Tu n'as pas de compte? Inscris toi!</Text>
			<LineBreak />
			<LineBreak />
			<LineBreak />
		</ViewContainer>
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
