import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "pg";
import { internalError, SummonerInDB } from "../../../lib/interfaces";
import connection from "../../../lib/postgre";

interface TypedNextApiRequest extends NextApiRequest {
    query:{
        id:string,
    }
}

export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    try{
        let accountsResult:QueryResult<SummonerInDB> = await connection.query(`SELECT * FROM accounts WHERE user_id=${req.query.id}`)
        let accounts:SummonerInDB[] = []
        for(let account of accountsResult.rows){
            accounts.push(account)
        }
        res.status(200).send({
            error:false,
            status:JSON.stringify(accounts)
        })
    }
    catch(err){
        res.status(400).send(internalError)
    }
    
}