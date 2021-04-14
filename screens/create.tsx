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
	TextHeadline,
	ViewContainer,
	ViewCenter,
	TextWarning,
	LineBreak,
	SubText,
	SmallLineBreak,
	BasicScrollView,
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL } from "../constants/Server";
import { LeagueSchema, SportSchema } from "../src/interaces/interfacesQuotes";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { DatePicker } from "../components/DatePicker";
import { validURL } from "../src/smallFuncts";
import { GameHeader } from "../components/gameHeader";
import Colors from "../constants/Colors";
import { LoadingPage } from "../components/loadingPage";
import RNPickerSelect from "react-native-picker-select";
import NotFoundScreen from "./NotFoundScreen";
import { CheckBox } from "../components/checkBox";
import Entypo from "@expo/vector-icons/build/Entypo";
import AllBets from "../components/allbets";

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
	sport: string | undefined
) {
	const startedAtTimestamp = startedAt.getTime() / 1000;
	const endingAtTimestamp = endingAt.getTime() / 1000;

	//extract id from sports
	if (sport && startedAt && endingAt) {
		const rawResponse = await fetch(
			SERVER_API_URL +
				"/getleaguesbetweentwodatesbysports?dateBegin=" +
				startedAtTimestamp +
				"&dateEnd=" +
				endingAtTimestamp +
				"&sports=" +
				sport
		);
		const content = await rawResponse.json();

		return content;
	}
	return undefined;
}

interface leagueDisplay {
	leagueName: string;
	leagueId: string;
	selected: boolean;
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
	const [loading, setLoading] = useState(false);

	const [leaguesList, setLeaguesList] = useState<any>([]);

	const [leagueSearch, setLeagueSearch] = useState("");
	const [leaguesSearchDisplay, setLeaguesSearchDisplay] = useState<
		leagueDisplay[]
	>([]);
	const [showMoreLeaguesDisplay, setshowMoreLeaguesDisplay] = useState(false);

	const [sportShow, setSportShow] = useState<string | undefined>(undefined);

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
			if (8 < dateDifference && ENVIRONEMENT != "dev") {
				setalertDates("Le contest ne peut pas durer plus de 8 jours");
				changeDateAlert = true;
			}

