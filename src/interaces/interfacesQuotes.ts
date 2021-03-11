export interface SportSchema {
    _id?: any;
    sportName?: string;
    sportId?: string;
    leagueIds?: Array<string>;
    dateFirstMatch?: number;

 }

export  interface LeagueSchema {
   _id?: any;
   leagueName?: string;
   sportId?: string;
   leagueId?: string;
   matchIds?: Array<string>;
   dateFirstMatch?: number;
}

export interface MatchSchema {
   _id?: any;
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
