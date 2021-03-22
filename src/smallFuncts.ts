import { GameSchema } from "./interaces/interfacesGame";

export function validURL(str: string) {
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
		"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(str);
}


export function getUserNameFromId(game: GameSchema | undefined, userId: string | undefined){

	if(game?.userStats && userId){
		for(let user of game.userStats){
			if(user.userId == userId){

				return user.username
			}
		}
	}

	return "";
}