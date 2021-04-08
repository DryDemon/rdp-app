import * as React from "react";
import {
	Text as DefaultText,
	View as DefaultView,
	TextInput as DefaultTextInput,
	Button as DefaultButton,
	StyleProp,
	ViewStyle,
	TextStyle,
	ButtonProps,
	TextInputProps,
	Image,
	TouchableOpacity,
	ScrollView as DefaultScrollView,
	TouchableOpacityProps,
} from "react-native";
import Constants from "expo-constants";

import Colors from "../constants/Colors";
import { useEffect, useState } from "react";

import Layout from "../constants/Layout";

export function useThemeColor(colorName: keyof typeof Colors) {
	return Colors[colorName];
}

type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

//TEXT
export function Text(props: TextProps) {
	const { style, ...otherProps } = props;
	const color = useThemeColor("text");

	// const fontFamily = "Neue Haas Grotesk Display Pro";

	return (
		<DefaultText style={[{ color, fontSize: 17 }, style]} {...otherProps} />
	);
}

export function TextMainTitle(props: TextProps) {
	const { style, ...otherProps } = props;
	const fontSize = 40;
	const fontWeight = "bold" as "bold";

	return <Text style={[{ fontSize, fontWeight }, style]} {...otherProps} />;
}

export function TextLabel(props: TextProps) {
	const { style, ...otherProps } = props;
	const fontSize = 12;
	const fontWeight = "bold" as "bold";

	return <Text style={[{fontSize, fontWeight }, style]} {...otherProps} />;
}

export function TextTitle(props: TextProps) {
	const { style, ...otherProps } = props;
	const fontSize = 28;

	return <Text style={[{ fontSize }, style]} {...otherProps} />;
}

export function TextSubTitle(props: TextProps) {
	const { style, ...otherProps } = props;

	return (
		<Text
			style={[
				{
					fontSize: 22,
					fontWeight: "500",
				},
				style,
			]}
			{...otherProps}
		/>
	);
}

export function SubText(props: TextProps) {
	const { style, ...otherProps } = props;
	const fontWeight = "500";
	const fontSize = 12;

	return (
		<Text
			style={[{ fontSize, fontWeight, color: "#808080" }, style]}
			{...otherProps}
		/>
	);
}

export function LineBreak(props: TextProps) {
	return <Text>{"\n"}</Text>;
}
export function SmallLineBreak(props: TextProps) {
	return <Text style={[{ fontSize: 10 }]}>{"\n"}</Text>;
}
//VIEW
export function View(props: ViewProps) {
	const { style, ...otherProps } = props;
	const backgroundColor = useThemeColor("white");

	return <DefaultView style={[{}, style]} {...otherProps} />;
}

export function ViewContainer(props: ViewProps) {
	const { style, ...otherProps } = props;

	const backgroundColor = useThemeColor("white");
	const paddingLeft = 24;
	const paddingRight = 24;
	const overflow = "scroll";

	return (
		<DefaultView
			style={[
				{
					overflow,
					backgroundColor,
					paddingLeft,
					paddingRight,
				},
				style,
			]}
			{...otherProps}
		/>
	);
}

export function ViewCenter(props: ViewProps) {
	const { style, ...otherProps } = props;
	const alignItems = "center";

	return <DefaultView style={[{ alignItems }, style]} {...otherProps} />;
}

//FORM
export function TextInput(props: TextInputProps) {
	const { style, ...otherProps } = props;

	const height = 46;
	const paddingVertical = 12;
	const paddingHorizontal = 24;
	const borderRadius = 12;
	const marginVertical = 10;
	const fontSize = 17;
	const backgroundColor = "#FFFFFF";
	const color = Colors.grayPlaceHolder;
	let shadowColor= "#000";
	let shadowOffset= {
		width: 0,
		height: 0,
	};
	let shadowOpacity= 0.32;
	let shadowRadius= 2.46;

	let elevation= 4;

	const flex = 0;
	const flexGrow = 0;
	return (
		<DefaultTextInput
			style={[
				{
					height,
					color,
					fontSize,
					borderRadius,
					paddingHorizontal,
					paddingVertical,
					marginVertical,
					backgroundColor,
					flex,
					flexGrow,
					shadowColor,
					shadowOffset,
					shadowOpacity,
					shadowRadius,
					elevation

				},
				style,
			]}
			{...otherProps}
		/>
	);
}

export function Button(props: TouchableOpacityProps | any) {
	let { bgColor, title, style, disabled, onPress, ...otherProps } = props;

	if (!bgColor) bgColor = useThemeColor("rdpColor");
	const height = 48;
	let borderRadius = 12;
	let paddingHorizontal = 40;
	let paddingVertical = 14;
	let color = Colors.white;
	let textAlign = "center";

	return (
		<TouchableOpacity
			style={[{ backgroundColor: bgColor, borderRadius, paddingHorizontal, paddingVertical, height  }, style]}
			{...otherProps}
			onPress={disabled?() => {}: onPress}
		>
			<Text style={[{ color, textAlign }, style]} {...otherProps}>{title}</Text>
		</TouchableOpacity>
	);
}

export function TextWarning(props: TextProps) {
	const { style, ...otherProps } = props;
	const color = useThemeColor("alert");
	const fontSize = 12;

	return <Text style={[{ color, fontSize }, style]} {...otherProps} />;
}

export function GameScrollView(props: any) {
	const { style, ...otherProps } = props;

	let height = Layout.window.height - 56; //height footer
	height -= 56; //height header
	height -= Constants.statusBarHeight; //padding top header

	return (
		<DefaultScrollView
			style={[{ height, overflow: "visible" }, style]}
			{...otherProps}
		/>
	);
}

export function BasicScrollView(props: any) {
	const { style, isHeaderShown, ...otherProps } = props;
	let height = Layout.window.height;
	if (isHeaderShown) {
		height -= 56; //height header

		height -= Constants.statusBarHeight; //padding top header
	}

	return <GameScrollView style={[{ height }, style]} {...otherProps} />;
}
