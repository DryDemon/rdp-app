import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";

import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

export function GameFooter(props: any) {
	const { page, setPage, ...otherProps } = props;

	//EvilIcons chart
	// MaterialCommunityIcons progress-clock
	// FontAwesome5 coins
	//Feather shopping-cart
	// FontAwesome calendar-check-o
	//                    <Icon style={styles.gameLogo} name="calendar" size={20} color="#FFF"  />

	function gotoIcon(id: number) {
		switch (id) {
			case 1:
				setPage("gameClassement");
				break;
			case 2:
				setPage("gamePlaceBet");
				break;
			case 3:
				setPage("gameListBets");
				break;
			case 4:
				setPage("gameCart");
				break;
			case 5:
				setPage("gamePlayerStats");
				break;
		}
	}

	return (
		<View style={styles.footer}>
			<TouchableOpacity
				style={styles.iconContainer}
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
					<EvilIcons name="chart" size={20} color={page == "gameClassement" ?"#FFF" : "#000"} />
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(2);
				}}
			>
				<View
					style={
						page == "gamePlaceBet" ? styles.touched : styles.untouched
					}
				>
					<MaterialCommunityIcons
						name="progress-clock"
						size={20}
						color={page == "gamePlaceBet" ?"#FFF" : "#000"}
					/>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(3);
				}}
			>
				<View
					style={
						page == "gameListBets"
							? styles.touched
							: styles.untouched
					}
				>
					<FontAwesome5 name="coins" size={20} color={page == "gameListBets" ?"#FFF" : "#000"} />
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(4);
				}}
			>
				<View
					style={
						page == "gameCart" ? styles.touched : styles.untouched
					}
				>
					<Feather name="shopping-cart" size={20} color={page == "gameCart" ?"#FFF" : "#000"} />
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.iconContainer}
				onPress={() => {
					gotoIcon(5);
				}}
			>
				<View
					style={
						page == "gamePlayerStats"
							? styles.touched
							: styles.untouched
					}
				>
					<FontAwesome
						name="calendar-check-o"
						size={20}
						color={page == "gamePlayerStats" ?"#FFF" : "#000"}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	iconContainer: {
		flex: 1,
		alignItems: "center",
	},
	footer: {
		height: 56,
		// padding: 10,
		width: "100%",

		color: "#FFFFFF",
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
	},
	touched: {
    
        padding:7,
		borderRadius: 12,
		margin: 12,
        backgroundColor: "#5507e1",

	},
	untouched: {
        padding:7,
        margin : 12
    },
});
