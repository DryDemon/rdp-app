import getDbElement from "../clientConnexion"

export interface User {
    _id: { $oid: string };
    username: string;
    email: string;
    password: string;
 }

export default async function getDbUserElement(){
    const db = await getDbElement();
    const dbUsers = db.collection<User>("users");
    return dbUsers;
}

