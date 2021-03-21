import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import {
	Alert,
	StyleSheet,
	Image,
	Share,
	TouchableOpacity,
} from "react-native";

import {
	
	Text,
	View,
	TextInput,
	Button,
	TextMainTitle,
	TextTitle,
	TextLabel,
	ViewContainer,
	ViewCenter,
	TextWarning,
	LineBreak,
	SmallLineBreak,
	TextSubTitle,
	SubText,
	GameScrollView,
} from "../../components/Themed";

import { ENVIRONEMENT } from "../../constants/Environement";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../../constants/Server";
import { GameSchema } from "../../src/interaces/interfacesGame";
import { validURL } from "../../src/smallFuncts";
import { FlatList } from "react-native-gesture-handler";
import Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/Feather";
import { GameFooter } from "../../components/GameFooter";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default function GameInfo(props: any) {
	const { jwt, user, joinCode, game, logoUrl, isShow, ...otherProps } = props;

	const onShare = async () => {
		try {
			const result = await Share.share({
				message:
					"Rejoins moi sur Roi Du Prono et viens dans mon contest : " +
					joinCode,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};


	const renderBulletList = (item: any, index: any) => (
		<View style={styles.row} key={index}>
			<View style={styles.bulletContainer}>
				<View style={styles.bullet}>
					<Text>{"\u2022" + " "}</Text>
				</View>
				<Text style={styles.bulletSubText}>{item.name}</Text>
			</View>
		</View>
	);
	const renderPlayerList = (item: any, index: any) => (
		<View style={styles.playerItem} key={index}>
			<Text>{item.username}</Text>
		</View>
	);
	return (
		<View>
			<SmallLineBreak />
			<TextSubTitle style={styles.titleGame}>Info</TextSubTitle>
			<View style={styles.textToMiddle}>
				{game ? <TextTitle>{game?.name}</TextTitle> : undefined}
				<SmallLineBreak />

				<Image
					style={styles.gameLogo}
					source={{
						uri: logoUrl,
					}}
				/>
				<SmallLineBreak />

				<TextSubTitle>Compétitions : </TextSubTitle>
				<SmallLineBreak />

				<View style={styles.column}>
					{game?.leagueIdList.map(
						(item: any, index: number) => {
							console.log(item, index);
							return renderBulletList(item, index);
						}
						//
					)}
				</View>

				<SmallLineBreak />
				<TextSubTitle>Code du Contest : </TextSubTitle>
				<SmallLineBreak />
				<TouchableOpacity
					onPress={() => {
						Clipboard.setString(joinCode);
					}}
				>
					<View style={{ flexDirection: "row" }}>
						<View style={styles.copyJoinCode}>
							<Text>{joinCode}</Text>
						</View>

						<View style={styles.copyJoinCodeIcon}>
							<Icon name="copy" size={20} color="#FFF" />
						</View>
					</View>
				</TouchableOpacity>

				<SmallLineBreak />
				<SubText>Ou bien partage le avec tes amis : </SubText>
				<SmallLineBreak />

				<TouchableOpacity onPress={onShare}>
					<View style={styles.share}>
						<Text style={{ color: "white" }}>Partager</Text>
					</View>
				</TouchableOpacity>

				<SmallLineBreak />
				<TextSubTitle>Joueurs : </TextSubTitle>
				<SmallLineBreak />

				<View style={styles.playerContainer}>
					{game?.userStats?.map((item: any, index: number) => {
						console.log(item, index);
						return renderPlayerList(item, index);
					})}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	titleGame: {
		fontSize: 22,
		fontWeight: "500",
	},
	gameLogo: {
		width: 100,
		height: 100,
		// display: "block",
		marginLeft: "auto",
		marginRight: "auto",
	},
	column: {
		flexDirection: "column",
		alignItems: "flex-start",
		width: 200,
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		flexWrap: "wrap",
		flex: 1,
	},
	bullet: {
		width: 10,
	},
	bulletContainer: {
		flexDirection: "row",
	},
	bulletSubText: { color: "black" },
	boldText: {
		fontWeight: "bold",
	},
	textToMiddle: {
		alignItems: "center",
	},
	separator: {
		marginVertical: 100,
		height: 1,
		width: "80%",
	},
	copyJoinCode: {
		borderRadius: 8,
		paddingVertical: 6,
		paddingHorizontal: 17,
		backgroundColor: "white",
		borderBottomRightRadius: 0,
		borderTopRightRadius: 0,
	},
	share: {
		borderRadius: 3,
		paddingVertical: 6,
		paddingHorizontal: 17,
		backgroundColor: "#115AEE",
	},
	copyJoinCodeIcon: {
		borderRadius: 8,

		borderBottomLeftRadius: 0,
		borderTopLeftRadius: 0,

		paddingVertical: 6,
		paddingHorizontal: 17,
		backgroundColor: "#115AEE",
	},
	playerContainer: {
		justifyContent: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		flex: 1,
	},
	playerItem: {
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 15,
		margin: 10,
		padding: 10,
		alignItems: "center",
		minWidth: "40%", // is 50% of container width
	},
});
