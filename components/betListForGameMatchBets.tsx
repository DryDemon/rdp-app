import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import BasicBet from "./basicbet";
import { SmallLineBreak, View, Text, SubText, TextTitle } from "./Themed";

import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../constants/Colors";

export default function BetListForGameMatchBets(props: any) {
	const [showDropDown, setShowDropDown] = useState(true);

	const bet = props.bet;
	const betChoiceListGroup = props.betChoiceListGroup;

	if (bet && bet.odds)
		return (
			<View style={styles.betContainer}>
				<TouchableOpacity
					style={styles.title}
					onPress={() => {
						if (showDropDown) setShowDropDown(false);
						else setShowDropDown(true);
					}}
				>
					<Text style={styles.betMainName}>{bet.name}</Text>
					<View style={styles.arrowView}>
						<MaterialIcons
							name="keyboard-arrow-down"
							size={20}
							color={"#000"}
						/>
					</View>
				</TouchableOpacity>
				<View
					style={
						showDropDown ? { display: "flex" } : { display: "none" }
					}

					
				>
					{bet.odds.map((odd: any) => (
						<View style={styles.oddContainer} key={odd.id}>
							{odd.name ? (
								<Text style={{ flex: 1 }}>{odd.name}</Text>
							) : null}
							{odd.header ? (
								<Text style={{ flex: 1 }}>{odd.header}</Text>
							) : null}
							{odd.handicap ? (
								<Text style={{ flex: 1 }}>{odd.handicap}</Text>
							) : null}

							<BasicBet
							betChoiceListGroup={betChoiceListGroup}
								joinCode={props.joinCode}
								key={odd.id}
								odd={odd}
								matchId={props.matchId}
							></BasicBet>
						</View>
					))}
				</View>
			</View>
		);
	else return null;
}
const styles = StyleSheet.create({
	betContainer: {
		borderRadius: 12,
		backgroundColor: "white",
		margin: 6,
	},
	title: {
		borderTopRightRadius: 12,
		borderTopLeftRadius: 12,
		backgroundColor: Colors.rdpColor,
		flexDirection: "row",
	},
	arrowView: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
	},
	oddValue: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
	},
	oddContainer: {
		flexDirection: "row",
		backgroundColor: "#F6F7F9",
		margin: 4,
		padding: 10,
	},betMainName:{
		color:"white",
		fontWeight:"500",
		fontSize:17,
		marginVertical:9,
		marginHorizontal:12,
	}
});
// {
//     "id": "10202",
//     "name": "Alternative Total Goals",
//     "odds": [
//         {
//             "id": "1458138425",
//             "odds": "1.050",
//             "header": "Over",
//             "name": "0.5"
//         },
//         {
//             "id": "1458138428",
//             "odds": "1.222",
//             "header": "Over",
//             "name": "1.5"
//         },
//         {
//             "id": "1458138430",
//             "odds": "2.750",
//             "header": "Over",
//             "name": "3.5"
//         },
//         {
//             "id": "1458138438",
//             "odds": "5.500",
//             "header": "Over",
//             "name": "4.5"
//         },
//         {
//             "id": "1458138442",
//             "odds": "11.000",
//             "header": "Over",
//             "name": "5.5"
//         },
//         {
//             "id": "1458138451",
//             "odds": "23.000",
//             "header": "Over",
//             "name": "6.5"
//         },
//         {
//             "id": "1458138426",
//             "odds": "12.000",
//             "header": "Under",
//             "name": "0.5"
//         },
//         {
//             "id": "1458138429",
//             "odds": "4.000",
//             "header": "Under",
//             "name": "1.5"
//         },
//         {
//             "id": "1458138431",
//             "odds": "1.400",
//             "header": "Under",
//             "name": "3.5"
//         },
//         {
//             "id": "1458138439",
//             "odds": "1.142",
//             "header": "Under",
//             "name": "4.5"
//         },
//         {
//             "id": "1458138443",
//             "odds": "1.050",
//             "header": "Under",
//             "name": "5.5"
//         },
//         {
//             "id": "1458138452",
//             "odds": "1.012",
//             "header": "Under",
//             "name": "6.5"
//         }
//     ]
// }
