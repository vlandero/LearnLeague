import { NextApiRequest, NextApiResponse } from "next";
import { internalError, Region, regionCodes, Summoner } from "../../../../lib/interfaces";
import { League } from "../../../../lib/riot-api";
import connection from "../../../../lib/postgre";

interface TypedNextApiRequest extends NextApiRequest {
    query:{
        summoner:string,
        region:Region
    }
}


export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    // let result
    // if(typeof(req.query.summoner)==='string' && (req.query.region==='euw1'||req.query.region==='eun1') ){
    //     try{
    //         result = await League.match_history(req.query.summoner,req.query.region)
    //         return res.status(200).json(result)
    //     }
    //     catch(err){ 
    //         if(err instanceof TypeError){
    //             return res.status(404).json({
    //                 matches:[],
    //                 error:'Matches not found'
    //             })
    //         }
    //         return res.status(404).json({
    //             matches:[],
    //             error:'Unknown error'
    //         })
            
    //     }
    // }
    // else{
    //     return res.status(500).json({
    //         matches:[],
    //         error:'Internal error'
    //     })
    // }
    console.log('intrat')
    let summoner:Summoner;
    try{
        let region = regionCodes[req.query.region]
        summoner = await League.summoner(req.query.summoner,region)
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