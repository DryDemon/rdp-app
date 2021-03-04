import * as React from "react";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";

import {
  Text,
  View,
  TextInput,
  Button,
  TextMainTitle,
  TextTitle,
  TextLabel,
  ViewContainer,
  ViewCenter,
} from "../components/Themed";

export default function TabTwoScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onLogin() {
    Alert.alert("Credentials", `${username} + ${password}`);
  }

  return (
    <ViewContainer>
      <TextTitle>Bienvenu parmi nous,</TextTitle>
      <TextMainTitle>Futur Roi</TextMainTitle>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TextLabel>Nom</TextLabel>
      <TextInput
        value={username}
        onChangeText={(username) => setUsername(username)}
        placeholder={"Mon nom"}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(password) => setPassword(password)}
        placeholder={"Password"}
        secureTextEntry={true}
        style={styles.input}
      />

      <Button title={"Login"} onPress={onLogin} />
    </ViewContainer>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
  },
});
