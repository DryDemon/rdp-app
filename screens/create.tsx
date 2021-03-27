import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { User } from "../src/interaces/interfacesUsers";

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
	SubText,
	SmallLineBreak,
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL } from "../constants/Server";
import { LeagueSchema, SportSchema } from "../src/interaces/interfacesQuotes";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DatePicker } from "../components/DatePicker";
import { validURL } from "../src/smallFuncts";
import { GameHeader } from "../components/gameHeader";
import Colors from "../constants/Colors";

async function getSportBetweenTwoDates(startedAt: Date, endingAt: Date) {
	const startedAtTimestamp = startedAt.getTime() / 1000;
	const endingAtTimestamp = endingAt.getTime() / 1000;

	const rawResponse = await fetch(
		SERVER_API_URL +
			"/getsportsbetweentwodates?dateBegin=" +
			startedAtTimestamp +
			"&dateEnd=" +
			endingAtTimestamp
	);
	const content = await rawResponse.json();
	return content;
}

async function getLeaguesForSportsBetweenTwoDates(
	startedAt: Date,
	endingAt: Date,
	sportIds: Array<string>
) {
	const startedAtTimestamp = startedAt.getTime() / 1000;
	const endingAtTimestamp = endingAt.getTime() / 1000;

	//extract id from sports

	const rawResponse = await fetch(
		SERVER_API_URL +
			"/getleaguesbetweentwodatesbysports?dateBegin=" +
			startedAtTimestamp +
			"&dateEnd=" +
			endingAtTimestamp +
			"&sports=" +
			sportIds.toString()
	);
	const content = await rawResponse.json();

	return content;
}

