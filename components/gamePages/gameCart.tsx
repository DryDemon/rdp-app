import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import {
	Alert,
	StyleSheet,
	Image,
	Share,
	TouchableOpacity,
} from "react-native";

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
	SmallLineBreak,
	TextSubTitle,
	SubText,
	GameScrollView,
} from "../../components/Themed";
import Colors from "../../constants/Colors";

import { ENVIRONEMENT } from "../../constants/Environement";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../../constants/Server";
import { GameSchema } from "../../src/interaces/interfacesGame";
import { validURL } from "../../src/smallFuncts";

export default function GameCart(props: any) {
	const { jwt, user, joinCode, game, logoUrl, ...otherProps } = props;

	const [bets, setBets] = useState<Array<object>>([]);
	const [type, setType] = useState<"simple" | "combiné" | "système">(
		"simple"
	);

	function loadCart() {
		AsyncStorage.getItem("@cart").then((input) => {
			let cart: any = [];
			if (input) cart = JSON.parse(input);
			console.log(cart);
			setBets(cart);
		});
	}
	useEffect(() => {
		loadCart();
	}, []);

	function changeType(type: any) {
		setType(type);
		//TODO
	}

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>Panier</TextSubTitle>
			
			<LineBreak/>

			<View style={{ flexDirection: "row" }}>
				<TouchableOpacity
					onPress={() => changeType("simple")}
					style={
						type == "simple"
							? styles.betChoiceButtonTouched
							: styles.betChoiceButtonUntouched
					}
				>
					<Text style={type == "simple"? {color:"white"}:undefined}>Simple </Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => changeType("combiné")}
					style={
						type == "combiné"
							? styles.betChoiceButtonTouched
							: styles.betChoiceButtonUntouched
					}
				>
					<Text style={type == "combiné"? {color:"white"}:undefined}>Combiné</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => changeType("système")}
					style={
						type == "système"
							? styles.betChoiceButtonTouched
							: styles.betChoiceButtonUntouched
					}
				>
					<Text style={type == "système"? {color:"white"}:undefined}>Système</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.textToMiddle}>
				{bets
					? bets.map((value: any) => (
							<View>
								<Text>{value.betId}</Text>
								<Text>{value.matchId}</Text>
							</View>
					  ))
					: undefined}

				<SmallLineBreak />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	titleGame: {
		fontSize: 22,
		fontWeight: "500",
	},
	textToMiddle: {
		alignItems: "center",
	},
	betChoiceButtonTouched: {
		flex: 1,
		fontSize:12,
		borderRadius: 12,
		backgroundColor: Colors.rdpColor,
		minWidth: "auto",
		paddingHorizontal: 16,
		paddingVertical: 6,
		color: "white",
	},
	betChoiceButtonUntouched: {
		flex: 1,
		fontSize:12,
		borderRadius: 12,
		minWidth: "auto",
		paddingHorizontal: 16,
		paddingVertical: 6,
	},
});
