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

async function getCurrentGame(joinCode: string, jwt: string) {
    const rawResponse = await fetch(
        `${SERVER_API_URL}/getcurrentgameinfo?jwt=${jwt}&joinCode=${joinCode}`
    );
    const content = await rawResponse.json();

    return content;
}

export default function GamePrincipal({ navigation }: any) {
    const [jwt, setJwt] = useState<string>("");
    const [user, setUser] = useState<User>();
    const [joinCode, setJoinCode] = useState("");
    const [game, setGame] = useState({})

    async function loadGameData() {
        if (jwt && joinCode) {

            let content = await getCurrentGame(joinCode, jwt)

            if (content.success == 1) {
                setGame(content);
                AsyncStorage.setItem("@game", content);
            } else {
                navigation.navigate("Dashboard");
            }

        } else {
            setTimeout(function () {

                checkIfConnected()

            }, 3000);
        }

    }

    function checkIfConnected() {
        if (!jwt || !user) {
            navigation.navigate("Login");
        }
        if (!joinCode) {
            navigation.navigate("Dashboard");
        }
    }

    if (!jwt || !user || !joinCode || !game) {
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
            if (!joinCode) {
                AsyncStorage.getItem("@joinCode").then((value: string | null) => {
                    if (value) setJoinCode(value);
                });
            }
            if (!game) {
                //store it to get a better loading time
                AsyncStorage.getItem("@game").then((value: string | null) => {
                    if (value) setGame(JSON.parse(value));
                    else getCurrentGame(joinCode, jwt).then((content: any) => {
                        loadGameData()
                    });
                });
            }
        } catch (e) {
            if (ENVIRONEMENT == "dev") alert(e);
        }
    }
    //reload game data each time
    useEffect(() => {
        loadGameData();
    }, [])

    //onFocus
    navigation.addListener('focus', () => {
        // The screen is focused
        // Call any action

    });

    return (
        <View>
            <ProtectedHeader />
            <ViewContainer>

                <Text>{joinCode}</Text>

                <Button title={"goto dash"} onPress={() => navigation.navigate("Dashboard")} />
            </ViewContainer>
        </View>
    );
}

const styles = StyleSheet.create({
});
