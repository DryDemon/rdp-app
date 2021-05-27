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
	ValidedButton,
} from "../components/Themed";
import { SERVER_API_URL } from "../constants/Server";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { User } from "../src/interaces/interfacesUsers";
import Colors from "../constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Login({ navigation, route: { params } }: any) {
	const [password, setPassword] = useState("");
	const [emailUsername, setEmailUsername] = useState("");

	const [alertEmailUsername, setAlertEmailUsername] = useState(" ");
	const [alertPassword, setAlertPassword] = useState(" ");

	const [user, setUser] = useState<User>({});
	// //DELETE VARS
	// AsyncStorage.removeItem("@jwt")
	// AsyncStorage.removeItem("@user")

	function gotoForgotPassword(){
		navigation.navigate("ForgotPasswordFirstScreen");
	}

	async function sendDataLoginUser(userauth: string, password: string) {
		const rawRep = await fetch(
			SERVER_API_URL +
				`/userauth?emailOrUsername=${emailUsername}&password=${password}`
		);
		const rep = await rawRep.json();
		if (rep.isConnected == 1) {
			try {
				await AsyncStorage.setItem("@jwt", rep.jwt);
				await AsyncStorage.setItem("@user", JSON.stringify(rep.user));
				navigation.navigate("Dashboard");
			} catch (e) {
				alert(e);
			}
		} else {
			switch (rep.error) {
				case "WRONG_PASSWORD":
					setAlertPassword("Mauvais mot de passe");
					break;
				case "WRONG_USER":
					setAlertEmailUsername(
						"Tu as rentré un mauvais pseudo ou email"
					);
					break;
			}
		}
	}

	//redirect ifconnected
	useEffect(() => {
		AsyncStorage.getItem("@jwt").then((value: string | null) => {
			if (value) {
				let jwt = value;
				AsyncStorage.getItem("@user").then((value: string | null) => {
					if (value) {
						setUser(JSON.parse(value));
						if (jwt && user) {
							navigation.navigate("Dashboard");
						}
					}
				});
			}
		});

		AsyncStorage.getItem("@user").then((value: string | null) => {
			if (value) {
				setUser(JSON.parse(value));
			}
		});
	}, []);

	function onLogin() {
		if (emailUsername && password) {
			sendDataLoginUser(emailUsername, password);
		}
	}

	//set email is user was connected
	useEffect(() => {
		if (user && user.username) setEmailUsername(user.username);
	}, [user]);
	return (
		<ViewContainer>
			<BasicScrollView>
				<LineBreak />
				<TextTitle style={styles.topTitle}>
					Bon retour parmi nous,
				</TextTitle>
				{user?.username ? (
					<TextMainTitle>Roi {user?.username}!</TextMainTitle>
				) : null}
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

				<TextLabel>Email ou Pseudo</TextLabel>
				<TextInput
					value={emailUsername}
					keyboardType={"email-address"}
					onChangeText={(emailUsername: string) => {
						setEmailUsername(emailUsername);
					}}
					placeholder={"exemple@mail.com"}
				/>
				<TextWarning>{alertEmailUsername}</TextWarning>

				<TextLabel>Mot De Passe</TextLabel>
				<TextInput
					value={password}
					onChangeText={(password: string) => {
						setPassword(password);
					}}
					placeholder={"8 lettres minimum, une majuscule"}
					secureTextEntry={true}
				/>
				<TextWarning>{alertPassword}</TextWarning>
				{/* <TouchableOpacity onPress={() => {gotoForgotPassword()}} style={styles.forgotPasswordContainer}> */}
					<Text style={styles.forgotPasswordText} onPress={() => gotoForgotPassword()}>
						Mot de passe oublié?
					</Text>
				{/* </TouchableOpacity>	 */}
				<LineBreak />
				<ValidedButton title={"Me Connecter"} onPress={onLogin} />
				<LineBreak />
				<View style={styles.felxRow}>
					<Text
						style={styles.subCta}
						onPress={() => navigation.navigate("Register")}
					>
						Pas encore de compte Roi du Prono? 
					</Text>
					<Text
						style={[styles.link, styles.subCta]}
						onPress={() => navigation.navigate("Register")}
					>
						Inscris-toi ici ! 
					</Text>
				</View>
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
	link: {
		color: Colors.link,
		fontWeight: "bold",
		marginLeft: 4,
	},
	felxRow: {
		flexDirection: "row",
		justifyContent: "center",
	},
	subCta: {
		fontSize: 12,
	},
	forgotPasswordContainer: {
		alignItems: 'flex-end',
	},
	forgotPasswordText: {
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 16,
		textAlign: 'right',
		alignItems: "center",

		/* Black / 100 */
		color: "#414141",
	},
});
