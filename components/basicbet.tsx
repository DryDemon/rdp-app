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
	const reloadCart = props.reloadCart;
	const joinCode = props.joinCode;
	const setReloadCart = props.setReloadCart;

	const [selected, setSelected] = useState(false);

	async function isBetIdInCart(matchId: string, betId: string) {
		let input = await AsyncStorage.getItem("@cart_" + joinCode);
		if (input) {
			let cart = JSON.parse(input);
			if (cart)
				for (let cartElem of cart) {
					if (
						cartElem.matchId == matchId &&
						cartElem.betId == betId
					) {
						if (ENVIRONEMENT == "dev") {
							console.log(cart, cartElem);
						}
						return true;
					}
				}
		}
		return false;
	}

	useEffect(() => {
		if (odd && props.matchId)
			isBetIdInCart(props.matchId, odd.id).then((isBetHere: boolean) => {
				if (isBetHere) setSelected(true);
				else setSelected(false);
			});
	}, [odd, props.matchId, reloadCart]);

	function onBet() {
		// AsyncStorage.setItem("@cart_" + joinCode, "[]");
		if (!selected) {
			setSelected(true);

			AsyncStorage.getItem("@cart_" + joinCode).then((input: any) => {
				let cart: any = [];
				if (input) cart = JSON.parse(input);

				cart.push({
					matchId: props.matchId,
					betId: odd.id,
					mise: CONST_BASE_MISE_PARI,
					isBase: false,
				});
				AsyncStorage.setItem("@cart_" + joinCode, JSON.stringify(cart)).then(() => setReloadCart(Math.random() * 10000));
			});
		} else {
			setSelected(false);

			AsyncStorage.getItem("@cart_" + joinCode).then((input: any) => {
				let cart: any = [];
				if (input) cart = JSON.parse(input);

				cart = cart.filter((elem: any) => {
					return (
						!(elem.matchId == props.matchId && elem.betId == odd.id)
					);
				});

				AsyncStorage.setItem("@cart_" + joinCode, JSON.stringify(cart)).then(() => setReloadCart(Math.random() * 10000));
			});
		}
	}

	// useEffect(() => {
	// 	if (ENVIRONEMENT == "dev" && props.plus && props.plus == 424) {
	// 		showMore();
	// 	}
	// }, [props.plus]);


	function showMore() {
		if (callbackShowMatchBet && props.match)
			callbackShowMatchBet(props.match);
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
					<Text>{odd.header  && odd.name != <odd className="header"></odd>? odd.header + " " : ""}</Text>
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
