import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";

import arrowIcon from "../assets/images/arrow.png";

import EvilIcons from "react-native-vector-icons/EvilIcons";
import Colors from "../constants/Colors";
import Constants from "expo-constants";

export function GameHeader(props: any) {
	const [arrow, setarrow] = useState(<></>);

	const { back, navigation, callbackQuestionMark, ...otherProps } = props;

	const backgroundColor = Colors.rdpColor;

	const height = 56;
	const padding = 10;
	const width = "100%";
	const fontWeight = "700";

	const marginTop = Constants.statusBarHeight;

	const color = "#FFFFFF";

	useEffect(() => {
		if (back && navigation) {
			setarrow(
				<TouchableOpacity
					onPress={() => navigation.navigate(back)}
					style={[
						{
							paddingHorizontal: 7,
							paddingVertical: 7,
							paddingRight: 10,
						},
					]}
				>
					<Image
						style={[
							{
								height: 12,
								width: 16,
							},
						]}
						source={arrowIcon}
					/>
				</TouchableOpacity>
			);
		}
	}, [back, navigation]);

	return (
		<View
			style={[
				{
					backgroundColor,
					height,
					paddingTop: 15,
					padding,
					width,
					marginTop,
				},
			]}
		>
			<View style={{ flexDirection: "row" }}>
				<View>{arrow}</View>
				<View>
					<Text
						style={[
							{
								color,
								fontWeight,
								fontStyle: "italic",
								fontSize: 20,
								lineHeight: 26,
								textAlignVertical: "center",
								// fontFamily: "Orkney",
							},
						]}
					>
						ROI DU PRONO
					</Text>
				</View>
				{callbackQuestionMark ? (
					<TouchableOpacity
						style={[
							{
                                marginLeft:5,
                                marginTop:3,
                            },
						]}
						onPress={callbackQuestionMark}
					>
						<EvilIcons
							name="question"
							size={20}
							color={"#A9AAB0"}
						/>
					</TouchableOpacity>
				) : undefined}
			</View>
		</View>
	);
}
