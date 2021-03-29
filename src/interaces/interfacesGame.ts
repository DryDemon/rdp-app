export interface GameSchema {
    _id?: any;
    name?: string;
    joinCode?: string;
    status?: number;

    maxUser ?: number;
    ownerId ?: string;
    userIdList ?: Array<string>;

    createdAt?:Date;
    endingAt?:Date;

    sportIdList ?: Array<{name : string, id : string}>;
    leagueIdList ?: Array<{name : string, id : string}>;

    logoUrl ?: string;

    betList ?: userBetInterface[]; //{userId (4d6qs54d)?: {list of things}}Array of players
    bonusList ?: BonusInterface[];//{[userId, BonusID, BonusStatus, id_Paris, id_Joueurs], [userId2, BonusID, BonusStatus]}
    userStats ?: userStatsInterface[];//
 }

 
export interface BonusInterface {
    _id?: string
    ownerUserId?: string
    targetUserId?: string
    targetBetId?: string
    isUsed?: boolean
    typeBonus?: number

    multiplier?: number
    creditBonus?: number
    happyHourStartTime?: Date
    happyHourDuration?: number
    usesLeft?: number
}

 export interface userStatsInterface{
   userId?: string;
   username?: string;
   credits?: number;

   creditsStolen?:number;
   stolenDate?:Date;
   stolenFrom?:string;
}

//les paris simples et combinés on le même format pour simplifier la computation
export interface userBetInterface{
   _id?:string;

   userId?: string;
   status?: number; //0 ?: unresolved, 1 ?: win, 2 ?: lost, 3?: cancel
   credits?: number;
   isSystem?:boolean;
   systemChoice?:number;
   mainQuote?: number;
   result?: string;

   quoteBoost?:number;
   quoteBoostFrom?:Date;

   type?: number; //0 : prematch, 1 : live

   betsObjects: Array<betObjectInterface>; //Pour contenir les betsid et les matchs ID et le statut du pari et la quote(matchId puis betsId puis quote puis betStatus)
}

export interface betObjectInterface{
   subId:string;

   //pour l'affichage et le traitement
   matchTime?: Date;
   leagueName?: string;
   matchName?:string;

   betName?: string;
   betSubName?: string;
   betHeader?: string | undefined;
   betHandicap?: string | undefined;

   betId?: string;
   matchId?: string;
   betStatus?: number; //0 ?: unresolved, 1 ?: win, 2 ?: lost
   quote?: number;
   isBase?: boolean;
}