export default function Create({ navigation }: any) {
	const [jwt, setJwt] = useState<string>("");
	const [user, setUser] = useState<User>();

	const [name, setName] = useState("");
	const [dateCreationForm, setDateCreationForm] = useState(
		ENVIRONEMENT == "dev" ? new Date(2014, 1, 1) : new Date()
	);
	const [dateEndForm, setDateEndForm] = useState(
		ENVIRONEMENT == "dev" ? new Date(2025, 1, 1) : new Date()
	);
	const [logoUrl, setLogoUrl] = useState("");

	const [alertName, setalertName] = useState(" ");
	const [alertLogo, setalertLogo] = useState(" ");
	const [alertDates, setalertDates] = useState(" ");
	const [alertLeagues, setalertLeagues] = useState(" ");

	const [canCreate, setcanCreate] = useState(true);

	const [leaguesList, setLeaguesList] = useState<any>([]);
	const [leaguesMultiselectChoice, setLeaguesMultiselectChoice] = useState<
		Array<LeagueSchema>
	>([]);

	const [sportShow, setSportShow] = useState(true);
	const [sportChoice, setSportChoice] = useState<string[]>(["1"]);

	if (!jwt || !user) {
		try {
			if (!jwt) {
				AsyncStorage.getItem("@jwt").then((value: string | null) => {
					if (value) setJwt(value);
				});
			}
			if (!user) {
				AsyncStorage.getItem("@user").then((value: string | null) => {
					if (value) setUser(JSON.parse(value));
				});
			}
		} catch (e) {
			if (ENVIRONEMENT == "dev") alert(e);
		}
	}

	function validateForm() {
		let isValid = true;
		if (name.length < 4) {
			if (name) {
				setalertName("Le nom doit faire au moins de 4 charactères");
			}
			isValid = false;
		} else {
			setalertName(" ");
		}

		if (logoUrl && !validURL(logoUrl)) {
			setalertLogo("Merci de rentrer un url valide.");
			isValid = false;
		} else {
			setalertLogo(" ");
		}

		if (dateCreationForm && dateEndForm) {
			let changeDateAlert = false;

			const dateDifference =
				(dateEndForm.getTime() - dateCreationForm.getTime()) /
				(3600 * 24 * 1000);

			if (dateDifference < 0) {
				setalertDates("La date de fin doit être après le début");
				changeDateAlert = true;
			}
			if (7 < dateDifference && ENVIRONEMENT != "dev") {
				setalertDates("Le contest ne peux pas durer plus de 7 jours");
				changeDateAlert = true;
			}

			if (!changeDateAlert) setalertDates(" ");
			else isValid = false;
		} else {
			isValid = false;
			setalertDates(" ");
		}

		if (leaguesMultiselectChoice && leaguesMultiselectChoice.length > 5) {
			setalertLeagues("Tu peux selectionner au maximum 5 leagues");
			isValid = false;
		} else setalertLeagues(" ");

		if (!leaguesMultiselectChoice) isValid = false;

		return isValid;
	}

	async function sendQueryCreateGame(query: string) {
		const rawResponse = await fetch(
			SERVER_API_URL + "/creategame?" + query
		);
		const content = await rawResponse.json();

		if (content.isCreated == 1) {
			gotoGame(content.joinCode);
		}

		return content;
	}

	function gotoGame(joinCode: string) {
		AsyncStorage.setItem("@joinCode", joinCode);
		navigation.navigate("Game");
	}

	function onCreate() {
		if (canCreate) {
			if (validateForm()) {
				setcanCreate(false);
				let query =
					"name=" +
					name +
					"&logoUrl=" +
					logoUrl +
					"&createdAt=" +
					dateCreationForm.getTime() / 1000 +
					"&endingAt=" +
					dateEndForm.getTime() / 1000 +
					"&sports=" +
					"1,13,18" +
					"&leagues=" +
					leaguesMultiselectChoice.toString() +
					`&jwt=${jwt}`;

				sendQueryCreateGame(query).then((content: any) => {
					if (content.isCreated == 0)
						Alert.alert("Erreur", "Merci de vérifier vos données");
					setcanCreate(true);
				});
			} else {
				Alert.alert(
					"Erreur",
					"Merci de remplir tout les champs obligatoires et de choisir au moins une ligue!"
				);
				setcanCreate(true);
			}
		}
	}

	useEffect(() => {
		validateForm();
	}, [
		name,
		logoUrl,
		leaguesMultiselectChoice,
		dateEndForm,
		dateCreationForm,
	]);

	useEffect(() => {
		let creationDateInFunct = new Date(dateCreationForm); // dateCreation est en fait un string
		let endDateInFunct = new Date(dateEndForm); // dateEnd est en fait un string

		if (
			!isNaN(creationDateInFunct.getTime()) &&
			!isNaN(endDateInFunct.getTime())
		) {
			getLeaguesForSportsBetweenTwoDates(
				creationDateInFunct,
				endDateInFunct,
				sportChoice
			).then((leagues) => {
				// code si on met tout d'un coup
				// setLeaguesList(leagues);

				// code si on ajoute plus de sports
				if (leagues) {
					setLeaguesList([
						{
							leagueName: "Foot",
							leagueId: 0,

							children: leagues.filter(
								(league: LeagueSchema) => league.sportId == "1"
							),
						},
						{
							leagueName: "Tennis",
							leagueId: 0,

							children: leagues.filter(
								(league: LeagueSchema) => league.sportId == "13"
							),
						},
						{
							leagueName: "BasketBall",
							leagueId: 0,

							children: leagues.filter(
								(league: LeagueSchema) => league.sportId == "18"
							),
						},
					]);
				}
			});
		}
	}, [dateCreationForm, dateEndForm, sportChoice]);

	function toggleSportChoiceId(id: string) {
		let cpySportChoice = [...sportChoice];

		if (cpySportChoice.some((value) => value == id)) {
			cpySportChoice = cpySportChoice.filter((value) => value != id);
		} else {
			cpySportChoice.push(id);
		}
		console.log(cpySportChoice);

		setSportChoice(cpySportChoice);
	}

	useEffect(() => {
		console.log(dateCreationForm, dateEndForm);
	}, [dateCreationForm, dateEndForm]);
	return (
		<View style={{ flex: 1, marginHorizontal: 1 }}>
			<GameHeader back={"Dashboard"} navigation={navigation} />
			<ViewContainer>
				<SmallLineBreak />
				<TextTitle>Créer un contest</TextTitle>
				<SubText>
					Crée ton contest et éclate tes amis pour devinir le roi !
				</SubText>

				<SmallLineBreak />

				<ScrollView showsHorizontalScrollIndicator={false}>
					<Text>Nom Du Contest</Text>
					<TextInput
						value={name}
						onChangeText={(name) => {
							setName(name);
						}}
						placeholder={"La Ligue Des Champions"}
					/>
					<TextWarning>{alertName}</TextWarning>

					<Text>Url Du Logo</Text>
					<TextInput
						value={logoUrl}
						onChangeText={(logoUrl) => {
							setLogoUrl(logoUrl);
						}}
						placeholder={
							"Optionnel, si tu veux un logo personalisé"
						}
					/>
					<TextWarning>{alertLogo}</TextWarning>

					<Text>Dates des évènements</Text>
					<SubText>
						Maximum 7 jours, le mode “contest pro” arrive bientôt !
					</SubText>

					<SmallLineBreak />

					<View style={{ flexDirection: "row" }}>
						<View style={{ flex: 1, marginRight: 12 }}>
							<DatePicker
								start={dateCreationForm}
								end={dateEndForm}
								setStart={setDateCreationForm}
								setEnd={setDateEndForm}
								initText={"Choisir les dates du contest"}
							/>
						</View>
					</View>
					<TextWarning>{alertDates}</TextWarning>

					<SmallLineBreak />
					<TouchableOpacity onPress={() => setSportShow(!sportShow)}>
						<Text>Sports : </Text>
					</TouchableOpacity>
					<View
						style={
							sportShow
								? { display: "flex" }
								: { display: "none" }
						}
					>
						<View>
							<TouchableOpacity
								style={
									sportChoice.some((value) => value == "1")
										? styles.sportChoiceSelected
										: styles.sportChoiceUnselected
								}
								onPress={() => {
									toggleSportChoiceId("1");
								}}
							>
								<SubText
									style={
										sportChoice.some(
											(value) => value == "1"
										)
											? styles.sportChoiceTextSelected
											: styles.sportChoiceTextUnselected
									}
								>
									- Foot
								</SubText>
							</TouchableOpacity>
							<TouchableOpacity
								style={
									sportChoice.some((value) => value == "13")
										? styles.sportChoiceSelected
										: styles.sportChoiceUnselected
								}
								onPress={() => {
									toggleSportChoiceId("13");
								}}
							>
								<SubText
									style={
										sportChoice.some(
											(value) => value == "13"
										)
											? styles.sportChoiceTextSelected
											: styles.sportChoiceTextUnselected
									}
								>
									- Tennis
								</SubText>
							</TouchableOpacity>
							<TouchableOpacity
								style={
									sportChoice.some((value) => value == "18")
										? styles.sportChoiceSelected
										: styles.sportChoiceUnselected
								}
								onPress={() => {
									toggleSportChoiceId("18");
								}}
							>
								<SubText
									style={
										sportChoice.some(
											(value) => value == "18"
										)
											? styles.sportChoiceTextSelected
											: styles.sportChoiceTextUnselected
									}
								>
									- Basketball
								</SubText>
							</TouchableOpacity>
						</View>
					</View>

					<SmallLineBreak />

					<Text>Choix des compétitions</Text>
					<SubText>
						Attention futur roi, tu peux sélectionner au maximum 5
						compétitions !
					</SubText>

					<View>
						<SectionedMultiSelect
							selectText="Cherche ta compétition"
							confirmText="Confirmer"
							selectedText="Selectionné"
							searchPlaceholderText="Chercher une ligue"
							removeAllText="Tout enlever"
							noResultsComponent={
								<Text style={styles.alertMultiSelect}>
									Pas de compétition de ce nom là :/
								</Text>
							}
							noItemsComponent={
								<Text style={styles.alertMultiSelect}>
									Pas de compétition entre ces dates. As tu
									bien choisi des dates?
								</Text>
							}
							readOnlyHeadings={true}
							icons={undefined}
							IconRenderer={Icon}
							single={false}
							items={leaguesList}
							showDropDowns={true}
							subKey="children"
							displayKey="leagueName"
							uniqueKey="leagueId"
							selectedItems={leaguesMultiselectChoice}
							onSelectedItemsChange={(choice: any) => {
								setLeaguesMultiselectChoice(choice);
							}}
						/>
					</View>
					<TextWarning>{alertLeagues}</TextWarning>

					<Button title={"Creer"} onPress={() => onCreate()} />
					<View
						style={styles.separator} //forandroid manly
					></View>
				</ScrollView>
			</ViewContainer>
		</View>
	);
}

const styles = StyleSheet.create({
	alertMultiSelect: {
		marginTop: 20,
		textAlign: "center",
	},
	separator: {
		marginVertical: 60,
		height: 1,
		width: "80%",
	},
	sportChoiceSelected: {
		flex: 1,
		backgroundColor: Colors.rdpColor,
		borderRadius: 8,
		paddingVertical: 3,
		paddingHorizontal: 5,
		margin: 5,
	},
	sportChoiceTextSelected: {
		color: "white",
		margin: 5,
	},
	sportChoiceTextUnselected: {
		color: "black",
		margin: 5,
	},

	sportChoiceUnselected: {
		backgroundColor: Colors.revertRdpColor,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
});
