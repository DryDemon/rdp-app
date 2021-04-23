import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useEffect, useState } from "react";
import { View, Text } from "./Themed";

import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import { CONST_BASE_MISE_PARI, ENVIRONEMENT } from "../constants/Environement";

function isEmptyObject(obj: any) {
	if (obj) {
		return !Object.keys(obj).length;
	}
	return false;
}

export default function BasicBet(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const odd = props.odd;
	const joinCode = props.joinCode;

	const [betChoiceListGameHandler ,  setBetChoiceListGameHandler] = props.betChoiceListGroup;
	const [selected, setSelected] = useState(false);

	async function isBetIdInCart(matchId: string, betId: string) {
		return betChoiceListGameHandler.some((value: any) => value.betId == betId && value.matchId == matchId);
	}

	useEffect(() => {
		if (odd && props.matchId)
			isBetIdInCart(props.matchId, odd.id).then((isBetHere: boolean) => {
				if (isBetHere) setSelected(true);
				else setSelected(false);
			});
	}, [odd, props.matchId]);

	function onBet() {
		if (!selected) {
			setSelected(true);
			let betChoiceListGameHandlerCpy = betChoiceListGameHandler.slice();
			betChoiceListGameHandlerCpy.push({
				matchId: props.matchId,
				betId: odd.id,
				mise: CONST_BASE_MISE_PARI,
				isBase: false,
				isLive: props.isLive,
			})
			setBetChoiceListGameHandler(betChoiceListGameHandlerCpy)
		} else {
			setSelected(false);
			setBetChoiceListGameHandler(betChoiceListGameHandler.filter((value: any) => !(value.betId == 	odd.id && value.matchId == props.matchId)))
		}
	}

	// useEffect(() => {
	// 	if (ENVIRONEMENT == "dev" && props.plus && props.plus == 424) {
	// 		showMore();
	// 	}
	// }, [props.plus]);


	function showMore() {
		if (callbackShowMatchBet)
			callbackShowMatchBet();
	}
	
		
	
	if (odd) {
		return (
			
			<TouchableOpacity onPress={onBet}>
				<View
					key={odd.id}
					style={
						!selected
							? styles.betContainer
							: styles.betContainerSelected
					}
				>
					<Text>{odd.header  && odd.name != odd.header? odd.header + " " : ""}</Text>
					<View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
						<View>
							<Text style={
									!selected ? styles.name : styles.nameSelected
								}
							>
								{odd.name != "Draw" ? odd.name : "N"}
							</Text>
						</View>
						<View>
							<Text
								style={
									!selected ? styles.odd : styles.oddSelected
								}
							>
								{(+odd.odds).toFixed(2)}
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	} else if (props.plus) {
		return (
			<TouchableOpacity onPress={showMore}>
				<View style={[styles.betContainer, styles.betContainerShowMore]}>
					<Text style={styles.odd}>+{props.plus}</Text>
				</View>
			</TouchableOpacity>
		);
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	betContainer: {
		justifyContent: "space-between",
		alignItems: "center",
		width:77,
		padding:14,
		backgroundColor: Colors.blue,
		borderRadius: 12,
	},
	betContainerShowMore: {
		width: 48
	},
	betContainerSelected: {
		justifyContent: "space-between",
		alignItems: "center",
		width:77,
		padding:14,
		backgroundColor: Colors.rdpColor,
		borderRadius: 12,
	},
	name: {
		fontSize: 16,
		color: Colors.grayPlaceHolder,
	},
	nameSelected: {
		fontSize: 16,
		color: Colors.grayWhite,
	},
	
	odd: {
		color: Colors.black,
		fontSize: 16,
	},
	oddSelected: {
		color: "white",
		fontSize: 16,
	},
});
