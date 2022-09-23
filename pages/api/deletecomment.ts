import type { NextApiRequest, NextApiResponse } from 'next'
import { internalError } from '../../lib/interfaces'
import connection from '../../lib/postgre'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    let body:{
        id:number
    } = req.body
    let query = `DELETE FROM comments WHERE id='${body.id}';`
    try{
        await connection.query(query)
    }
    catch(err){
        console.log(err)
        res.status(500).json(internalError)
    }
    res.status(200).json({
        error:false,
        status:'Comment deleted'
    })
}
