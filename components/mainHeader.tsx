import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";

import arrowIcon from "../assets/images/arrow_black.png";
import logo from "../assets/images/logo.png";

import EvilIcons from "react-native-vector-icons/EvilIcons";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../constants/Colors";
import Constants from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

// import * as Svg from "react-native-svg";
import { MainLogoSvgComponent } from "./mainHeaderSvgLogo";

export function MainHeader(props: any) {
	const [arrow, setArrow] = useState(<></>);

	const { back, navigation, ...otherProps } = props;

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
						// paddingHorizontal: 24,
						flexDirection: "row",
						alignItems: "center",
						// justifyContent: "space-between",
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
					<View style={{ width: 61, height: 43 }}>
						<Image
							source={logo}
							style={{ width: 61, height: 43 }}
						/>
					</View>
				</View>

				{props.jwt ? (
					<View
						style={[
							{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "flex-end",
								marginLeft: "auto",
								marginRight: 10,
								marginBottom: 4,
							},
						]}
					>
						<TouchableOpacity onPress={logout}>
							<MaterialCommunityIcons
								name="logout"
								size={24}
								color={Colors.black}
							/>
						</TouchableOpacity>
					</View>
				) : (
					<View></View>
				)}
			</View>
		</View>
	);
}
