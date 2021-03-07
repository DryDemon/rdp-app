import * as React from "react";
import { useState, useEffect } from "react";
import { Image, Alert, StyleSheet } from "react-native";
import { SERVER_API_URL } from "../constants/Server";
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
import { FontAwesome } from "@expo/vector-icons";

var facebookProvider = new firebase.auth.FacebookAuthProvider();
var googleProvider = new firebase.auth.GoogleAuthProvider();

export default function Register({navigation} :any) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [alertUsername, setAlertUsername] = useState(" ");
	const [alertEmail, setAlertEmail] = useState(" ");
	const [alertPassword, setAlertPassword] = useState(" ");
	const [alertConfirmPassword, setAlertConfirmPassword] = useState(" ");

	const validateEmailRegexStr =
		"^[A-za-z0-9._%+-]+@[A-za-z.-]+\\.[A-za-z]{2,4}$";
	const validateEmailRegex = new RegExp(validateEmailRegexStr);

	useEffect(() => {
		checkForm();
	}, [password, confirmPassword, email]);
	useEffect(() => {
		checkUsername();
	}, [username]);

	function registerWithFacebook() {
		firebase
			.auth()
			.signInWithPopup(facebookProvider)
			.then((result) => {
				/** @type {firebase.auth.OAuthCredential} */
				var credential = result.credential;

				// This gives you a Google Access Token. You can use it to access the Google API.

				// The signed-in user info.
				var user = result.user;
				navigation.navigate('Dashboard')
				// if (user) {
				// 	user.updateProfile({
				// 		displayName: username, // Update successful.
				// 	}).catch(function (error) {
				// 		// An error happened.
				// 	});
				// }
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				// ...
			});
	}
	function registerWithGoogle() {
		firebase
			.auth()
			.signInWithPopup(googleProvider)
			.then((result) => {
				/** @type {firebase.auth.OAuthCredential} */
				var credential = result.credential;

				// The signed-in user info.
				var user = result.user;

				navigation.navigate('Dashboard')

				// if (user) {
				// 	user.updateProfile({
				// 		displayName: username,
				// 	})
				// 		.then(function () {
				// 			// Update successful.
				// 		})
				// 		.catch(function (error) {
				// 			// An error happened.
				// 		});
				// 	// ...
				// }
			})
			.catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				// ...
			});
	}
	function onRegister() {
		if (username && password && confirmPassword && email && checkForm()) {
			checkUsername().then((ok: boolean) => {
				if (ok) {
					//On peut send les données.
					firebase
						.auth()
						.createUserWithEmailAndPassword(email, password)
						.then((userCredential) => {
							// registered!!
							var user = userCredential.user;
							navigation.navigate('Dashboard')
							// if (user) {
							// 	user.updateProfile({
							// 		displayName: username,
							// 	})
							// 		.then(function () {
							// 			// Update successful.
							// 		})
							// 		.catch(function (error) {
							// 			// An error happened.
							// 		});
							// }
							//redirect
						})
						.catch((error) => {
							var errorCode = error.code;
							var errorMessage = error.message;
							Alert.alert("Erreur : ", errorMessage);
						});
				}
			});
		}
	}

	async function checkUsername() {
		let noAlert = true;

		if (username.length < 4) {
			setAlertUsername("Ton pseudo doit faire au moins 4 charactères");
			noAlert = false;
		} else {
			const rawRep = await fetch(
				//TODO
				SERVER_API_URL + `/doesusernameexist?username=${username}`
			);
			const rep = await rawRep.json();

			if (rep.exists) {
				setAlertUsername(
					"Ton super pseudo est déjà pris par un autre joueur :/"
				);
				noAlert = false;
			}
		}

		if (noAlert) setAlertUsername(" ");
		return noAlert;
	}

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

		//check password
		if (
			!(
				password.length > 7 &&
				password.split("").some((char) => char.toUpperCase() != char) &&
				password.split("").some((char) => char.toLowerCase() != char)
			)
		) {
			ok = false;
			if (password != "")
				setAlertPassword(
					"Le mot de passe est sensé contenir au moins 8 characteres et une majuscule"
				);
		} else {
			setAlertPassword(" ");
		}

		//check confirm password
		if (password != confirmPassword) {
			ok = false;
			if (confirmPassword != "")
				setAlertConfirmPassword(
					"Les mots de passent ne sont pas pareils"
				);
		} else {
			setAlertConfirmPassword(" ");
		}
		return ok;
	}

	return (
		<ViewContainer>
			<TextTitle>Bienvenu parmi nous,</TextTitle>
			<TextMainTitle>Futur Roi</TextMainTitle>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1, alignItems: "center" }}>
					<FontAwesome.Button
						size={100}
						name="facebook"
						backgroundColor="#3b5998"
						onPress={registerWithFacebook}
					></FontAwesome.Button>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<FontAwesome.Button
						size={100}
						name="google"
						color="#FFFFFF"
						backgroundColor="#8B0000"
						onPress={registerWithGoogle}
					></FontAwesome.Button>
				</View>
			</View>
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

			<Text onPress={()=>navigation.navigate('Login')}>Tu as déjà un compte? Connectes-toi</Text>
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
