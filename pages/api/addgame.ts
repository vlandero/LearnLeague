import type { NextApiRequest, NextApiResponse } from 'next'
import { generateToken } from '../../lib/helpers'
import connection from '../../lib/postgre'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    let body:{
        json:string,
        description:string,
        questions:string,
        username:string
    } = req.body
    let linkToMatch = ''
    let token = generateToken(8)
    let query = `INSERT INTO Matches(json,description,questions,token,user_id) VALUES('${body.json}','${body.description}','${body.questions}','${token}',
    (SELECT
        u.id
    FROM
        users u
    WHERE u.username='${body.username}'
    ));`
    try{
        await connection.query(query)
        let last_id = await connection.query('SELECT last_value from matches_id_seq;')
        let num:number = last_id.rows[0].last_value
        linkToMatch = token + num.toString()
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:true,
            status:'Internal error. Try again.'
        })
    }
    res.status(200).json({
        error:false,
        status:linkToMatch
    })
}
