import React, { useEffect, useState } from "react";
import BetForLeague from "./betforleague"
import { View } from "./Themed";



export default function AllBets(props: any) {
    const leagues = props.leagues;
    const matchs = props.matchs;

    return (
        <View>

                {leagues.map((league: any) => <BetForLeague key={league.leagueName} leagueData={league} matchs={matchs.filter((match: any) => match.leagueId == league.leagueId)}></BetForLeague>)}

        </View>
        )
    }
