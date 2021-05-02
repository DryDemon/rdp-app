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

export default function ForgotPasswordThirdScreen({ navigation }: any) {
	const [mdp, setMdp] = useState("");
	const [mdpVerif, setMdpVerif] = useState("");
	const [alertMdp, setAlertMdp] = useState(" ");
	const [alertMdpVerif, setAlertMdpVerif] = useState(" ");

	function gotoLogin() {
		navigation.navigate("Login");
	}

	return (
		<ViewContainer>
			<MainHeader
				back={"ForgotPasswordSecondScreen"}
				navigation={navigation}
			/>
			<BasicScrollView>
				<LineBreak />
				<TextTitle style={styles.topTitle}>
					Mot de passe oublié ?
				</TextTitle>
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
				/>
				<TextWarning>{alertMdp}</TextWarning>
				<LineBreak />
				<TextLabel>Confirmation de mot de passe</TextLabel>
				<TextInput
					value={mdp}
					onChangeText={(mdpEntry: string) => {
						setMdpVerif(mdpEntry);
					}}
					placeholder={""}
				/>
				<TextWarning>{alertMdpVerif}</TextWarning>

				<Button title={"Continuer"} onPress={gotoLogin} />

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
