import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";

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
	SubText,
	SmallLineBreak,
	TextSubTitle,
} from "../components/Themed";
import { SERVER_API_URL } from "../constants/Server";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { User } from "../src/interaces/interfacesUsers";
import Colors from "../constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MainHeader } from "../components/mainHeader";
import { ENVIRONEMENT } from "../constants/Environement";

async function verifyUserToken(token: string) {
	let succeded = false;
	const rawRep = await fetch(
		SERVER_API_URL +
			`/resetpasswordsetpassword?validateToken=1&token=${token}`
	);

	const rep = await rawRep.json();

	let error = "";
	if (rep.success == 1) {
		if (+rep.isOutdated == 1) {
			error =
				"Tu as dépassé le temps limite pour remettre ton mot de passe à 0, tu peux demander un nouveau code sur la page précedente.";
		} else {
			succeded = true;
			if (ENVIRONEMENT == "dev") alert("dev message only, good");
		}
	} else {
		error =
			"Le code est incorrect, tu peux revenir en arrière pour en demander un nouveau.";

		if (ENVIRONEMENT == "dev") alert("dev message only, false");
	}
	return [succeded, error];
}

async function sendNewPassword(token: string, password: string) {
	let succeded = false;
	const rawRep = await fetch(
		SERVER_API_URL +
			`/resetpasswordsetpassword?newPassword=${password}&token=${token}`
	);

	const rep = await rawRep.json();

	let error = "";
	if (rep.success == 1) {
		succeded = true;
		if (ENVIRONEMENT == "dev") alert("dev message only, good");
	} else {
		if (ENVIRONEMENT == "dev") alert("dev message only, false");
	}
	return [succeded, error];
}

