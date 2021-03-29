import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";

import arrowIcon from "../assets/images/arrow.png";

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
		...otherProps
	} = props;

	const backgroundColor = Colors.rdpColor;

	const height = 56;
	const padding = 10;
	const width = "100%";
	const fontWeight = "700";

	const marginTop = Constants.statusBarHeight;

	const color = "#FFFFFF";

	function logout() {
		AsyncStorage.removeItem("@jwt").then(() => {
			if (navigation) navigation.navigate("Login");
		});
	}

	useEffect(() => {
		if (back && navigation) {
			setArrow(
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
		<View>
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
				<View style={{ flexDirection: "row", alignItems: "center" }}>
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
									marginLeft: 5,
									marginTop: 3,
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
					{toggleShowBonus ? (
						<TouchableOpacity
							style={{
								marginLeft: "auto",
								alignSelf: "flex-end",
							}}
							onPress={toggleShowBonus}
						>
							<Octicons name="gift" size={20} color={"#FFF"} />
						</TouchableOpacity>
					) : undefined}
					<TouchableOpacity
						style={{ marginLeft: "auto", alignSelf: "flex-end" }}
						onPress={logout}
					>
						<MaterialCommunityIcons
							name="logout"
							size={20}
							color={"#fff"}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
