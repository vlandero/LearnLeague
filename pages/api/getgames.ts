import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "pg";
import { SummonerInDB } from "../../lib/interfaces";
import connection from "../../lib/postgre";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    let accountsResult:QueryResult<SummonerInDB> = await connection.query(`SELECT * FROM accounts WHERE user_id=${userResult.rows[0].id}`)
    let accounts:SummonerInDB[] = []
    for(let account of accountsResult.rows){
        accounts.push(account)
    }
}