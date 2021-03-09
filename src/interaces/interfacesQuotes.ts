export interface SportSchema {
    _id?: { $oid?: string };
    sportName?: string;
    sportId?: string;
    leagueIds?: Array<string>;
    dateFirstMatch?: number;

 }

export  interface LeagueSchema {
   _id?: { $oid?: string };
   leagueName?: string;
   sportId?: string;
   leagueId?: string;
   matchIds?: Array<string>;
   dateFirstMatch?: number;
}

export interface MatchSchema {
   _id?: { $oid?: string };
   teamHome?: string;
   teamAway?: string;
   sportId?: string;
   leagueId?: string;
   matchId?: string;
   matchStatus?: number;
   time?: Date;
   prematchOdds?: any;
   results?: any;
   matchEvent?: string;
   matchOdds?: object; 
   matchStats?: object; 
}
