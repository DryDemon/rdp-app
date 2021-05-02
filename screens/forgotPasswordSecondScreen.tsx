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

export default function ForgotPasswordSecondScreen({ navigation }: any) {
	const [token, setToken] = useState("")
	
	function gotoForgotPasswordThirdPage() {
		navigation.navigate("ForgotPasswordThirdScreen");
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
				<SubText>
					Rentre ici le code que tu as reçu par message
				</SubText>
				<SmallLineBreak/>
				<TextLabel>Code</TextLabel>
				<TextInput
					value={token}
					onChangeText={(token: string) => {
						setToken(token);
					}}
					placeholder={""}
				/>

				<Button
					title={"Continuer"}
					onPress={gotoForgotPasswordThirdPage}
				/>

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
