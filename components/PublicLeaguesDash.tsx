import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextTitle,
	LineBreak,
	Button,
	SubText,
	TextInput,
	TextWarning,
	SmallLineBreak,
} from "./Themed";
import { Alert, Image, StyleSheet, ScrollView } from "react-native";
import { GameSchema } from "../src/interaces/interfacesGame";
import { GameIcon } from "./GameIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import { SERVER_API_URL } from "../constants/Server";

async function addUserInAGame(joinCode: string, jwt: string) {
	const rawResponse = await fetch(
		SERVER_API_URL + `/adduserinagame?joinCode=${joinCode}&jwt=${jwt}`
	);
	const content = await rawResponse.json();
	return content;
}

export function PublicLeaguesDash(props: any) {
	const publicGames: Array<GameSchema> = props.publicGames;
	const navigation: any = props.navigation;
	const jwt: string = props.jwt;
	const privateJoinCodes: string[] = props.privateJoinCodes;
	const user: any = props.user;

	return (
		<View>
			{publicGames ? (
				<TextTitle style={{ marginVertical: 24 }}>
					Les contest publiques
				</TextTitle>
			) : null}

			<View>
				<ScrollView style={{ overflow: "visible" }} horizontal={true}>
					{publicGames
						? publicGames.map((data: any) => {
								return (
									<GameIcon
										user={user}
										needToAddUserInGame={
											!privateJoinCodes.some(
												(joinCode: string) =>
													joinCode == data.joinCode
											)
										}
										joinBeforeEntering={true}
										jwt={jwt}
										key={data.joinCode}
										game={data}
										username={"@"} //simplement pour que le code marche
										navigation={navigation}
									/>
								);
						  })
						: null}
				</ScrollView>
			</View>

			<LineBreak />
		</View>
	);
}

const styles = StyleSheet.create({
	selected: { color: Colors.black, paddingRight: 24 },
	notSelected: { color: Colors.gray, paddingRight: 24 },
	buttonChange: {
		paddingHorizontal: 6,
		paddingVertical: 4,
		height: "auto",
	},
	marginVertical: {
		marginVertical: 12,
	},
});
