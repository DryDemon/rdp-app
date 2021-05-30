import React from "react";

import IcomoonReact from "icomoon-react";
import iconSet from "../src/selection.json";
import { View, Text } from "./Themed";

import selection from "../src/selection.json";

export function getUnicode(icon: string) {
	let code = selection.icons.find((value) => {
		return value.properties.name == icon;
	});

	if (code) return String.fromCodePoint(code.properties.code);

	return "";
}

export default function Icon(props: any) {
	let { color, size = "100%", icon, className = "" } = props;
	let realSize = 24;

	if (size && typeof size == "string" && size.indexOf("%") !== -1) {
		size = size.replace("%", "");

		size = +size;
		realSize = (24 * size) / 100;
	}

	if (size && typeof size == "number") realSize = size;

	return (
		<View>
			<Text
				style={{
					color: color,
					fontFamily: "icomoon",
					fontSize: realSize,
				}}
			>
				{getUnicode(icon)}
			</Text>
		</View>
	);
}
