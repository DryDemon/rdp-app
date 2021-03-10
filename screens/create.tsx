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
    SubText,
    SmallLineBreak,
} from "../components/Themed";
import { ENVIRONEMENT } from "../constants/Environement";
import { SERVER_API_URL } from "../constants/Server";
import { LeagueSchema, SportSchema } from "../src/interaces/interfacesQuotes";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { DatePicker } from "../components/DatePicker";




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
    const endingAtTimestamp = 1622160000;
    const startedAtTimestamp = 1609286400;
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
    const [dateCreationForm, setDateCreationForm] = useState(new Date());
    const [dateEndForm, setDateEndForm] = useState(new Date());
    const [logoUrl, setLogoUrl] = useState("");

    const [alertName, setalertName] = useState(" ");

    const [leaguesList, setLeaguesList] = useState<any>([]);
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

            //code si on ajoute plus de sports
            // setLeaguesList([
            //     {
            //         leagueName: 'Foot',
            //         leagueId: 0,

            //         children: leagues,
            //     },

            // ]);
        });

    }, [])


    return (
        <View>
            <ProtectedHeader back={"Dashboard"} navigation={navigation} />
            <ViewContainer>
                <SmallLineBreak />
                <TextTitle>Créer un contest</TextTitle>
                <SubText>Crée ton contest et éclate tes amis pour devinir le roi !</SubText>

                <SmallLineBreak />

                <Text>Nom Du Contest</Text>
                <TextInput
                    value={name}
                    onChangeText={(name) => {
                        setName(name);
                    }}
                    placeholder={"La Ligue Des Champions"}
                />
                <TextWarning>{alertName}</TextWarning>

                <Text>Dates des évènements</Text>
                <SubText>Maximum 7 jours, le mode “contest pro” arrive bientôt !</SubText>
                
                <SmallLineBreak/>

                <View style={{ flexDirection: "row" }}>
                    <View style={{flex:1, marginRight:12}} >
                        <DatePicker
                            value={dateCreationForm}
                            onChange={(date: Date) => setDateCreationForm(date)}
                            initText={"Date de Début"}
                        />
                    </View>
                    <View style={{flex:1, marginLeft:12}} >
                        <DatePicker
                            value={dateEndForm}
                            onChange={(date: Date) => setDateEndForm(date)}
                            initText={"Date de Fin"}
                        />
                    </View>
                </View>


                <View>

                    <SectionedMultiSelect icons={undefined} IconRenderer={Icon} single={false} items={leaguesList} showDropDowns={false} subKey="children" displayKey="leagueName" uniqueKey="leagueId" selectedItems={leaguesMultiselectChoice} onSelectedItemsChange={(choice: any) => { console.log(choice); setLeaguesMultiselectChoice(choice) }} />

                </View>

                <Button title={"send"} onPress={() => console.log(leaguesMultiselectChoice)} />

            </ViewContainer>
        </View>
    );
}

const styles = StyleSheet.create({
});
