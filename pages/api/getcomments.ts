import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../lib/postgre'
import { CommentType } from '../../lib/interfaces'
import { QueryResult } from 'pg'


async function recursion(comms:{comment_id:number,user_id:number,content:string,username:string}[]):Promise<CommentType[]>{
    let comments:CommentType[] = []
    for(let comm of comms){
        let replyQuery:QueryResult<{comment_id:number,user_id:number,content:string,username:string}> = await connection.query(`
        SELECT
            c.id AS comment_id,
            c.content,
            u.id AS user_id,
            u.username
        FROM comments c
        JOIN users u ON u.id=c.user_id
        WHERE parent_id=${comm.comment_id};
        `)
        comments.push({
            content:comm.content,
            username:comm.username,
            comment_id:comm.comment_id,
            user_id:comm.user_id,
            replies:await recursion(replyQuery.rows)
        })
    }
    return comments
}


export default async function handler(req:NextApiRequest,res:NextApiResponse){
    let body:{
        match_id:number
    } = req.body
    
        
    let comments:CommentType[] = []
    try{
        console.log(body.match_id);
        let result:QueryResult<{comment_id:number,content:string,username:string,user_id:number}> = await connection.query(`
        SELECT
            c.id AS comment_id,
            c.content,
            u.id AS user_id,
            u.username
        FROM comments c
        JOIN users u ON u.id=c.user_id
        WHERE match_id=${body.match_id};
        `);
        comments = await recursion(result.rows);
    }
    catch(err){
        console.log('in getcomments', err);
        res.status(500).json({
            error:true,
            status:'Internal error. Try again.'
        })
    }
    res.status(200).json({
        error:false,
        status:JSON.stringify(comments)
    })
}
