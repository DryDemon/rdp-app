import React, { useState } from "react";
import { View, Text, TextTitle, SubText, SubHeadline } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; //TODO REMOVE
import format from "date-fns/format";
import DatepickerRange from "react-native-range-datepicker";

import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../constants/Colors";

export function DatePicker(props: any) {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [beenSet, setbeenSet] = useState(false);

console.log(format(new Date(), "ddMMyyyy"))

	return (
		<View>
			<TouchableOpacity
				style={{ flexDirection: "row", justifyContent: "space-between"}}
				onPress={() => {
					if (showDatePicker) setShowDatePicker(false);
					else setShowDatePicker(true);
				}}
			>
				<View style={styles.dateContainer}>
					<View>
						<Icon
							style={[{backgroundColor: Colors.greenBcg,} ,styles.gameLogo]}
							name="calendar"
							size={24}
							color={Colors.green}
						/>
					</View>
					<View style={{flex:1,}} >
						{!beenSet && (
							<SubHeadline style={styles.text}>{props.initTextBegin}</SubHeadline>
						)}
						{beenSet && (
							<Text style={styles.text}>
								{format(props.start, "dd/MM/yyyy")}
							</Text>
						)}
					</View>
				</View>
				<View style={styles.dateContainer}>
					<View>
						<Icon
							style={[{backgroundColor: Colors.redBcg,} ,styles.gameLogo]}
							name="calendar"
							size={24}
							color={Colors.red}
							

						/>
					</View>
					<View style={{flex:1}}>
						{!beenSet && (
							<SubHeadline style={styles.text}>{props.initTextEnd}</SubHeadline>
						)}
						{beenSet && (
							<Text style={styles.text}>
								{format(props.end, "dd/MM/yyyy")}
							</Text>
						)}
					</View>
				</View>
			</TouchableOpacity>
			{showDatePicker && (
				<DatepickerRange
					onClose={() => {
						setShowDatePicker(false);
					}}
					dayHeadings={["D", "L", "M", "M", "J", "V", "S"]}
					maxMonth={2}
					buttonColor={Colors.rdpColor}
					todayColor={Colors.rdpColor}
					selectedBackgroundColor={Colors.rdpColor}
					startDate={format(props.start, "ddMMyyyy")}
					untilDate={format(props.end, "ddMMyyyy")}
                    placeHolderStart={"Date de Début"}
                    placeHolderUntil={"Date de Fin"}
                    onConfirm={(startDate: number, untilDate: number) => {
						props.setStart(new Date(startDate));
						props.setEnd(new Date(untilDate));

						setbeenSet(true);
						setShowDatePicker(false);
					}}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	dateContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: 152,
		height: 48,
		paddingVertical: 12,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,

		elevation: 4,
		// maxWidth: 200,
	},
	gameLogo: {
		marginLeft: "auto",
		marginRight: "auto",
		padding: 12,
		borderTopLeftRadius: 12,
		borderBottomLeftRadius: 12,
	},
	text: {
		color: Colors.black,
		fontSize: 14,
		textAlign: "center",

	},
});
