import React, { useEffect, useState } from "react";
import BetForMatch from "./betformatch";
import { SmallLineBreak, TextTitle, View } from "./Themed";

export default function BetForLeague(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;

	return (
		<View>
			<TextTitle>{props.leagueData?.leagueName}</TextTitle>
			<SmallLineBreak />

			{props.matchs.map((match: any) => (
				<BetForMatch
					callbackShowMatchBet={callbackShowMatchBet}
					key={match.matchId}
					matchData={match}
				></BetForMatch>
			))}
		</View>
	);
}
