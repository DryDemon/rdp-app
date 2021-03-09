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

async function addUserInAGame(joinCode: string, jwt: string) {
    const rawResponse = await fetch(
        `/api/adduserinagame?joinCode=${joinCode}&jwt=${jwt}`
    );
    const content = await rawResponse.json();
    return content;
}

export function MyLeaguesDash(props: any) {
    const [page, setPage] = useState(1); //0 : en cours, 1 : rejoindre
    const [joinCode, setJoinCode] = useState("");
    const [alertJoinCode, setAlertJoinCode] = useState(" ");
    const [outData, setOutData] = useState(<View></View>); //0 : en cours, 1 : rejoindre

    const games: Array<GameSchema> = props.games;
    const navigation: any = props.navigation;
    const jwt: any = props.jwt;

    function gotoGame(joinCode: string) {
        AsyncStorage.setItem("@joinCode", joinCode);
        navigation.navigate("GamePrincipal")
    }

    function inGame() {
        setPage(0);
    }

    function joinGame() {
        setPage(1);
    }

    function createGame() {
        navigation.navigate("Create");
    }

    function onJoinGame() {
        if (joinCode) {
            addUserInAGame(joinCode, jwt).then((content: any) => {
                if (content.success == 0) setAlertJoinCode(content.error);
                else navigation.navigate("GamePrincipal");
            });
        }
    }

    useEffect(() => {
        if (games && games.length != 0) setPage(0);
    }, [games]);

    useEffect(() => {
        if (page == 0)
            setOutData(
                <View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <Text onPress={inGame}>En Cours</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={styles.linkNotChoosed}
                                onPress={joinGame}
                            >
                                Rejoindre
							</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <Button title={"+ Créer"} onPress={createGame} />
                        </View>
                    </View>
                    <SmallLineBreak />

                    <ScrollView horizontal={true}>
                        <GameIcon create={1} navigation={navigation} />
                        {games.map((data: any) => {
                            return <GameIcon key={data.joinCode} game={data} navigation={navigation} />;
                        })}
                    </ScrollView>
                </View>
            );
        else
            setOutData(
                <View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={styles.linkNotChoosed}
                                onPress={inGame}
                            >
                                En Cours
							</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text onPress={joinGame}>Rejoindre</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <Button title={"+ Créer"} onPress={createGame} />
                        </View>
                    </View>
                    <SmallLineBreak />

                    <Text>
                        Rejoint un contest existant et éclate tes amis !
					</Text>

                    <SubText>Et oublies pas, devient le roi ! </SubText>

                    <TextInput
                        value={joinCode}
                        onChangeText={(a) => {
                            setJoinCode(a);
                        }}
                        placeholder={"Rentre ton code de 6 lettres"}
                    />
                    <TextWarning>{alertJoinCode}</TextWarning>

                    <Button title={"Rejoindre"} onPress={onJoinGame} />
                </View>
            );
    }, [page, games]);

    return (
        <View>
            <TextTitle>Mes Contests</TextTitle>
            <SmallLineBreak />
            {outData}
            <LineBreak />
        </View>
    );
}

const styles = StyleSheet.create({
    linkNotChoosed: { color: "gray" },
});
