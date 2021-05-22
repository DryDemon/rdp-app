import React from "react";
import {
	View,
	Text,
	TextTitle,
	SubText,
	TextInput,
	SmallLineBreak,
	Button,
	GameScrollView,
} from "./Themed";
import {
	Alert,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import Colors from "../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { BonusInterface, GameSchema } from "../src/interaces/interfacesGame";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SERVER_API_URL } from "../constants/Server";
import { ENVIRONEMENT } from "../constants/Environement";

export function addMinutesToDate(date: Date, minutes: number) {
	date.setTime(date.getTime() + minutes * 60 * 1000);
	return date;
}

function getPossibleShieldActionsBonus(game: GameSchema, userId: string) {
	let canUserRevertQuoteDivided = false;
	let canUserRevertSteal = false;
	let canUserRevertBonusCancel = false;

	//can user revert steal?
	if (
		game &&
		process.env.CAN_REVERT_STOLEN_CREDITS_ACTION_MAX_MINUTES &&
		process.env.CAN_REVERT_QUOTE_DIVIDED_ACTION_MAX_MINUTES &&
		process.env.CAN_REVERT_BONUS_CANCELED_ACTION_MAX_MINUTES &&
		game.userStats &&
		game.betList
	) {
		for (let userStat of game.userStats) {
			if (userStat.userId == userId) {
				if (
					userStat.stolenDate &&
					userStat.stolenDate >
						addMinutesToDate(
							new Date(),
							-process.env
								.CAN_REVERT_STOLEN_CREDITS_ACTION_MAX_MINUTES
						) &&
					userStat.creditsStolen &&
					userStat.stolenFrom
				) {
					canUserRevertSteal = true;
				}
			}
		}

		//revert Canceled Bonus
		for (let userStat of game.userStats) {
			if (userStat.userId == userId) {
				if (
					userStat.bonusCanceledDate &&
					userStat.bonusCanceledDate >
						addMinutesToDate(
							new Date(),
							-process.env
								.CAN_REVERT_BONUS_CANCELED_ACTION_MAX_MINUTES
						) &&
					userStat.bonusIdCanceled
				) {
					canUserRevertBonusCancel = true;
				}
			}
		}

		//revert quote divisée
		for (let bet of game.betList) {
			if (
				bet.userId == userId &&
				bet.quoteBoostFrom &&
				bet.quoteBoostFrom >
					addMinutesToDate(
						new Date(),
						-process.env.CAN_REVERT_QUOTE_DIVIDED_ACTION_MAX_MINUTES
					) &&
				bet.quoteBoost
			) {
				let canUserRevertQuoteDivided = true;
			}
		}
	}

	return [
		canUserRevertSteal,
		canUserRevertQuoteDivided,
		canUserRevertBonusCancel,
	];
}

function getBonusNameFromType(bonus: BonusInterface) {
	switch (bonus.typeBonus) {
		case 0: //pas de bonus
			return "Tu t'es fait niqué";
		case 1: // multiplier la cote d'un pari
			return (
				"Multiplier la côte d'un de tes paris par " + bonus.multiplier
			);
		case 2: // enlever des crédits à un adversaire
			return "Voler " + bonus.creditBonus + " Crédits a ton adversaire";
		case 3: // se rajouter des crédits, pas utilisé
			return "Voler " + bonus.creditBonus + " Crédits a ton adversaire";
		case 4: // annuler le pari d'un adversaire
			return "Annuler le pari d'un adversaire";

		case 5: // supprimer un bonus à un adversaire
			return "Supprimer un bonus d'un de tes adversaires";
		case 6: // diviser la cote du pari d'un adversaire
			return "Diviser la côté d'un pari adverse par " + bonus.multiplier;
		case 7: // bouclier
			return "Se protèger d'un bonus t'attaquant";
	}
	return "";
}

export async function sendUseBonusQuery(
	joinCode: string,
	jwt: string,
	bonusType: number,
	betId?: string,
	bouclierAction?: number
) {
	let query = `joinCode=${joinCode}&jwt=${jwt}&bonusType=${bonusType}`;
	if (betId) query += `&betId=${betId}`;
	if (bouclierAction) query += `&bouclierAction=${bouclierAction}`;
	if (joinCode && jwt && bonusType) {
		const rawRep = await fetch(SERVER_API_URL + `/usebonus?${query}`);
		const rep = await rawRep.json();
		return rep.success;
	}

	return undefined;
}

export function ShowBonus(props: any) {
	let {
		joinCode,
		reloadGame,
		game,
		toggleShowBonus,
		user,
		jwt,
		setPage,
		...otherProps
	} = props;

	let userBonus: BonusInterface[] | undefined = game?.bonusList.filter(
		(bonus: BonusInterface) => bonus.ownerUserId == user._id
	);

	const [
		canUserRevertSteal,
		canUserRevertQuoteDivided,
		canUserRevertBonusCancel,
	] = getPossibleShieldActionsBonus(game, user._id);

	async function activateBonus(bonusType: number) {
		let rep = 0;
		switch (bonusType) {
			case 0: //pas de bonus
				break;

			//on change de page, on ne le gère pas ici
			case 1: // multiplier la cote d'un pari
				//goto cart
				setPage("gameCart");
				toggleShowBonus();
				break;
			case 4: // annuler le pari d'un adversaire
				//goto list bets
				setPage("gameListBets");
				toggleShowBonus();
				break;
			case 6: // diviser la cote du pari d'un adversaire
				//goto list bets
				setPage("gameListBets");
				toggleShowBonus();
				break;

			//choses qu'on gère ici
			case 2: // enlever des crédits à un adversaire
			case 3: // se rajouter des crédits, pas utilisé
				rep = await sendUseBonusQuery(joinCode, jwt, bonusType);
				break;
			case 5: // supprimer un bonus à un adversaire aleatoirement
				rep = await sendUseBonusQuery(joinCode, jwt, bonusType);
				break;

			//cas particulier
			//faire un get actions pou rle bouclier
			case 7: // bouclier
				if (ENVIRONEMENT == "dev")
					alert("bug, used case 7 of bonus but is not possible to");
				//voir fonction activate shield, inutilisé ici
				break;
		}
		if (rep == 1) {
			//bonus activated
			//reload game?
			//TODO
		}
	}
	function activateShield(action: number) {}

	function renderShieldButtons(data: BonusInterface) {
		return (
			<View>
				{canUserRevertSteal ? (
					<Button
						title={"Reprendre ses sous volés"}
						onPress={() => activateShield(0)}
					/>
				) : null}
				{canUserRevertQuoteDivided ? (
					<Button
						title={"Annuler la division de côté"}
						onPress={() => activateShield(1)}
					/>
				) : null}
				{canUserRevertBonusCancel ? (
					<Button
						title={"Reprendre mon bonus annulé"}
						onPress={() => activateShield(2)}
					/>
				) : null}
			</View>
		);
	}

	function renderBonus(data: BonusInterface) {
		return (
			<View style={styles.bonusContainer}>
				<Text>{getBonusNameFromType(data)}</Text>
				{!data.isUsed ? (
					<View style={styles.activateButtonContainer}>
						{data.typeBonus == 7 ? (
							renderShieldButtons(data)
						) : data.typeBonus != 0 ? (
							<Button
								title={"Activer"}
								onPress={() => activateBonus(data.typeBonus)}
							/>
						) : null}
					</View>
				) : (
					<View style={styles.activateButtonContainer}>
						<Text>Bonus Utilisé</Text>
					</View>
				)}
			</View>
		);
	}

	return (
		<View>
			<SmallLineBreak />
			<View style={styles.titleContainer}>
				<TextTitle>Bonus</TextTitle>
				<TouchableOpacity
					style={styles.closeComponent}
					onPress={toggleShowBonus}
				>
					<AntDesign name="close" size={20} color={"#000"} />
				</TouchableOpacity>
			</View>
			<SmallLineBreak />
			{userBonus
				? userBonus.map((data: BonusInterface) => renderBonus(data))
				: null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "85%",
		padding: 24,
		margin: 24,
		position: "absolute",
		backgroundColor: "white",
		borderRadius: 12,
	},
	closeComponent: { marginLeft: "auto", alignSelf: "flex-end" },
	titleContainer: { flexDirection: "row", alignItems: "center" },
	title: {
		fontWeight: "500",
		fontSize: 22,
	},
	bonusContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		minHeight: 72,
		backgroundColor: Colors.revertRdpColor,
		borderRadius: 12,
	},
	activateButtonContainer: { marginLeft: "auto", alignSelf: "flex-end" },
});
