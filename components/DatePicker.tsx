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
				style={styles.dateContainer}
				onPress={() => {
					if (showDatePicker) setShowDatePicker(false);
					else setShowDatePicker(true);
				}}
			>
				<View style={{ flexDirection: "row", alignItems:"center", }}>
					<View>
						<Icon
							style={styles.gameLogo}
							name="calendar"
							size={24}
							color="#FFF"
						/>
					</View>
					<View>
						{!beenSet && (
							<SubHeadline style={styles.text}>{props.initText}</SubHeadline>
						)}
						{beenSet && (
							<Text style={styles.text}>
								{format(props.start, "dd/MM/yyyy") +
									" - " +
									format(props.end, "dd/MM/yyyy")}
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
		height: 48,
		padding: 12,
		borderRadius: 12,
		// maxWidth: 200,
		backgroundColor: Colors.rdpColor,
	},
	gameLogo: {
		marginLeft: "auto",
		marginRight: "auto",
	},
	text: {
		marginHorizontal: 10,
		color: "white",
		fontSize: 14,
	},
});
