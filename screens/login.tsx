import * as React from "react";
import { useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";
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
import { FontAwesome } from "@expo/vector-icons";

var facebookProvider = new firebase.auth.FacebookAuthProvider();
var googleProvider = new firebase.auth.GoogleAuthProvider();

export default function Login({ navigation }: any) {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const [alertEmail, setAlertEmail] = useState(" ");
	const [alertPassword, setAlertPassword] = useState(" ");


	async function registerWithFacebook() {
		const appId = 232887001646631;
		const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs
		
		const {
		  type,
		  token,
		} = await Expo.Facebook.logInWithReadPermissionsAsync(
		  appId,
		  {permissions}
		);
	  
		switch (type) {
		  case 'success': {
			await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
			const credential = firebase.auth.FacebookAuthProvider.credential(token);
			const facebookProfileData = await firebase.auth().signInWithCredential(credential);  // Sign in with Facebook credential
	  
			// Do something with Facebook profile data
			// OR you have subscribed to auth state change, authStateChange handler will process the profile data
			
			return Promise.resolve({type: 'success'});
		  }
		  case 'cancel': {
			return Promise.reject({type: 'cancel'});
		  }
		}
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
				navigation.navigate("Dashboard");
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

	function onLogin() {
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				navigation.navigate("Dashboard");
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

			<ScrollView showsHorizontalScrollIndicator={false}>
				{/* <View style={{ flexDirection: "row" }}>
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
				</View> */}

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

				<Text onPress={() => navigation.navigate("Register")}>
					Tu n'as pas de compte? Inscris toi!
				</Text>
				<LineBreak />
			</ScrollView>
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
