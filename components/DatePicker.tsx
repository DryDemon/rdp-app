import React, { useState } from "react";
import { View, Text, TextTitle, SubText } from "./Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import format from 'date-fns/format'

import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from "../constants/Colors";

export function DatePicker(props: any) {

    const [showDatePicker, setshowDatePicker] = useState(false);
    const [beenSet, setbeenSet] = useState(false);

    return (

        <TouchableOpacity style={styles.dateContainer} onPress={() => { setshowDatePicker(true); }}>
            <View style={{ flexDirection: "row" }}>
                <View>
                    <Icon style={styles.gameLogo} name="calendar" size={20} color="#FFF"  />
                </View>
                <View >
                    {!beenSet && (<Text style={styles.text}>{props.initText}</Text>)}
                    {beenSet && (<Text style={styles.text}>{format(props.value, 'dd/MM/yyyy')}</Text>)}
                </View>
            </View>

            {showDatePicker && (<DateTimePicker
                testID="dateTimePicker"
                value={props.value}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={(event: any, value: Date | undefined) => {
                    setshowDatePicker(false);
                    if (value) {
                        setbeenSet(true);
                        props.onChange(value)
                    }
                }}
            />)}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dateContainer: {
        height: 48,
        padding: 5,
        borderRadius: 8,
        maxWidth: 200,
        paddingVertical: 14,
        backgroundColor: Colors.rdpColor,
    },
    gameLogo: {
        marginLeft: "auto",
        marginRight: "auto",
    },
    text: {
        marginHorizontal:10,
        color: "white",
        fontSize: 14
    },

});
