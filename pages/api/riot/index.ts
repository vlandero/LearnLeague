import { NextApiRequest, NextApiResponse } from "next";
import { League } from "../../../lib/riot-api";
import { useRouter } from "next/router";
import { internalError, Region, regionCodes, Summoner } from "../../../lib/interfaces";
import connection from "../../../lib/postgre";
import { QueryResult } from "pg";

interface TypedNextApiRequest extends NextApiRequest {
    body:{
        summonerName:string,
        region:Region
    }
}

export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    
    let summoner:Summoner;
    try{
        console.log('intrat')
        let region = regionCodes[req.body.region]
        console.log('intrat')
        summoner = await League.summoner(req.body.summonerName,region)
        let accs: QueryResult<any>
        try{
            accs = await connection.query(`SELECT * FROM accounts WHERE puuid='${summoner.puuid}'`);
        }
        catch{
            return res.status(400).send(internalError);
        }
        console.log('first')
        if(accs.rowCount > 0){
            return res.status(400).send({
                error:true,
                status:"Account is already linked on the website"
            })
        }
        
    }
    catch(err){
        res.status(404).json({
            error:true,
            status:'User not found'
        })
    }
    res.status(200).json({
        error:false,
        status:'Ok'
    })
}