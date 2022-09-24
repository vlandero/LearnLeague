import type { NextApiRequest, NextApiResponse } from 'next'
import { internalError, RankedInfo, Region, Status } from '../../../lib/interfaces'
import connection from '../../../lib/postgre'
import { League } from '../../../lib/riot-api'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    let body:{
        id:string,
        region:Region
    } = req.body;
    
    try{
        const rankedResult: Status = await League.ranked_info(body.id,body.region);
        if(rankedResult.error === true){
            return res.status(400).json({
                error:true,
                status:rankedResult.status
            });
        }
        const soloq_result: RankedInfo = JSON.parse(rankedResult.status);
        const query = `
            UPDATE
                accounts
            SET
                rank='${soloq_result.rank}',
                tier='${soloq_result.tier}',
                lp=${soloq_result.leaguePoints}
            WHERE
                id='${body.id}' AND region='${body.region}';
        `;
        await connection.query(query);
    }
    catch(err){
        console.log(err);
        res.status(500).json(internalError);
    }
    res.status(200).json({
        error:false,
        status:'User updated'
    });
}
