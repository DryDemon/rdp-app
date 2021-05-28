import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";
import Colors from "../constants/Colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Icon from "../components/CustomIcon";

export function GameFooter(props: any) {
	const { page, setPage,  joinCode,betChoiceList,  ...otherProps } = props;

	const [betNumber, setBetNumber] = useState(0);

	useEffect(() => {
		getBetNumber();
	}, []);
	useEffect(() => {
		getBetNumber();
	}, [ joinCode, betChoiceList]);

	function gotoIcon(id: number) {
		switch (id) {
			case 1:
				setPage("gameClassement");
				break;
			case 2:
				setPage("gameListBets");
				break;
			case 3:
				setPage("gamePlaceBet");
				break;
			case 4:
				setPage("gameCart");
				break;
			case 5:
				setPage("gameMatchStats");
				break;
		}
	}

	function getBetNumber(unused?: any) {
		setBetNumber(betChoiceList.length);
	}

	return (
		<View style={styles.footer}>
			<TouchableOpacity
				//style={styles.iconContainer}
				onPress={() => {
					gotoIcon(1);
				}}
			>
				<View
					style={
						page == "gameClassement"
							? styles.touched
							: styles.untouched
					}
				>
					<Icon
						icon="menu-rank"
						size={24}
						color={page == "gameClassement" ? Colors.white : Colors.black}
					/>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				//style={styles.iconContainer}
				onPress={() => {
					gotoIcon(2);
				}}
			>
				<View
					style={
						page == "gameListBets"
							? styles.touched
							: styles.untouched
					}
				>
					<Icon
						icon="menu-all_bets"
						size={24}
						color={page == "gameListBets" ? Colors.white : Colors.black}
					/>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				//style={styles.iconContainer}
				onPress={() => {
					gotoIcon(3);
				}}
			>
				<View
					style={
						page == "gamePlaceBet"
							? styles.touched
							: styles.untouched
					}
				>
					<Icon
						icon="menu-coin"
						size={24}
						color={page == "gamePlaceBet" ? Colors.white : Colors.black}
					/>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				//style={styles.iconContainer}
				onPress={() => {
					gotoIcon(4);
				}}
			>
				<View>
					<View
						style={
							page == "gameCart"
								? styles.touched
								: styles.untouched
						}
					>
						<Icon
							icon="menu-cart"
							size={24}
							color={page == "gameCart" ? Colors.white : Colors.black}
						/>
					</View>
					{betNumber != 0 ? (
						<View style={styles.cartNotification}>
							<Text style={styles.cartNotificationText}>
								{betNumber}
							</Text>
						</View>
					) : null}
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				//style={styles.iconContainer}
				onPress={() => {
					gotoIcon(5);
				}}
			>
				<View
					style={
						page == "gameMatchStats"
							? styles.touched
							: styles.untouched
					}
				>
					<Icon
						icon="menu-result"
						size={24}
						color={page == "menu-result" ? Colors.white : Colors.black}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	/*iconContainer: {
		flex: 1,
		alignItems: "center",
	},*/
	footer: {
		height: 56,
		paddingHorizontal: 24,
		width: "100%",
		//borderTopRightRadius: 12,
		//borderTopLeftRadius: 12,
		backgroundColor: Colors.white,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		shadowColor: "rgba(0,0,0, 0.24)",
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.23,
		elevation: 50,

	},
	touched: {
		padding: 12,
		borderRadius: 12,
		backgroundColor: Colors.rdpColor,
	},
	untouched: {
		padding: 12,
		
	},
	cartNotification: {
		width: 15,
		height: 15,
		position: "absolute",
		borderRadius: 100,
		backgroundColor: "red",
		alignItems: "center",
		top: "22%",
		right: "22%",
	},
	cartNotificationText: {
		fontSize: 10,
		color: Colors.white,
	},
});