export default function userConditions({ navigation, route: { params } }: any) {
	return (
		<ViewContainer>
			<MainHeader back={"Register"} navigation={navigation} />
			<BasicScrollView>
				<LineBreak />

				<TextTitle>Conditions générales d'utilisation</TextTitle>

				<TextSubTitle> Bienvenue sur le Roi du Prono. </TextSubTitle>

				<Text>
					Cette page (et tous les documents auxquels elle se réfère)
					vous informe sur les conditions dans lesquelles vous pouvez
					utiliser l'application Roi du Prono telle que disponible sur
					l'App Store et Google Play (désigné comme le « Site » dans
					les prochains paragraphes), en tant que simple visiteur ou
					qu'utilisateur inscrit (désigné par "vous"dans les prochains
					paragraphes). En utilisant ce site, vous déclarez accepter
					expressément sansréserve les présentes conditions
					d'utilisation et vous vous engagez à les respecter. Si vous
					n'acceptez pas les présentes conditions générales
					d'utilisation ou n'importe quelle disposition prévue par tout
					autre document auquel elles se réfèrent, nous vous demandons
					de vous abstenir d'utiliser ce site.
				</Text>

				<TextSubTitle>1. Gestion des données personnelles</TextSubTitle>

				<Text>
					Roi du Prono protège vos données personnelles et votre vie
					privée conformément aux règles européennes et françaises les
					plus strictes applicables en la matière. Les données
					personnelles saisies par l'utilisateur lors de la création de
					son compte sont les suivantes : adresse électronique, mot de
					passe. Des données personnelles peuvent aussi être
					renseignées/modifiéessur la page « mon compte » : civilité,
					code postal, ville, pays, consentement pour recevoir les
					alertes concernant votre contest, consentement pour recevoir
					des newsletters du Site et consentement pour recevoir des
					newsletters des partenaires du Site. Enfin, d'autres données
					publiques dites « de navigation» sont collectées mais en
					aucun cas elles ne permettent votre identification :
					l'adresse IP (adresse de l'ordinateur), le fournisseur
					d'accès internet (ISP), le type et la langue du
					navigateur,les contenus des cookies reçus, la date et
					l'heure de chaque connexion, les pages visitées sur le site
					et les clics réalisés, le canal de connexion vers le site
					Roi du Prono.
				</Text>

				<TextSubTitle>
					2. Utilisation, modification et suppression des
					données collectées
				</TextSubTitle>

				<Text>Les données collectées sont nécessaires pour :</Text>

				<TextSubTitle> ● Créer et gérer votre compte </TextSubTitle>

				<TextSubTitle>
					● Vous contacter suite à une de vos sollicitations ou dans le
					cadre de l'administration du site et des services proposés
				</TextSubTitle>
				<TextSubTitle>
					● Vous informer sur les services proposés sur le Site
				</TextSubTitle>

				<TextSubTitle> ● Envoyer des newsletters </TextSubTitle>

				<TextSubTitle>
					● Identifier les utilisations abusives du Site
				</TextSubTitle>

				<Text>
					Vous pouvez à tout moment modifier vos données sur la page «
					mon compte ». Vous pouvez notamment vous désabonner des
					emails envoyés par le Site sur cette page, ou bien en
					cliquant sur le lien de désabonnement présent en bas de
					l'email. En ce qui concerne la suppression : en
					application de la loi " Informatique et Libertés " du 6
					janvier 1978 modifiée, les participants disposent d'un droit
					d'accès, de modification, de rectification et de suppression
					des données les concernant auprès de l'Organisateur de ce
					jeu. Pour cela, il suffit d'envoyer un email à
					contact@roiduprono.com en précisant votre demande. Roi du
					Prono est une marque déposée à l'INPI sous le numéro 4763067.
				</Text>

				<TextSubTitle>
					3. Virus, piratage et autres actes délictueux
				</TextSubTitle>

				<Text>
					Vous ne devez pas en aucun cas commettre des
					agissements délictueux à l'encontre du site notamment en
					introduisant sciemment des virus, chevauxde Troie, vers
					informatiques, « bombes à retardement », ou tout autre
					matériel nuisible ou technologiquement dangereux pour le
					site. Vous ne devez pas tenter d'obtenir un accès non
					autorisé au site, au serveur sur lequel le site est stocké
					ou n'importe quel serveur, ordinateur ou base de données
					connectés au site.
				</Text>

				<Text>
					Vous ne devez en aucun cas tenter de nuire au bon
					fonctionnement du site, par une attaque en déni de service.
					En violant cette disposition, vous commettez un délit pénal
					en application des articles 323-1 et suivants du Code Pénal,
					relatifs à la répression des atteintes aux systèmes de
					traitement automatisé de données La responsabilité de Roi du
					Prono ne pourra pas être engagée en cas de pertes ou dommages
					causés par un virus, ou tout autre matériel
					technologiquementnuisible qui pourraient infecter votre
					équipement informatique, vos programmes informatiques,vos
					données ou autres, en raison de votre utilisation du site ou
					des téléchargementsque vous aurez effectué, ou contenus que
					vous aurez publié sur notre site, ou sur tout site Web auquel
					il est lié.
				</Text>

				<TextSubTitle>
					4. Compétence judiciaire et loi applicable
				</TextSubTitle>

				<Text>
					Les présentes conditions générales d'utilisation, et tous
					documents auxquels elles font référence, sont soumis à la
					loi française. Les juridictions françaises ont compétence
					exclusive pour toute action judiciaire dont le fondement est
					lié à une visite sur notre site ou l'utilisation de nos
					services. Toutefois Roi du Prono se réserve le droit
					d'engager des poursuites à votre encontre, en cas de
					violation des présentes conditions générales d'utilisation,
					dans votre pays de résidence ou tout autre pays concerné.
				</Text>

				<TextSubTitle> 5. Réclamations</TextSubTitle>

				<Text>
					Si vous avez des réclamations au sujet des données figurant
					sur le site, ou concernant le jeu, vous pouvez nous
					contacter par email à l'adresse suivante:
					contact@roiduprono.com, en détaillant l'objet de votre
					réclamation.
				</Text>

				<TextSubTitle> 6. Utilisations interdites</TextSubTitle>

				<Text>
					Vous acceptez également de ne pas reproduire, copier ou
					revendre toute partie du site en violation des dispositions
					des conditions générales d'utilisation du site Roi du Prono.
					Vous acceptez également de ne pas accéder sans
					autorisation, interférer, endommager ou perturber une partie
					du site, tout équipement ou réseau sur lequel le site est
					stocké, tous les logiciels utilisés dans la fourniture du
					Site, ou tout équipementou réseau ou logiciel appartenant à
					un tiers ou utilisé par un tiers.
				</Text>

				<TextSubTitle> 7. Suspension et résiliation</TextSubTitle>

				<Text>
					Roi du Prono déterminera, à sa seule discrétion, s'ily a eu
					violation de la présente politique d'utilisation responsable
					lors de votre utilisation de notre site. En cas de la
					violation de cette politique d'utilisation, Roi du Prono
					pourra prendre les mesures appropriées. Sans préjudice de ce
					qui précède, le fait de ne pas se conformer à la présente
					politique d'utilisation responsable constitue une violation
					substantielle des conditions générales d'utilisation du site
					aux termes desquelles vous êtes autorisé à utiliser le
					site,et peut entraîner tout ou partie des mesures suivantes
					:
				</Text>

				<TextSubTitle>
					● le retrait immédiat, temporaire ou permanent de votre droit
					d'utiliser le site ;
				</TextSubTitle>

				<TextSubTitle>
					● la suppression immédiate, temporaire ou définitive de tout
					contenu ou matériel affiché ou téléchargé par vous sur le
					site ;
				</TextSubTitle>

				<TextSubTitle> ● l'envoi d'un avertissement ;</TextSubTitle>

				<TextSubTitle> 8. Les modifications du site</TextSubTitle>

				<Text>
					Roi du Prono peut actualiser le Site régulièrement,et peut
					modifier son contenu à tout moment. En cas de nécessité, Roi
					du Prono se réserve le droit de suspendre l'accès au site, ou
					de le fermer indéfiniment. Tous contenus publiés sur le site
					peuvent s'avérer ne plus être à jour, à tout moment, et Roi
					du Prono n'a aucune obligation de les actualiser.
				</Text>

				<LineBreak />
			</BasicScrollView>
		</ViewContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	topTitle: {
		marginTop: Constants.statusBarHeight,
	},
});
