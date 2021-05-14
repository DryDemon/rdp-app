import React, { useState } from "react";
import { View, Text, TextTitle, SubText, SubHeadline, Button } from "./Themed";
import {
	Alert,
	Image,
	Modal,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import format from "date-fns/format";
// import DatePicker from "react-native-date-ranges";
import DateRange from "../components/customDateRangePicker/src/DateRange.jsx";
import DatePicker from "../components/customDateRangePicker";
import { Dimensions } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../constants/Colors";
import moment from "moment";

// moment.locale("fr");

export function DatePickerPerso(props: any) {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [beenSet, setbeenSet] = useState(false);
	const [focus, setFocus] = useState("startDate");

	return (
		<View>
			<TouchableOpacity
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
				}}
				onPress={() => {
					if (showDatePicker) setShowDatePicker(false);
					else setShowDatePicker(true);
				}}
			>
				<View style={styles.dateContainer}>
					<View>
						<Icon
							style={[
								{ backgroundColor: Colors.greenBcg },
								styles.gameLogo,
							]}
							name="calendar"
							size={24}
							color={Colors.green}
						/>
					</View>
					<View style={{ flex: 1 }}>
						{!beenSet && (
							<SubHeadline style={styles.text}>
								{props.initTextBegin}
							</SubHeadline>
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
							style={[
								{ backgroundColor: Colors.redBcg },
								styles.gameLogo,
							]}
							name="calendar"
							size={24}
							color={Colors.red}
						/>
					</View>
					<View style={{ flex: 1 }}>
						{!beenSet && (
							<SubHeadline style={styles.text}>
								{props.initTextEnd}
							</SubHeadline>
						)}
						{beenSet && (
							<Text style={styles.text}>
								{format(props.end, "dd/MM/yyyy")}
							</Text>
						)}
					</View>
				</View>
			</TouchableOpacity>
			<View style={styles.dateRangePickerContainer}>
				<Modal
					animationType="slide"
					onRequestClose={() => setShowDatePicker(false)}
					transparent={false}
					visible={showDatePicker}
				>
					<View style={{ flex: 1, flexDirection: "column" }}>
						<View style={{ height: "90%" }}>
							<DateRange
								// headFormat={this.props.headFormat}
								customStyles={{
									// headerDateTitle: { display: "none" }, // title Date style
								}}
								markText={"Selectionner une date"}
								onDatesChange={(data: any) => {
									const { startDate, endDate, focusedInput } =
										data;
									if (focusedInput) setFocus(focusedInput);

									let tempStartDate = startDate instanceof moment? startDate?.toDate() : startDate 
									let tempEndDate = endDate instanceof moment? endDate?.toDate() : endDate 

									if (tempStartDate) props.setStart(tempStartDate);
									if (tempEndDate) {props.setEnd(tempEndDate); setbeenSet(true)}

									// if(tempEndDate && tempEndDate < props.start){ //Si jamais les deux dates sont inversées
									// 	props.setStart(tempEndDate)
									// 	props.setEnd(props.start)
									// }
									
								}}
								isDateBlocked={(date: any) => {
									if(moment(date).isBefore(new Date()) === true) return true;
									return moment(date).isAfter(moment().add(1, 'M'));
									return false;
								}}
								startDate={moment(props.start)}
								endDate={moment(props.end)}
								focusedInput={focus}
								selectedBgColor={Colors.rdpColor}
								selectedTextColor={"white"}
								mode={"range"}
								currentDate={moment()}
							/>
						</View>
						<View
							style={{
								paddingBottom: "5%",
								width: "100%",
								height: "10%",
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Button
								onPress={() => setShowDatePicker(false)}
								style={{
									container: {
										width: "80%",
										marginHorizontal: "3%",
									},
									text: { fontSize: 20 },
								}}
								// primary
								title={"Confirmer"}
							/>
						</View>
					</View>
				</Modal>
{/* 
				<DatePicker
					style={{ width: 350, height: 45 }}
					customStyles={{
						placeholderText: { fontSize: 20 }, // placeHolder style
						headerStyle: {}, // title container style
						headerMarkTitle: {}, // title mark style
						headerDateTitle: { display: "none" }, // title Date style
						contentInput: { display: "none" }, //content text container style
						contentText: {}, //after selected text Style
					}} // optional
					centerAlign // optional text will align center or not
					allowFontScaling={false} // optional
					placeholder={""}
					mode={"range"}
					customButton={(onConfirm: any) => (
						<Button
							onPress={onConfirm}
							style={{
								container: {
									width: "80%",
									marginHorizontal: "3%",
								},
								text: { fontSize: 20 },
							}}
							// primary
							title={"Confirmer"}
						/>
					)}
					selectedBgColor={Colors.rdpColor}
					headFormat={"DD/MM/YYYY"}
					markText={"Selectionner une Date"}
					onConfirm={(data: {
						startDate: string;
						endDate: string;
					}) => {
						console.log(JSON.stringify(data));
					}}
				/> */}
			</View>
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
	dateRangePickerContainer: {
		// position: "absolute",
		// position:
		// position: "relative",
		// zIndex: 123,
	},
});
