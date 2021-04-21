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
import {
	GameSchema,
	userStatsInterface,
} from "../../src/interaces/interfacesGame";
import { validURL } from "../../src/smallFuncts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../constants/Colors";

export default function GameClassement(props: any) {
	const {
		jwt,
		user,
		joinCode,
		game,
		logoUrl,
		reloadGame,
		...otherProps
	} = props;

	const [userList, setuserList] = useState<userStatsInterface[]>([]);

	//sort the use list by credist at each load
	useEffect(() => {
		if (game?.userStats) {
			const sorted = [...game?.userStats].sort(
				(a: userStatsInterface, b: userStatsInterface) => {
					if (a.credits != undefined && b.credits != undefined) {
						if (a.credits < b.credits) return 1;
						if (a.credits > b.credits) return -1;
					}

					return 0;
				}
			);
			setuserList(sorted);
		}
	}, [game]);

	return (
		<View>
			<TextSubTitle style={styles.titleGame}>Classement</TextSubTitle>
			<View style={styles.textToMiddle}>
				<View style={{ flexDirection: "row" }}>
					{userList.length > 1 ? (
						<View style={styles.mainClassementContainer}>
							<View style={styles.separator}></View>
							<Text>2</Text>
							<MaterialCommunityIcons
								name="crown"
								size={20}
								color={"#000"}
							/>

							<Text style={styles.mainClassementUsername}>
								{userList[1].username}
							</Text>
							<Text style={styles.mainClassementCredits}>
								{userList[1].credits}
							</Text>
						</View>
					) : null}
					{userList.length > 0 ? (
						<View style={styles.mainClassementContainer}>
							<Text>1</Text>
							<MaterialCommunityIcons
								name="crown"
								size={20}
								color={"#000"}
							/>

							<Text style={styles.mainClassementUsername}>
								{userList[0].username}
							</Text>
							<Text style={styles.mainClassementCredits}>
								{userList[0].credits}
							</Text>
						</View>
					) : null}
					{userList.length > 2 ? (
						<View style={styles.mainClassementContainer}>
							<View style={styles.separator}></View>
							<Text>3</Text>
							<MaterialCommunityIcons
								name="crown"
								size={20}
								color={"#000"}
							/>

							<Text style={styles.mainClassementUsername}>
								{userList[2].username}
							</Text>
							<Text style={styles.mainClassementCredits}>
								{userList[2].credits}
							</Text>
						</View>
					) : null}
				</View>
				{userList.map((user: userStatsInterface, index: number) => {
					if (index > 2)
						return (
							<View style={styles.subClassement}>
								<Text style={styles.subClassementUsername}>
									{index + 1 + " : " + user.username}
								</Text>
								<Text style={styles.subClassementCredits}>
									{user.credits}
								</Text>
							</View>
						);
					return null;
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	titleGame: {
		fontSize: 22,
		fontWeight: "500",
		marginVertical: 24,
	},
	textToMiddle: {
		alignItems: "center",
	},
	mainClassementContainer: {
		flex: 1,
		margin: 10,
		alignItems: "center",
	},
	mainClassementUsername: {
		fontSize: 14,
		fontWeight: "500",
	},
	mainClassementCredits: {
		fontWeight: "700",
		fontSize: 16,
		color: Colors.rdpColor,
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	subClassementUsername: {
		fontSize: 15,
		fontWeight: "500",
	},
	subClassement: {
		width: "100%",
		flexDirection: "row",
		backgroundColor: "white",
		borderRadius: 12,
		padding: 24,
		margin: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,
		elevation: 4,
	},
	subClassementCredits: {
		fontWeight: "700",
		fontSize: 15,
		color: Colors.rdpColor,

		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
	},
	marginTop: {
		marginTop: 48,
	},
});
