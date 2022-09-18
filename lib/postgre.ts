import {Pool} from 'pg'

let connection:Pool

connection = new Pool({
    database: process.env.DBNAME,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
})


export default connection