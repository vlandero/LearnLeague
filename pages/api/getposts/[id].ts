import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "pg";
import { internalError, Match, MatchInDB, MatchLink, SummonerInDB } from "../../../lib/interfaces";
import connection from "../../../lib/postgre";

interface TypedNextApiRequest extends NextApiRequest {
    query:{
        id:string,
    }
}

export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    try{
        const query = `SELECT date_added,json,user_id,(SELECT username FROM users WHERE id=user_id),id,token FROM matches WHERE user_id=${Number(req.query.id)};`
        const matchesResult:QueryResult<MatchInDB> = await connection.query(query)
        let matches:MatchLink[] = []
        for(let match of matchesResult.rows){
            matches.push({username:match.username,match:JSON.parse(match.json),id:match.id,token:match.token})
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