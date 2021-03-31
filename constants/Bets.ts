export const BET_IDS_TO_WHITELIST = [10150, 40]

export function isBetIdWhitelisted(id: number | string){
    if (typeof id === "number") {
        if(BET_IDS_TO_WHITELIST.some((element) => element == id)){
            return true;
        }
    }else{
        if(BET_IDS_TO_WHITELIST.some((element) => element == parseInt(id))){
            return true;
        }
    }
    return false;
}
