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
import { LeagueSchema, SportSchema } from "../src/interaces/interfacesQuotes";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons'

async function getSportBetweenTwoDates(startedAt: Date, endingAt: Date) {
    const startedAtTimestamp = startedAt.getTime() / 1000;
    const endingAtTimestamp = endingAt.getTime() / 1000;

    const rawResponse = await fetch(SERVER_API_URL +
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
    // const startedAtTimestamp = startedAt.getTime() / 1000;
    // const endingAtTimestamp = endingAt.getTime() / 1000;
    const endingAtTimestamp = 999999999999999999;
    const startedAtTimestamp = 0;
    //extract id from sports

    const rawResponse = await fetch(SERVER_API_URL +
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


async function sendRequestCreateGame(query: string) {
    const rawResponse = await fetch("/api/creategame?" + query);
    const content = await rawResponse.json();
    if (content.isCreated == 1) {
        alert(content.redirect)
        //   window.location.href = content.redirect;
        // redirect(content.redirect);
    }

    return content;
}



export default function Dashboard({ navigation }: any) {
    const [jwt, setJwt] = useState<string>("");
    const [user, setUser] = useState<User>();

    const [name, setName] = useState("");
    const [dateCreationForm, setDateCreationForm] = useState("");
    const [dateEndForm, setDateEndForm] = useState("");
    const [logoUrl, setLogoUrl] = useState("");

    const [leaguesList, setLeaguesList] = useState<Array<LeagueSchema>>([]);
    const [leaguesMultiselectChoice, setLeaguesMultiselectChoice] = useState<Array<LeagueSchema>>([]);


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
                ["1"]
            ).then((leagues) => {
                setLeaguesList(leagues);
            });
        }
    }, [dateCreationForm, dateEndForm]);

    useEffect(() => {

        getLeaguesForSportsBetweenTwoDates(
            new Date(),
            new Date(),
            ["1"]
        ).then((leagues) => {
            setLeaguesList(leagues);
        });

    }, [])


    return (
        <View>
            <ProtectedHeader back={"Dashboard"} navigation={navigation} />
            <ViewContainer>
                <View>

                    <SectionedMultiSelect icons={undefined} IconRenderer={Icon} items={leaguesList} uniqueKey="leagueId" onSelectedItemsChange={(choice: any) => setLeaguesMultiselectChoice(choice)} />
                </View>
                <Button title={"goto dash"} onPress={() => navigation.navigate("Dashboard")} />

            </ViewContainer>
        </View>
    );
}

const styles = StyleSheet.create({
});
