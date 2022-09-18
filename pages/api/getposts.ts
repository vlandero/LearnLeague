import { NextApiRequest, NextApiResponse } from "next";

interface TypedNextApiRequest extends NextApiRequest {
    query:{
        id:string,
        region:Region
    }
}

export default function handler(req:NextApiRequest,res:NextApiResponse){
    req.body
}