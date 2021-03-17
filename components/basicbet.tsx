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
import { ENVIRONEMENT } from "../constants/Environement";

function isEmptyObject(obj: any) {
	if (obj) {
		return !Object.keys(obj).length;
	}
	return false;
}

export default function BasicBet(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const odd = props.odd;

	const [selected, setSelected] = useState(false);

	function onPress() {
		if (!selected) {
			setSelected(true);
			//update async storage cart
		} else {
			setSelected(false);
			//update async storage cart
		}
	}

	useEffect(() => {
		if(ENVIRONEMENT == "dev" && props.plus && props.plus == 424 ){
			showMore();
		}

	}, [props.plus])

	function showMore() {
		if (callbackShowMatchBet && props.match)
			callbackShowMatchBet(props.match);
	}

	if (odd) {
		return (
			<TouchableOpacity onPress={onPress}>
				<View
					key={odd.id}
					style={
						!selected
							? styles.betContainer
							: styles.betContainerSelected
					}
				>
					<Text>{odd.header ? odd.header + " " : ""}</Text>
					<View style={{ flexDirection: "row" }}>
						<View>
							<Text style={styles.name}>{odd.name}</Text>
						</View>
						<View>
							<Text
								style={
									!selected ? styles.odd : styles.oddSelected
								}
							>
								{parseInt(odd.odds).toFixed(2)}
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	} else if (props.plus) {
		return (
			<TouchableOpacity onPress={showMore}>
				<View style={styles.betContainer}>
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
		justifyContent: "center",
		alignItems: "center",
		// width:77,
		paddingHorizontal: 12,
		paddingVertical: 3,
		margin: 5,
		backgroundColor: Colors.background,
		borderRadius: 12,
	},
	betContainerSelected: {
		justifyContent: "center",
		alignItems: "center",
		// width:77,
		paddingHorizontal: 12,
		paddingVertical: 3,
		margin: 5,
		backgroundColor: Colors.rdpColor,
		borderRadius: 12,
	},
	name: {
		// margin:3,
		marginHorizontal: 10,
		fontWeight: "500",
		fontSize: 16,
		color: "#A0BDF8",
	},
	odd: {
		color: Colors.rdpColor,
		fontWeight: "500",
		fontSize: 16,
	},
	oddSelected: {
		color: "white",
		fontWeight: "500",
		fontSize: 16,
	},
});
