import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "pg";
import { internalError, Match, SummonerInDB } from "../../../lib/interfaces";
import connection from "../../../lib/postgre";

interface TypedNextApiRequest extends NextApiRequest {
    query:{
        id:string,
    }
}

export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    try{
        let matchesResult:QueryResult<Match> = await connection.query(`SELECT * FROM matches WHERE user_id=${req.query.id}`)
        let matches:Match[] = []
        for(let match of matchesResult.rows){
            matches.push(match)
        }
        res.status(200).send({
            error:false,
            status:JSON.stringify(matches)
        })
    }
    catch(err){
        res.status(400).send(internalError)
    }
    
}