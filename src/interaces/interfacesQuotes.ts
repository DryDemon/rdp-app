import getDbElement from "../clientConnexion"

export interface SportSchema {
    _id: { $oid: string };
    sportName: string;
    sportId: string;
    leagueIds: Array<string>;
    dateFirstMatch: number;

 }

export  interface LeagueSchema {
   _id: { $oid: string };
   leagueName: string;
   sportId: string;
   leagueId: string;
   matchIds: Array<string>;
   dateFirstMatch: number;
}

export interface MatchSchema {
   _id: { $oid: string };
   teamHome: string;
   teamAway: string;
   sportId: string;
   leagueId: string;
   matchId: string;
   matchStatus: number;
   time: Date;
   prematchOdds: any;
   results: any;
   matchEvent: string;
   matchOdds: object; //TODO
   matchStats: object; //TODO
}

export async function getDbSportsElement(){
   const db = await getDbElement();
   const dbSport = db.collection<SportSchema>("sports");
   return dbSport;
}

export async function getDbLeaguesElement(){
   const db = await getDbElement();
   const dbLeagues = db.collection<LeagueSchema>("leagues");
   return dbLeagues;
}

export async function getDbMatchsElement(){
   const db = await getDbElement();
   const dbMatch = db.collection<MatchSchema>("matchs");
   return dbMatch;
}
