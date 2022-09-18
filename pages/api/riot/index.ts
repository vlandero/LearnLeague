import { NextApiRequest, NextApiResponse } from "next";
import { League } from "../../../lib/riot-api";
import { useRouter } from "next/router";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    console.log(req.query)

    res.status(200).json({
        status:'ok',
        error:false
    })
}