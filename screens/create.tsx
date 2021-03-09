import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";
import { User } from "../src/interaces/interfacesUsers";

import {
	ProtectedHeader,
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
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL } from "../constants/Server";

export default function Dashboard({ navigation }: any) {
	const [jwt, setJwt] = useState<string>("");
	const [user, setUser] = useState<User>();


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


	return (
		<View>
			<ProtectedHeader />
			<ViewContainer>

			</ViewContainer>
		</View>
	);
}

const styles = StyleSheet.create({
});
