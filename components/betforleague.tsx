import React, { useEffect, useState } from "react";
import { MatchSchema } from "../src/interaces/interfacesQuotes";
import BetForMatch from "./betformatch";
import { SmallLineBreak, TextTitle, View } from "./Themed";

export default function BetForLeague(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const joinCode = props.joinCode;
	const betChoiceListGroup = props.betChoiceListGroup;

	return (
		<View>
			<TextTitle>{props.leagueData?.leagueName}</TextTitle>
			<SmallLineBreak />

			{props.matchs
				.sort((a: MatchSchema, b: MatchSchema) =>
					a.liveId ? 1 : b.liveId ? -1 : 1
				)
				.map((match: any) => (
					<BetForMatch
						joinCode={joinCode}
						betChoiceListGroup={betChoiceListGroup}
						callbackShowMatchBet={callbackShowMatchBet}
						key={match.matchId}
						matchData={match}
					></BetForMatch>
				))}
		</View>
	);
}
