import React, { useEffect, useState } from "react";
import BetForMatch from "./betformatch";
import { SmallLineBreak, TextTitle, View } from "./Themed";

export default function BetForLeague(props: any) {
	const callbackShowMatchBet = props.callbackShowMatchBet;
	const reloadCart = props.reloadCart;
	const joinCode = props.joinCode;
	const setReloadCart = props.setReloadCart;

	return (
		<View>
			<TextTitle>{props.leagueData?.leagueName}</TextTitle>
			<SmallLineBreak />

			{props.matchs.map((match: any) => (
				<BetForMatch
					reloadCart={reloadCart}
					joinCode={joinCode}
					setReloadCart={setReloadCart}
					callbackShowMatchBet={callbackShowMatchBet}
					key={match.matchId}
					matchData={match}
				></BetForMatch>
			))}
		</View>
	);
}
