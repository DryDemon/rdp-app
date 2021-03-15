import React, { useEffect, useState } from "react";
import { View, Text } from "./Themed";

function isEmptyObject(obj: any) {
    if(obj){
        return !Object.keys(obj).length;
    }
    return false
}


export default function basicBet(props: any) {


    const odds = props.bet?.odds;

    if(odds && !isEmptyObject(odds))
        return (
            <View>

                <View>{props.bet?.name}</View>

                <View>
                    {odds.map((odd: any) => <View key={odd.id}><Text>{odd.header?odd.header + " ":"" }{ odd.name + " : " + odd.odds}</Text></View>)}
                </View>
            </View>

        )
    else
        return (<></>)
}
