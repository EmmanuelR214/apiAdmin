import { createPool } from "mysql2/promise"
import { DB, DBHOST, DBPASS, DBPORT, DBUSER } from "./config.js"
import dns from "dns";
import net from "net";

export const Coonexion = createPool({
    host: DBHOST,
    user: DBUSER,
    password: DBPASS,
    database: DB,
    port: DBPORT
})