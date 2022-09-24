
import { NextApiRequest, NextApiResponse } from "next";
import { internalError, RankedInfo, Region, regionCodes, RegionCodes, Summoner, SummonerInDB, User } from "../../../lib/interfaces";
import connection from "../../../lib/postgre";
import { League } from "../../../lib/riot-api";

interface TypedNextApiRequest extends NextApiRequest {
    body:{
        id:number,
        summonerName:string,
        region:Region,
        user:User
    }
}

export default async function handler(req:TypedNextApiRequest,res:NextApiResponse){
    console.log('first')
    let iconid = req.body.id
    let summonerName = req.body.summonerName
    let region = req.body.region
    let user = req.body.user
    let summoner:Summoner
    if(user === null)
        return res.status(400).send(internalError)
    try{
        summoner = await League.summoner(summonerName,regionCodes[region])
        if(summoner.profileIconId !== iconid){
            return res.status(200).json({
                error:true,
                status:'Summoner icon not changed'
            })
        }
        else{
            let ranked_result = await League.ranked_info(summoner.id,region)
            if(ranked_result.error === true)
                return res.status(400).json({
                    error:true,
                    status:ranked_result.status
                })
            let soloq_result:RankedInfo = JSON.parse(ranked_result.status)
            try{
                await connection.query(`
                    INSERT INTO accounts(puuid,summoner_name,id,accountId,user_id,rank,tier,lp,region)
                    VALUES(
                        '${summoner.puuid}',
                        '${summoner.name}',
                        '${summoner.id}',
                        '${summoner.accountId}',
                        '${user.id}',
                        '${soloq_result.rank}',
                        '${soloq_result.tier}',
                        '${soloq_result.leaguePoints}',
                        '${region}'
                    );
                `)
            }
            catch{
                res.status(400).json(internalError)
            }
            
            return res.status(200).json({
                error:false,
                status:'Ok'
            })
        }
    }
    catch(err){
        return res.status(400).json({
            error:true,
            status:'User not found'
        })
    }

    
}
