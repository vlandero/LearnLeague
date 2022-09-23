import { NextApiRequest, NextApiResponse } from "next";
import { League } from "../../../lib/riot-api";
import { useRouter } from "next/router";
import { internalError, Region, regionCodes, Summoner } from "../../../lib/interfaces";
import connection from "../../../lib/postgre";

interface TypedNextApiRequest extends NextApiRequest {
    body:{
        summoner:string,
        region:Region
    }
}

export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    console.log('intrat')
    let summoner:Summoner;
    try{
        let region = regionCodes[req.body.region]
        summoner = await League.summoner(req.body.summoner,region)
        let accs
        try{
            accs = await connection.query(`SELECT * FROM accounts WHERE puuid='${summoner.puuid}'`)
            console.log(accs)
        }
        catch{
            return res.status(400).send(internalError)
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