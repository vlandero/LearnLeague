import type { NextApiRequest, NextApiResponse } from 'next'
import { internalError } from '../../lib/interfaces'
import connection from '../../lib/postgre'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    let body:{
        content:string,
        user_id:number,
        match_id:number|null,
        parent_id:number|null
    } = req.body
    let query = `INSERT INTO Comments(content,match_id,user_id,parent_id) VALUES('${body.content}',${body.match_id},${body.user_id},${body.parent_id});`
    try{
        await connection.query(query)
    }
    catch(err){
        console.log(err)
        res.status(500).json(internalError)
    }
    res.status(200).json({
        error:false,
        status:'Comment added'
    })
}
