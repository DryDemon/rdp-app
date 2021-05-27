import * as React from "react";
import { useState, useEffect } from "react";
import { Image, Alert, StyleSheet, ScrollView } from "react-native";
import { SERVER_API_URL } from "../constants/Server";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  TextWarning,
  LineBreak,
  BasicScrollView,
  ValidedButton,
  SubText,
} from "../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import Colors from "../constants/Colors";

export default function Register({ navigation, route: { params } }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alertUsername, setAlertUsername] = useState(" ");
  const [alertEmail, setAlertEmail] = useState(" ");
  const [alertPassword, setAlertPassword] = useState(" ");
  const [alertConfirmPassword, setAlertConfirmPassword] = useState(" ");

  const validateEmailRegexStr =
    "^[A-za-z0-9._%+-]+@[A-za-z.-]+\\.[A-za-z]{2,4}$";
  const validateEmailRegex = new RegExp(validateEmailRegexStr);

  useEffect(() => {
    checkForm();
  }, [password, confirmPassword, email]);
  useEffect(() => {
    checkUsername();
  }, [username]);

  //redirect ifconnected
  useEffect(() => {
    AsyncStorage.getItem("@jwt").then((value: string | null) => {
      if (value) {
        let jwt = value;
        AsyncStorage.getItem("@user").then((value: string | null) => {
          if (value) {
            let user = value;
            if (jwt && user) {
              navigation.navigate("Dashboard");
            }
          }
        });
      }
    });
  }, []);

  async function sendDataRegisterUser(
    username: string,
    password: string,
    email: string
  ) {
    const rawRep = await fetch(
      SERVER_API_URL +
        `/userregister?email=${email}&password=${password}&username=${username}`
    );
    const rep = await rawRep.json();
    if (rep.isConnected == 1) {
      try {
        await AsyncStorage.setItem("@jwt", rep.jwt);
        await AsyncStorage.setItem("@user", JSON.stringify(rep.user));
        navigation.navigate("Dashboard");
      } catch (e) {
        alert(e);
      }
    } else {
      switch (rep.error) {
        case "USERNAME_ALREADY_TAKEN":
          setAlertUsername(
            "Ton super pseudo est déjà pris par un autre joueur :/"
          );
          break;
        case "USER_ALREADY_REGISTERED":
          setAlertEmail(
            "Ton email est déjà enregistré. Merci de te connecter."
          );
          break;
        case "BAD_EMAIL":
          setAlertEmail("Votre email n'est pas correct, Merci de le verifier");
          break;
        case "BAD_USERNAME":
          setAlertUsername("Ton pseudo doit faire au moins 4 charactères");
          break;
        case "BAD_PASSWORD":
          setAlertPassword(
            "Le mot de passe est sensé contenir au moins 8 characteres et une majuscule"
          );
          break;
      }
    }
  }

  function onRegister() {
    if (username && password && confirmPassword && email && checkForm()) {
      checkUsername().then((ok: boolean) => {
        if (ok) {
          //On peut send les données.
          sendDataRegisterUser(username, password, email);
        }
      });
    }
  }

  async function checkUsername() {
    let noAlert = true;
    if (username != "") {
      if (username.length < 4) {
        setAlertUsername("Ton pseudo doit faire au moins 4 charactères");
        noAlert = false;
      } else {
        const rawRep = await fetch(
          SERVER_API_URL + `/doesusernameexist?username=${username}`
        );
        const rep = await rawRep.json();

        if (rep.exists) {
          setAlertUsername(
            "Ton super pseudo est déjà pris par un autre joueur :/"
          );
          noAlert = false;
        }
      }
    }

    if (noAlert) setAlertUsername(" ");
    return noAlert;
  }

  function checkForm() {
    let ok = true;
    //check Email
    if (!validateEmailRegex.test(email)) {
      ok = false;
      if (email != "")
        setAlertEmail("Votre email n'est pas correct, Merci de le verifier");
    } else {
      setAlertEmail(" ");
    }

    //check password
    if (
      !(
        password.length > 7 &&
        password.split("").some((char: any) => char.toUpperCase() != char) &&
        password.split("").some((char: any) => char.toLowerCase() != char)
      )
    ) {
      ok = false;
      if (password != "")
        setAlertPassword(
          "Le mot de passe est sensé contenir au moins 8 characteres et une majuscule"
        );
    } else {
      setAlertPassword(" ");
    }

    //check confirm password
    if (password != confirmPassword) {
      ok = false;
      if (confirmPassword != "")
        setAlertConfirmPassword("Les mots de passent ne sont pas pareils");
    } else {
      setAlertConfirmPassword(" ");
    }
    return ok;
  }

  return (
    <ViewContainer>
      <BasicScrollView>
        <LineBreak />
        <TextTitle style={styles.topTitle}>Bienvenu sur,</TextTitle>
        <TextMainTitle>Roi du Prono</TextMainTitle>
        {/* <View style={{ flexDirection: "row" }}>
				<View style={{ flex: 1, alignItems: "center" }}>
					<FontAwesome.Button
						size={100}
						name="facebook"
						backgroundColor="#3b5998"
						onPress={registerWithFacebook}
					></FontAwesome.Button>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<FontAwesome.Button
						size={100}
						name="google"
						color="#FFFFFF"
						backgroundColor="#8B0000"
						onPress={registerWithGoogle}
					></FontAwesome.Button>
				</View>
			</View> */}
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <TextLabel>Pseudo</TextLabel>
        <TextInput
          value={username}
          onChangeText={(username: any) => {
            setUsername(username);
          }}
          placeholder={"Mon Pseudo"}
        />
        <TextWarning>{alertUsername}</TextWarning>

        <TextLabel>Email</TextLabel>
        <TextInput
          value={email}
          keyboardType={"email-address"}
          onChangeText={(email: any) => {
            setEmail(email);
          }}
          placeholder={"Mon Mail"}
        />
        <TextWarning>{alertEmail}</TextWarning>

        <TextLabel>Mot De Passe</TextLabel>
        <TextInput
          value={password}
          onChangeText={(password: any) => {
            setPassword(password);
          }}
          placeholder={"8 lettres minimum, une majuscule"}
          secureTextEntry={true}
        />
        <TextWarning>{alertPassword}</TextWarning>

        <TextLabel>Confirmation De Mot De Passe</TextLabel>
        <TextInput
          value={confirmPassword}
          onChangeText={(p: any) => {
            setConfirmPassword(p);
          }}
          placeholder={"Le même stp"}
          secureTextEntry={true}
        />
        <TextWarning>{alertConfirmPassword}</TextWarning>

        <SubText
          onPress={() => navigation.navigate("UserConditions")}
          style={styles.conditions}
        >
          En cliquant sur Je m’inscris, je déclare accepter les
        </SubText>
		<Text
          onPress={() => navigation.navigate("UserConditions")}
          style={styles.conditions}
        >
          Conditions Générales d’Utilisation
        </Text>
		<SubText
          onPress={() => navigation.navigate("UserConditions")}
          style={styles.conditions}
        >
          propres au Roi du Prono
        </SubText>
        {/* TODO faire les conditions */}

        <LineBreak />
        <ValidedButton title={"Je m'inscris"} onPress={onRegister} />
        <LineBreak />
        <View style={styles.felxRow}>
          <Text
            style={styles.subCta}
            onPress={() => navigation.navigate("Login")}
          >
            Tu as déjà un compte Roi du Prono? 
          </Text>
          <Text
            style={[styles.link, styles.subCta]}
            onPress={() => navigation.navigate("Login")}
          >
            Connectes-toi ici !
          </Text>
        </View>
        <LineBreak />
      </BasicScrollView>
    </ViewContainer>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
  },
  conditions: {
    fontSize: 12,
    fontStyle: "italic",
  },
  topTitle: {
    marginTop: Constants.statusBarHeight,
  },
  link: {
    color: Colors.link,
    fontWeight: "bold",
    marginLeft: 4,
  },
  felxRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  subCta: {
    fontSize: 12,
  },
});
