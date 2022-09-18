import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import ironSessionOptions from '../../lib/session-options'
import connection from '../../lib/postgre'



async function handler(req:NextApiRequest,res:NextApiResponse){
    let body:{
        username:string,
        password:string
    } = req.body
    
    let query = `SELECT * FROM users u WHERE u.username='${body.username}'`
    try{
        let result = await connection.query(query)
        if(result.rows.length === 0){
            return res.status(500).json({
                error:true,
                status:'User not found'
            })
        }
        req.session.user = {
            username:result.rows[0].username,
            id:result.rows[0].id
        }
        await req.session.save()
    }
    catch(err:any){
        console.log(err)
        return res.status(501).json({
            error:true,
            status:err
        })
    }
    
    res.status(200).json({
        error:false,
        status:'Logged in successfully'
    })
}

export default withIronSessionApiRoute(handler,ironSessionOptions)