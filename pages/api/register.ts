import type { NextApiRequest, NextApiResponse } from 'next'
import { generateToken, ValidateEmail, ValidatePassword } from '../../lib/helpers'
import { User } from '../../lib/interfaces'
import connection from '../../lib/postgre'

declare module "iron-session"{
    interface IronSessionData{
        user:User
    }
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    let body:{
        username:string,
        password:string,
        email:string
    } = req.body
    console.log(body)

    let goodpass = ValidatePassword(body.password)
    if(!goodpass.valid){
        return res.status(500).json({
            error:true,
            status:goodpass.error
        })
    }

    if(!ValidateEmail(body.email)){
        return res.status(500).json({
            error:true,
            status:'Invalid email'
        })
    }
    let token = generateToken(50)
    let query = `INSERT INTO users(username,password,email,token) VALUES('${body.username}','${body.password}','${body.email}','${token}')`
    try{
        await connection.query(query)
    }
    catch(err:any){
        console.log(err.code)
        if(err.code === '23505')
            return res.status(500).json({
                error:true,
                status:'Username in use'
            })
        return res.status(500).json({
            error:true,
            status:'unknown'
        })
    }

    res.status(200).json({
        error:false,
        status:'Success'
    })
}