			if (!changeDateAlert) setalertDates(" ");
			else isValid = false;
		} else {
			isValid = false;
			setalertDates(" ");
		}

		if (
			leaguesSearchDisplay &&
			leaguesSearchDisplay.filter(
				(value: leagueDisplay) => value.selected
			).length > 5
		) {
			setalertLeagues("Tu peut selectionner au maximum 5 ligues");
			isValid = false;
		} else setalertLeagues(" ");

		if (
			leaguesSearchDisplay &&
			leaguesSearchDisplay.filter(
				(value: leagueDisplay) => value.selected
			).length == 0
		) {
			setalertLeagues("Tu dois selectionner au moins une ligue");
			isValid = false;
		} else setalertLeagues(" ");

		if (!leaguesSearchDisplay) isValid = false;
		return isValid;
	}

	useEffect(() => {
		//load leagueSearch
		console.log(leaguesList);
		let filterList = leaguesList.filter(
			(league: any) =>
				league.leagueName.indexOf(leagueSearch) != -1 ||
				leagueSearch.indexOf(league.leagueName) != -1
		);
		if (leagueSearch == "") filterList = leaguesList;

		let displayLeagueReplacer: leagueDisplay[] = [];
		for (let league of leaguesList) {
			let selected = leaguesSearchDisplay.some(
				(value: leagueDisplay) =>
					value.leagueId == league.leagueId && value.selected
			);
			let leagueDisplayTemp = {
				leagueName: league.leagueName,
				leagueId: league.leagueId,
				selected,
			};
			displayLeagueReplacer.push(leagueDisplayTemp);
		}

		setLeaguesSearchDisplay(displayLeagueReplacer);
	}, [leagueSearch, leaguesList]);

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
				setLoading(true);
				setcanCreate(false);
				let leaguesIdsList = "";
				for (let league of leaguesSearchDisplay) {
					if (league.selected) {
						if (leaguesIdsList != "") {
							leaguesIdsList += ",";
						}
						leaguesIdsList += league.leagueId;
					}
				}
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
					leaguesIdsList +
					`&jwt=${jwt}`;

				sendQueryCreateGame(query)
					.then((content: any) => {
						if (content.isCreated == 0)
							Alert.alert(
								"Erreur",
								"Merci de vérifier vos données"
							);
						setcanCreate(true);
						setLoading(false);
					})
					.catch((e) => setLoading(true));
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
	}, [name, logoUrl, leaguesSearchDisplay, dateEndForm, dateCreationForm]);

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
				sportShow
			).then((leagues) => {
				if (leagues) {
					setLeaguesList(leagues);

					let cpyleagueDisplay = leaguesSearchDisplay;
					//on enleve les leagues qui ne sont plus dispo aux dates choisis ou aux sports choisis
					cpyleagueDisplay = cpyleagueDisplay.filter(
						(valueFrom: leagueDisplay) =>
							leagues.some(
								(valueTo: LeagueSchema) =>
									valueTo.leagueId == valueFrom.leagueId
							)
					);
					setLeaguesSearchDisplay(cpyleagueDisplay);
				}
			});
		}
	}, [dateCreationForm, dateEndForm, sportShow]);

	// function toggleSportChoiceId(id: string) {
	// 	let cpySportChoice = [...sportChoice];

	// 	if (cpySportChoice.some((value) => value == id)) {
	// 		cpySportChoice = cpySportChoice.filter((value) => value != id);
	// 	} else {
	// 		cpySportChoice.push(id);
	// 	}
	// 	console.log(cpySportChoice);

	// 	setSportChoice(cpySportChoice);
	// }

	useEffect(() => {
		console.log(dateCreationForm, dateEndForm);
	}, [dateCreationForm, dateEndForm]);

	function toggleLeaguesDisplaySelect(leagueId: string) {
		Alert.alert("there", leagueId + "");

		let leaguesSearchDisplaycpy = leaguesSearchDisplay;
		for (let i = 0; i < leaguesSearchDisplaycpy.length; i++) {
			if (leaguesSearchDisplaycpy[i].leagueId == leagueId) {
				leaguesSearchDisplaycpy[i].selected = !leaguesSearchDisplaycpy[
					i
				].selected;
			}
		}

		setLeaguesSearchDisplay([...leaguesSearchDisplaycpy]);
	}

	if (!loading)
		return (
			<View style={{ flex: 1, marginHorizontal: 1 }}>
				<GameHeader back={"Dashboard"} navigation={navigation} />
				<ViewContainer>
					<BasicScrollView>
						<View style={{ marginVertical: 24 }}>
							<TextTitle>Créer un contest</TextTitle>
							<SubText>
								Crée ton contest et éclate tes amis pour devenir
								le roi!
							</SubText>
						</View>

						<View style={{ marginVertical: 24 }}>
							<TextHeadline style={{ marginBottom: 12 }}>
								Nom Du Contest
							</TextHeadline>
							<View style={{ marginVertical: 12 }}>
								<TextInput
									value={name}
									onChangeText={(name) => {
										setName(name);
									}}
									placeholder={"La Ligue Des Champions"}
								/>
								<TextWarning>{alertName}</TextWarning>
							</View>

							<TextHeadline style={{ marginVertical: 12 }}>
								Url Du Logo
							</TextHeadline>
							<View style={{ marginTop: 12 }}>
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
							</View>
						</View>

						<View style={{ marginVertical: 24 }}>
							<View>
								<TextHeadline>
									Dates des évènements
								</TextHeadline>
								<SubText>
									Maximum 7 jours, le mode “contest pro”
									arrive bientôt !
								</SubText>
							</View>

							<View
								style={{ flexDirection: "row", marginTop: 24 }}
							>
								<View style={{ flex: 1 }}>
									<DatePicker
										start={dateCreationForm}
										end={dateEndForm}
										setStart={setDateCreationForm}
										setEnd={setDateEndForm}
										initTextBegin={"Date de début"}
										initTextEnd={"Date de fin"}
									/>
								</View>
							</View>
							<TextWarning>{alertDates}</TextWarning>
						</View>

						<View style={{ marginVertical: 24 }}>
							<Text>Choix des compétitions</Text>
							<SubText>
								Attention futur roi, tu peut sélectionner au
								maximum 5 compétitions !
							</SubText>
							<RNPickerSelect
								style={DropDownPickerStyleSheep}
								useNativeAndroidPickerStyle={false}
								onValueChange={(value) => {
									setSportShow(value);
								}}
								items={[
									{
										label: "Tous les sports",
										value: ["1, 18, 13"],
									},
									{ label: "Football", value: "1" },
									{ label: "Tennis", value: "13" },
									{ label: "Basketball", value: "18" },
								]}
							/>
							<TextInput
								style={styles.inputSearch}
								value={leagueSearch}
								onChangeText={(value: string) => {
									setLeagueSearch(value);
								}}
								placeholder={"Cherche ta compétition"}
							/>
							{leaguesSearchDisplay.map(
								(value: leagueDisplay, index: number) =>
									index < 5 || showMoreLeaguesDisplay ? (
										<TouchableOpacity
											onPress={() => {
												toggleLeaguesDisplaySelect(
													value.leagueId
												);
											}}
											style={
												value.selected
													? styles.leagueSearchContainerSelected
													: styles.leagueSearchContainerUnselected
											}
										>
											<CheckBox reverted={true} value={value.selected} />
											
											<Text
												style={
													value.selected
														? styles.leagueSearchTextSelected
														: styles.leagueSearchTextUnselected
												}
											>
												{value.leagueName}
											</Text>
										</TouchableOpacity>
									) : null
							)}
							{leaguesSearchDisplay.length != 0 ? (
								<View style={styles.showMoreLeaguesContainer}>
									<TouchableOpacity
										style={styles.showMoreLeagues}
										onPress={() =>
											setshowMoreLeaguesDisplay(
												!showMoreLeaguesDisplay
											)
										}
									>
										<Text
											style={{
												fontWeight: "500",
												fontSize: 16,
											}}
										>
											{showMoreLeaguesDisplay
												? "Voir Moins"
												: "Voir Plus"}
										</Text>
									</TouchableOpacity>
								</View>
							) : null}
						</View>

						<View style={styles.selectedLeaguesContainer}>
							<Text style={{ marginBottom: 8 }}>
								Sélectionnées
							</Text>
							<View
								style={{
									flexDirection: "row",
									flexWrap: "wrap",
								}}
							>
								{leaguesSearchDisplay
									.filter(
										(value: leagueDisplay) => value.selected
									)
									.map((league: leagueDisplay) => (
										<TouchableOpacity
											style={
												styles.simpleSelectedLeagueContainer
											}
											onPress={() =>
												toggleLeaguesDisplaySelect(
													league.leagueId
												)
											}
										>
											<Text>{league.leagueName}</Text>{" "}
											<Entypo
												// style={styles.icon}
												name="cross"
												size={24}
												color={"#000"}
											/>
										</TouchableOpacity>
									))}
							</View>
						</View>

						<TextWarning>{alertLeagues}</TextWarning>

						<Button title={"Creer"} onPress={() => onCreate()} />
						<View
							style={styles.separator} //forandroid manly
						></View>
					</BasicScrollView>
				</ViewContainer>
			</View>
		);
	else
		return (
			<View style={{ flex: 1, marginHorizontal: 1 }}>
				<GameHeader back={"Dashboard"} navigation={navigation} />
				<ViewContainer>
					<LoadingPage />
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
		borderRadius: 12,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	DropDownPicker: {
		height: 46,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginVertical: 10,
		marginTop: 18,
		fontSize: 17,
		backgroundColor: Colors.grayPlaceHolder,
		color: Colors.grayPlaceHolder,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,

		elevation: 4,
	},
	leagueSearchContainerUnselected: {
		minHeight: 50,
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,
		marginVertical: 6,
		backgroundColor: Colors.blue,
		flexDirection: "row",
		alignItems: "center",
	},
	leagueSearchContainerSelected: {
		height: 50,
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,
		marginVertical: 6,
		backgroundColor: Colors.orange,
		flexDirection: "row",
		alignItems: "center",
	},
	leagueSearchTextUnselected: {
		color: "black",
		marginLeft: 24,
	},
	leagueSearchTextSelected: {
		color: "white",
		marginLeft: 24,
	},
	showMoreLeaguesContainer: {
		padding: 12,
		alignItems: "center",
	},
	showMoreLeagues: {
		borderRadius: 8,
		padding: 8,
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: Colors.rose,
		display: "flex",
		minWidth: 88,
	},
	selectedLeaguesContainer: {
		backgroundColor: Colors.white,
		padding: 12,
		marginBottom: 48,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,
		elevation: 4,
	},
	simpleSelectedLeagueContainer: {
		borderRadius: 8,
		backgroundColor: Colors.blue,
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginVertical: 4,
		marginRight: 8,
		flexDirection: "row",
		alignItems: "center",
	},
	inputSearch: {
		marginVertical: 6,
	},
});

const DropDownPickerStyleSheep = StyleSheet.create({
	inputIOS: {
		height: 46,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginBottom: 6,
		marginTop: 24,
		fontSize: 17,
		backgroundColor: Colors.white,
		color: Colors.grayPlaceHolder,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,

		elevation: 4,
	},
	inputAndroid: {
		height: 46,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginBottom: 6,
		marginTop: 24,
		fontSize: 17,
		backgroundColor: Colors.white,
		color: Colors.grayPlaceHolder,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,

		elevation: 4,
	},
	inputWeb: {
		height: 46,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginBottom: 6,
		marginTop: 24,
		fontSize: 17,
		backgroundColor: Colors.white,
		color: Colors.grayPlaceHolder,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.32,
		shadowRadius: 2.46,

		elevation: 4,
	},
});
