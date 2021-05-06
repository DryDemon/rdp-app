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
	userStatsInterface,
} from "../../src/interaces/interfacesGame";
import { validURL } from "../../src/smallFuncts";

export default function GamePlayerStats(props: any) {
	const { user, game, userIdSelectedShowStats, ...otherProps } = props;

	const [userSelected, setUserSelected] = useState<
		userStatsInterface | undefined
	>(user);
	const [isCurrentUser, setIsCurrentUser] = useState<boolean>(true);

	useEffect(() => {
		if (user && game) {
			if (userIdSelectedShowStats == user._id) {
				setIsCurrentUser(true);
			} else {
				setIsCurrentUser(false);
			}
			setUserSelected(
				game.userStats.find(
					(userSearch: userStatsInterface) =>
						userSearch.userId == userIdSelectedShowStats
				)
			);
		}
	}, [user, userIdSelectedShowStats]);

	if (userSelected) {

		let betWithBiggestQuoteValidated = game.betList
			.filter((value: userBetInterface) => {
				return (
					value.status == 1 && value.userId == userIdSelectedShowStats
				);
			}) //filter to only sort by winning bets
			.sort((value: userBetInterface, secondValue: userBetInterface) => {
				if (value.mainQuote && secondValue.mainQuote)
					return value.mainQuote - secondValue.mainQuote;
				else return 0;
			})?.[0];
		let biggestQuoteValidated = 0;

		if (betWithBiggestQuoteValidated) {
			biggestQuoteValidated = betWithBiggestQuoteValidated.mainQuote.toFixed(
				2
			);
		}

		return (
			<View>
				<SmallLineBreak />
				<TextSubTitle style={styles.titleGame}>
					{isCurrentUser
						? "Mes statistiques de jeu"
						: "Statistiques de jeu de " + userSelected.username}
				</TextSubTitle>
				<LineBreak />
				<View style={styles.textToMiddle}>
					<Text style={styles.subTitle}>{userSelected.username}</Text>

					<SmallLineBreak />
				</View>

				<Text style={styles.subTitleNoCenter}>Crédits</Text>
				<SmallLineBreak />
				<View style={styles.boxContainer}>
					<View
						style={styles.subBoxTitleAndValueContainerWhenTwoBoxes}
					>
						<Text style={styles.subBoxTitle}>Total de crédits</Text>
						<View style={styles.subBoxValueContainerBlue}>
							<Text style={styles.subBoxText}>
								{userSelected.credits?.toFixed(2)}
							</Text>
						</View>
					</View>
					<View
						style={styles.subBoxTitleAndValueContainerWhenTwoBoxes}
					>
						<Text style={styles.subBoxTitle}>
							Total des crédits potentiels
						</Text>
						<View style={styles.subBoxValueContainerBlue}>
							<Text style={styles.subBoxText}>
								{(
									userSelected.credits +
									game.betList.reduce(
										(
											accumulateur: number,
											currValue: userBetInterface
										) => {
											//pour tout les paris, si le paris est au joueur, alors on ajoute les paris a la liste des paris combinés
											if (
												currValue.userId ==
													userSelected.userId &&
												currValue.mainQuote &&
												currValue.credits &&
												currValue.status == 0
											) {
												return (
													accumulateur +
													currValue.mainQuote *
														currValue.credits
												);
											} else return accumulateur;
										},
										0
									)
								).toFixed(2)}
							</Text>
						</View>
					</View>
				</View>

				<LineBreak />
				<Text style={styles.subTitleNoCenter}>Les paris</Text>
				<SmallLineBreak />
				<View style={styles.boxContainer}>
					<View style={styles.subBoxTitleAndValueContainerWhenAlone}>
						<Text style={styles.subBoxTitle}>
							Nombre de paris placés
						</Text>
						<View style={styles.subBoxValueContainerBlue}>
							<Text style={styles.subBoxText}>
								{game.betList.reduce(
									(
										accumulateur: number,
										currValue: userBetInterface
									) => {
										//pour tout les paris, si le paris est au joueur, alors on le compte
										if (
											currValue.userId ==
											userSelected.userId
										) {
											return accumulateur + 1;
										} else return accumulateur;
									},
									0
								)}
							</Text>
						</View>
					</View>
				</View>

				<SmallLineBreak />
				<View style={styles.boxContainer}>
					<View
						style={styles.subBoxTitleAndValueContainerWhenTwoBoxes}
					>
						<Text style={styles.subBoxTitle}>
							% de paris réussis
						</Text>
						<View style={styles.subBoxValueContainerBlue}>
							<Text style={styles.subBoxText}>
								{(
									(game.betList.reduce(
										(
											accumulateur: number,
											currValue: userBetInterface
										) => {
											//pour tout les paris, si le paris est au joueur, alors on ajoute les paris a la liste des paris combinés
											if (
												currValue.userId ==
													userSelected.userId &&
												currValue.status == 1
											) {
												return accumulateur + 1;
											} else return accumulateur;
										},
										0
									) /
										game.betList.reduce(
											(
												accumulateur: number,
												currValue: userBetInterface
											) => {
												//pour tout les paris, si le paris est au joueur, alors on ajoute les paris a la liste des paris combinés
												if (
													currValue.userId ==
														userSelected.userId &&
													(currValue.status == 2 ||
														currValue.status == 1)
												) {
													return accumulateur + 1;
												} else return accumulateur;
											},
											0
										)) *
									100
								).toFixed(0) + " %"}
							</Text>
						</View>
					</View>
					<View
						style={styles.subBoxTitleAndValueContainerWhenTwoBoxes}
					>
						<Text style={styles.subBoxTitle}>Paris en cours</Text>
						<View style={styles.subBoxValueContainerBlue}>
							<Text style={styles.subBoxText}>
								{game.betList.reduce(
									(
										accumulateur: number,
										currValue: userBetInterface
									) => {
										//pour tout les paris, si le paris est au joueur, alors on ajoute les paris a la liste des paris combinés
										if (
											currValue.userId ==
												userSelected.userId &&
											currValue.status == 0
										) {
											return accumulateur + 1;
										} else return accumulateur;
									},
									0
								)}
							</Text>
						</View>
					</View>
				</View>

				<SmallLineBreak />
				<View style={styles.boxContainer}>
					<View
						style={styles.subBoxTitleAndValueContainerWhenTwoBoxes}
					>
						<Text style={styles.subBoxTitle}>
							Plus gros gains remportés
						</Text>
						<View style={styles.subBoxValueContainerBlue}>
							<Text style={styles.subBoxText}>
								{game.betList
									.filter((value: userBetInterface) => {
										return (
											value.status == 1 &&
											value.userId ==
												userIdSelectedShowStats
										);
									}) //filter to only sort by winning bets
									.sort(
										(
											value: userBetInterface,
											secondValue: userBetInterface
										) => {
											if (
												value.mainQuote &&
												secondValue.mainQuote &&
												value.credits &&
												secondValue.credits
											)
												return (
													secondValue.mainQuote *
														secondValue.credits -
													value.mainQuote *
														value.credits
												);
											else return 0;
										}
									)
									.map((value: userBetInterface) => {
										if (value.credits && value.mainQuote)
											return (
												value.credits * value.mainQuote
											);
										else return 0;
									})?.[0] || "0"}
							</Text>
						</View>
					</View>
					<View
						style={styles.subBoxTitleAndValueContainerWhenTwoBoxes}
					>
						<Text style={styles.subBoxTitle}>
							Plus grosse côte validée
						</Text>
						<View style={styles.subBoxValueContainerBlue}>
							<Text style={styles.subBoxText}>
								{biggestQuoteValidated}
							</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}
	return <View></View>;
}

const styles = StyleSheet.create({
	titleGame: {
		fontSize: 22,
		fontWeight: "500",
	},
	textToMiddle: {
		alignItems: "center",
	},
	subTitle: {
		fontWeight: "500",
		fontSize: 17,
		textAlign: "center",
	},
	subTitleNoCenter: {
		fontWeight: "500",
		fontSize: 17,
	},
	boxContainer: {
		flexDirection: "row",
		// justifyContent: "space-between",
		alignItems: "center",
		padding: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#b8b8b8",
		backgroundColor: "white",
	},
	subBoxTitleAndValueContainerWhenTwoBoxes: {
		// flex: 1,
		margin: "2.5%",
		minWidth: "45%",
	},
	subBoxTitleAndValueContainerWhenAlone: {
		flex: 1,
	},
	subBoxTitle: {
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 16,

		color: Colors.gray,
	},
	subBoxValueContainerBlue: {
		justifyContent: "center",
		alignItems: "center",
		padding: 24,

		backgroundColor: Colors.blue,
		borderRadius: 12,
	},
	subBoxValueContainerRed: {
		justifyContent: "center",
		alignItems: "center",
		padding: 24,

		backgroundColor: Colors.lightRed,
		borderRadius: 12,
	},
	subBoxText: {
		fontWeight: "bold",
		fontSize: 17,
	},
});
