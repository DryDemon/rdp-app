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
import {
	GameSchema,
	userBetInterface,
} from "../../src/interaces/interfacesGame";
import { validURL } from "../../src/smallFuncts";
import { PlayerBet } from "../playerBet";

export default function GameListBets(props: any) {
	const {
		jwt,
		user,
		joinCode,
		game,
		logoUrl,
		reloadGame,
		canShowBonus,
		...otherProps
	} = props;

	const [myBets, setMyBets] = useState(false);
	const [filter, setFilter] = useState<
		"En cours" | "Gagnés" | "Perdus" | "Terminés"
	>("En cours");

	const [betsToDisplay, setBetsToDisplay] = useState<userBetInterface[]>([]);

	//update filter
	useEffect(() => {
		let toDisplay: userBetInterface[] = [];

		let bets = game?.betList;
		if (bets) {
			for (let bet of bets) {
				let okay = true;

				if (myBets && bet.userId != user._id) {
					//mes paris seulement et c'est un pari de qql d'autre
					okay = false;
				}
				switch (filter) {
					case "En cours":
						if (bet.status != 0) okay = false;
						break;
					case "Gagnés":
						if (bet.status != 1) okay = false;
						break;
					case "Perdus":
						if (bet.status != 2) okay = false;
						break;
					case "Terminés":
						if (bet.status == 0) okay = false;
						break;
				}

				if (okay) toDisplay.push(bet);
			}
		}

		setBetsToDisplay(toDisplay);
	}, [myBets, filter, game]);

	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>Les Paris</TextSubTitle>

			<View style={{ flexDirection: "row", marginVertical: 12 }}>
				<TouchableOpacity onPress={() => setMyBets(true)}>
					<Text
						style={
							myBets
								? styles.choiceMyBetsSelected
								: styles.choiceMyBetsNotSelected
						}
					>
						Mes Paris
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setMyBets(false)}>
					<Text
						style={
							!myBets
								? styles.choiceMyBetsSelected
								: styles.choiceMyBetsNotSelected
						}
					>
						Tous
					</Text>
				</TouchableOpacity>
			</View>
			{/* Filter menu */}
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					marginVertical: 12,
				}}
			>
				{["En cours", "Gagnés", "Perdus", "Terminés"].map(
					(value: any) => (
						<TouchableOpacity
							key={value}
							onPress={() => {
								setFilter(value);
							}}
							style={
								filter == value
									? styles.betChoiceButtonTouched
									: styles.betChoiceButtonUntouched
							}
						>
							<Text
								style={
									filter == value
										? { color: "white", fontSize: 14, textAlign:"center" }
										: { fontSize: 14, textAlign:"center" }
								}
							>
								{value}
							</Text>
						</TouchableOpacity>
					)
				)}
			</View>

			<View style={styles.textToMiddle}>
				{betsToDisplay.reverse().map((bet: userBetInterface) => (
					<PlayerBet
						canShowBonus={!game?.isPublic}
						game={game}
						reloadGame={reloadGame}
						jwt={jwt}
						user={user}
						key={bet._id}
						bet={bet}
					/>
				))}
				<SmallLineBreak />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	titleGame: {
		fontSize: 22,
		fontWeight: "500",
		marginBottom: 24,
	},
	textToMiddle: {
		marginTop: 6,
	},
	choiceMyBetsSelected: {
		fontWeight: "400",
		fontSize: 16,
		color: "black",
		marginRight: 24,
	},
	choiceMyBetsNotSelected: {
		fontWeight: "400",
		fontSize: 16,
		color: "gray",
		marginRight: 24,
	},
	betChoiceButtonTouched: {
		flexShrink: 1,
		flexWrap: "wrap",
		justifyContent: "center",
		flex: 1,
		fontSize: 12,
		borderRadius: 12,
		textAlign: "center",
		backgroundColor: Colors.rdpColor,
		minWidth: "auto",
		paddingHorizontal: 8,
		paddingVertical: 8,
		color: "white",
	},
	betChoiceButtonUntouched: {
		flexShrink: 1,
		flexWrap: "wrap",
		justifyContent: "center",
		flex: 1,
		fontSize: 12,
		borderRadius: 12,
		minWidth: "auto",
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
});
