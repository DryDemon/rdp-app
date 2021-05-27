import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";

import arrowIcon from "../assets/images/arrow_black.png";
import Icon from "../components/CustomIcon";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../constants/Colors";
import Constants from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShowBonus } from "./showBonus";

export function GameHeader(props: any) {
	const [arrow, setArrow] = useState(<></>);

	const {
		back,
		navigation,
		callbackQuestionMark,
		toggleShowBonus,
		canShowBonus,
		...otherProps
	} = props;

	const backgroundColor = Colors.white;

	const height = 56;

	const width = "100%";
	const fontWeight = "700";

	const marginTop = Constants.statusBarHeight;

	const color = Colors.rdpColor;

	function logout() {
		AsyncStorage.removeItem("@jwt").then(() => {
			if (navigation) navigation.navigate("Login");
		});
	}

	useEffect(() => {
		if ((back && navigation) || props.callBackGameHeaderGotoBack) {
			setArrow(
				<TouchableOpacity
					onPress={() => {
						if (typeof back === "string") navigation.navigate(back);
						else props.callBackGameHeaderGotoBack();
					}}
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
		<View>
			<View
				style={[
					{
						backgroundColor,
						height,
						width,
						marginTop,
						paddingHorizontal: 24,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						shadowColor: "rgba(0,0,0, 0.24)",
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.23,
						elevation: 50,
					},
				]}
			>
				<View
					style={[
						{
							flexDirection: "row",
							alignItems: "center",
						},
					]}
				>
					<View>{arrow}</View>
					<View
						style={[
							{
								marginLeft: 12,
							},
						]}
					>
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
							onPress={callbackQuestionMark}
							style={[
								{
									marginLeft: 12,
								},
							]}
						>
							<Icon
								icon="info"
								size={24}
								color={"#A9AAB0"}
							/>
						</TouchableOpacity>
					) : undefined}
				</View>
				<View
					style={[
						{
							flexDirection: "row",
							alignItems: "center",
						},
					]}
				>
					{toggleShowBonus && canShowBonus ? (
						<TouchableOpacity
							onPress={toggleShowBonus}
							style={[
								{
									marginRight: 12,
								},
							]}
						>
							<Icon
								icon="bonus"
								size={24}
								color={Colors.black}
							/>
						</TouchableOpacity>
					) : undefined}
					<TouchableOpacity onPress={logout}>
						<Icon
							icon="menu"
							size={24}
							color={Colors.black}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
