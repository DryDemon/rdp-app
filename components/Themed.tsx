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
} from "react-native";
import Constants from "expo-constants";

import Colors from "../constants/Colors";

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

	return <DefaultText style={[{ color, fontSize:17 }, style]} {...otherProps} />;
}

export function TextMainTitle(props: TextProps) {
	const { style, ...otherProps } = props;
	const fontSize = 40;
	const fontWeight = "bold" as "bold";

	return <Text style={[{ fontSize, fontWeight}, style]} {...otherProps} />;
}

export function TextLabel(props: TextProps) {
	const { style, ...otherProps } = props;

	return <Text style={[style]} {...otherProps} />;
}

export function TextTitle(props: TextProps) {
	const { style, ...otherProps } = props;
	const fontSize = 28;

	return <Text style={[{ fontSize }, style]} {...otherProps} />;
}

export function SubText(props: TextProps) {
	const { style, ...otherProps } = props;
	const fontWeight = "500";
	const fontSize = 12;

	return <Text style={[{ fontSize, fontWeight }, style]} {...otherProps} />;
}

export function LineBreak(props: TextProps) {
	return <Text>{"\n"}</Text>;
}
export function SmallLineBreak(props: TextProps) {
	return <Text style={[{fontSize:10}]} >{"\n"}</Text>;
}
//VIEW
export function View(props: ViewProps) {
	const { style, ...otherProps } = props;
	const backgroundColor = useThemeColor("background");

	return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ViewContainer(props: ViewProps) {
	const { style, ...otherProps } = props;
	const backgroundColor = useThemeColor("background");
	const paddingLeft = "10%";
	const paddingRight = "7%";
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

	const height = 44;
	const padding = 10;
	const width = "100%";

	const backgroundColor = "#FFFFFF";

	const borderColor = "black";
	const marginBottom = 10;
	const marginTop = 10;

	const borderWidth = 1;

	const flex = 0;
	const flexGrow = 0;
	return (
		<DefaultTextInput
			style={[
				{
					height,
					width,
					padding,
					backgroundColor,
					borderColor,
					borderWidth,
					flex,
					flexGrow,
					marginBottom,
					marginTop,
				},
				style,
			]}
			{...otherProps}
		/>
	);
}

export function Button(props: ButtonProps) {
	const { ...otherProps } = props;

	return <DefaultButton {...props} />;
}

export function TextWarning(props: TextProps) {
	const { style, ...otherProps } = props;
	const color = "red";

	return <Text style={[{ color }, style]} {...otherProps} />;
}

//protected

export function ProtectedHeader(props: ViewProps) {
	const backgroundColor = useThemeColor("rdpColor");

	const height = 56;
	const padding = 10;
	const width = "100%";
	const fontWeight = "700";

	const marginTop = Constants.statusBarHeight;

	const color = "#FFFFFF";

	return (
		<View
			style={[
				{
					backgroundColor,
					height,
					padding,
					width,
					marginTop,
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
	);
}
