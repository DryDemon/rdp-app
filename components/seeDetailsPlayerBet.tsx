import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextTitle,
	LineBreak,
	Button,
	SubText,
	TextInput,
	TextWarning,
	SmallLineBreak,
} from "./Themed";
import {
	Alert,
	Image,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { GameSchema, userBetInterface } from "../src/interaces/interfacesGame";
import { GameIcon } from "./GameIcon";
import Colors from "../constants/Colors";
import { CheckBox } from "./checkBox";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";

export function SeeDetails(props: any) {
	let bets = props.bet;
	const [show, setShow] = useState(false);

	return (
		<View>
			<TouchableOpacity
				style={styles.seeDetailsView}
				onPress={() => setShow(!show)}
			>
				<Text style={styles.seeDetailsText}>
					Voir le détail {show ? "-" : "+"}
				</Text>
			</TouchableOpacity>
			<View
				style={[
					styles.dromDownContainer,
					{ display: show ? "flex" : "none" },
				]}
			>
				<View style={styles.spacer}></View>
				{bets.betsObjects.map((bet: any) => (
					<View>
						<View style={styles.header}>
							<Text style={styles.title}>{bet.matchName}</Text>
							{bet.betStatus == 0 ? ( //EN cOURS
								<MaterialCommunityIcons
									style={styles.icon}
									name="progress-clock"
									size={24}
									color={"#000"}
								/>
							) : null}
							{bet.betStatus == 1 ? ( //WIN
								<EvilIcons
									style={styles.icon}
									name="trophy"
									size={24}
									color={"#5BD18F"}
								/>
							) : null}
							{bet.betStatus == 2 ? ( //LOST
								<View
									style={{
										borderRadius: 100,
										backgroundColor: "#FDE7E7",
									}}
								>
									<Entypo
										style={styles.icon}
										name="cross"
										size={24}
										color={"#000"}
									/>
								</View>
							) : null}
						</View>

						<Text style={styles.betInfo}>
							{bet.betName ? bet.betName + "   " : null}
							{bet.betSubName ? bet.betSubName + "   " : null}
							{bet.betHeader ? bet.betHeader + "   " : null}
							{bet.betHandicap ? bet.betHandicap : null}
						</Text>

						<SubText>{bet.leagueName}</SubText>

						<SmallLineBreak />
						<View style={styles.lineRow}>
							{bet.betName ||
							bet.betSubName ||
							bet.betHeader ||
							bet.betHandicap ? (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Text style={styles.resultField}>
										Résultat :
									</Text>
									<Text style={styles.betInfo}>
										{bet.betName
											? bet.betName + "   "
											: null}
										{bet.betSubName
											? bet.betSubName + "   "
											: null}
										{bet.betHeader
											? bet.betHeader + "   "
											: null}
										{bet.betHandicap
											? bet.betHandicap
											: null}
									</Text>
									<SmallLineBreak/>
								</View>
							) : null}

							<View style={styles.mainQuoteContainer}>
								<Text style={styles.mainQuoteText}>
									{bet.quote.toFixed(2)}
								</Text>
							</View>
						</View>
						{bets.isSystem ? (
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<CheckBox value={bet.isBase} />
								<Text style={{ marginLeft: 10 }}>Base</Text>
							</View>
						) : null}
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	seeDetailsView: {
		backgroundColor: Colors.revertRdpColor,
		padding: 4,
		borderRadius: 8,
	},
	seeDetailsText: {
		fontSize: 12,
		fontWeight: "500",
	},
	dromDownContainer: {
		marginTop: 24,
		borderTopColor: "black",
		borderTopWidth: 1,
	},
	title: {
		fontSize: 15,
		fontWeight: "700",
	},
	lineRow: {
		flexDirection: "row",
	},
	credits: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
		fontWeight: "700",
		fontSize: 12,
	},
	resultField: {
		fontWeight: "500",
		fontSize: 12,
	},
	mainQuoteContainer: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
		backgroundColor: Colors.rdpColor,
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
	},
	mainQuoteText: {
		fontWeight: "700",
		color: "white",
		fontSize: 15,
	},
	spacer: {
		width: "100%",
		height: 12,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginLeft: "auto",
		textAlign: "right",
		alignSelf: "flex-end",
	},
	betInfo: {
		fontSize: 12,
		fontWeight: "700",
	},
});
