import React, { useEffect, useState } from "react";
import BetForLeague from "./betforleague";
import { View } from "./Themed";

export default function AllBets(props: any) {
	const leagues = props.leagues;
	const filter = props.filter;
	const matchs = props.matchs;
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const isShow = props.isShow;
	const joinCode = props.joinCode;
	const setReloadCart = props.setReloadCart;

	return (
        <View>
			{leagues.map((league: any) => {
                //filter all the values
                if(filter.some((value: any) => value == league.leagueId) || filter.length == 0)
				return (
					<BetForLeague
						key={league.leagueName}
						isShow={isShow}
						setReloadCart={setReloadCart}
						joinCode={joinCode}
						callbackShowMatchBet={callbackShowMatchBet}
						leagueData={league}
						matchs={matchs.filter(
							(match: any) => match.leagueId == league.leagueId
						)}
					></BetForLeague>
				);
                else return undefined;
			})}
		</View>
	);
}
