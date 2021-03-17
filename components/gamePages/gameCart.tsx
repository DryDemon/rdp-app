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

import { ENVIRONEMENT } from "../../constants/Environement";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../../constants/Server";
import { GameSchema } from "../../src/interaces/interfacesGame";
import { validURL } from "../../src/smallFuncts";

export default function GameCart(props: any) {
	const { jwt, user, joinCode, game, logoUrl, ...otherProps } = props;

	const [bets, setBets] = useState<Array<object>>([]);

	function loadCart() {
		AsyncStorage.getItem("@cart").then((input) => {
			let cart: any = [];
			if (input) cart = JSON.parse(input);
			console.log(cart)
			setBets(cart);
		});
	}
	useEffect(() => {
		loadCart();
	}, []);

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>Panier</TextSubTitle>
			<TextSubTitle style={styles.titleGame}>Panier</TextSubTitle>
			<View style={styles.textToMiddle}>
				{game ? <TextTitle>{game?.name}</TextTitle> : undefined}
				<Button title={"reload"} onPress={loadCart} />
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
});
