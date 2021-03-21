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
				{bets.betsObjects.map((bet: any) => (
					<View>
						<Text style={styles.title}>{bet.matchName}</Text>

						<SubText>{bet.leagueName}</SubText>

						<SmallLineBreak />
						<View style={styles.lineRow}>
							{bet.result ? (
								<View>
									<Text style={styles.credits}>
										Résultat :{" "}
									</Text>
									<Text>{bet.result}</Text>
								</View>
							) : null}
							<View style={styles.mainQuoteContainer}>
								<Text style={styles.mainQuoteText}>
									{bet.quote}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	seeDetailsView: {
		backgroundColor: "#E2F1FF",
		padding: 4,
		borderRadius: 4,
	},
	seeDetailsText: {
		fontSize: 12,
		fontWeight: "500",
	},
	dromDownContainer: {
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

});
