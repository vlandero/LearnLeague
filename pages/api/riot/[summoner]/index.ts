import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";

export default async function handler(req:NextApiRequest,res:NextApiResponse){

    res.status(202).json({
        status:'Nothing to be seen here',
        error:false
    })
}