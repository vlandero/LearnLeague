import { NextApiRequest, NextApiResponse } from "next";
import { internalError, Region, regionCodes } from "../../../../lib/interfaces";
import { League } from "../../../../lib/riot-api";

interface TypedNextApiRequest extends NextApiRequest {
    query:{
        summoner:string,
        region:Region
    }
}


export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    let result;
    try{
        result = await League.match_history(req.query.summoner,regionCodes[req.query.region]);
        return res.status(200).json({
            error:false,
            status:JSON.stringify(result)
        });
    }
    catch(err){ 
        if(err instanceof TypeError){
            return res.status(404).json({
                status:'No matches found',
                error:true
            })
        }
        return res.status(404).json(internalError);
        
    }
    
}