import getDbElement from "../clientConnexion"

export interface GameSchema {
    _id: { $oid: string };
    name: string;
    joinCode: string;
    status: number;

    maxUser : number;
    ownerId : string;
    userIdList : Array<string>;

    createdAt:Date;
    endingAt:Date;

    sportIdList : Array<string>;
    leagueIdList : Array<string>;

    logoUrl : string;

    betList : userBetInterface[]; //{userId (4d6qs54d): {list of things}}Array of players
    bonusList : Object[];//{[userId, BonusID, BonusStatus, id_Paris, id_Joueurs], [userId2, BonusID, BonusStatus]}
    userStats : userStatsInterface[];//
 }

 export interface userStatsInterface{
   userId: string;
   username: string;
   credits: number;
}

//les paris simples et combinés on le même format pour simplifier la computation
export interface userBetInterface{
   _id:string;

   userId: string;
   status: number; //0 : unresolved, 1 : win, 2 : lost
   credits: number;

   type: number; //0 : prematch, 1 : live

   betsObjects: Array<betObjectInterface>; //Pour contenir les betsid et les matchs ID et le statut du pari et la quote(matchId puis betsId puis quote puis betStatus)
}

export interface betObjectInterface{
   betId: string;
   matchId: string;
   betStatus: number; //0 : unresolved, 1 : win, 2 : lost
   quote: number;
}

export default async function getDbGameElement(){
   const db = await getDbElement();
   const dbGame = db.collection<GameSchema>("games");
   return dbGame;
}
