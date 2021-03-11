import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView, Image } from "react-native";
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
    SmallLineBreak,
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL, SERVER_LOGO_URL } from "../constants/Server";
import { GameSchema } from "../src/interaces/interfacesGame";
import { validURL } from "../src/smallFuncts";
import { FlatList } from "react-native-gesture-handler";

async function getCurrentGame(joinCode: string, jwt: string) {
    const rawResponse = await fetch(
        `${SERVER_API_URL}/getcurrentgameinfo?jwt=${jwt}&joinCode=${joinCode}`
    );
    const content = await rawResponse.json();

    return content;
}

export default function GameInfo({ navigation }: any) {
    // const { lastScreen } = route.params;, {route, navigation }: any

    const [jwt, setJwt] = useState<string>("");
    const [user, setUser] = useState<User>();
    const [joinCode, setJoinCode] = useState("");
    const [game, setGame] = useState<GameSchema>()

    const [logoUrl, setlogoUrl] = useState(SERVER_LOGO_URL);

    async function loadGameData() {

        if (jwt && joinCode) {

            let content = await getCurrentGame(joinCode, jwt)

            if (content.success == 1) {
                setGame(content.game);
                AsyncStorage.setItem("@game", JSON.stringify(content.game));
            } else {
                navigation.navigate("Dashboard");
            }

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


    //reload game data each time
    useEffect(() => {
        if (!game) loadGameData();

    }, [joinCode, jwt])

    useEffect(() => {

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
                        if (value != null) setGame(JSON.parse(value));
                    });
                    //and perform a in the use effect connected to jwt and joincode
                }
            } catch (e) {
                if (ENVIRONEMENT == "dev") alert(e);
            }
        }
    }, [])

    useEffect(() => {
        if(ENVIRONEMENT == "dev") console.log(game)
        
        if (game && game.logoUrl && validURL(game.logoUrl))
            setlogoUrl(game.logoUrl);
    }, [game])


    return (
        <View>
            <ProtectedHeader back={"Dashboard"} navigation={navigation} />
            <ViewContainer>
                <SmallLineBreak />
                <Text style={styles.titleGame}>Info</Text>

                <Image
                    style={styles.gameLogo}
                    source={{
                        uri: logoUrl,
                    }}
                />
                <Text>Compétitions : </Text>
                
                <View style={styles.column}>
                    <View style={styles.row}>
                        <View style={styles.bullet}>
                            <Text>{'\u2022' + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                            <Text>
                                <Text style={styles.boldText}> </Text>
                                <Text >{"there"}</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                {game ? <TextTitle>{game?.name}</TextTitle> : undefined}

                <Button title={"goto dash"} onPress={() => navigation.navigate("Dashboard")} />
            </ViewContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    titleGame: {
        fontSize: 22,
        fontWeight: "500",

    }, gameLogo: {
        width: 100,
        height: 100,
        // display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },
    column: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: 200
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        flex: 1
    },
    bullet: {
        width: 10
    },
    bulletText: {
        flex: 1
    },
    boldText: {
        fontWeight: 'bold'
    },
});
