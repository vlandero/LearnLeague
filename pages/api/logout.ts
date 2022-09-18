import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import ironSessionOptions from '../../lib/session-options'

async function handler(req:NextApiRequest,res:NextApiResponse){
    req.session.destroy();
    res.status(200).json({
        error:false,
        status:'Logged out'
    })
}

export default withIronSessionApiRoute(handler,ironSessionOptions)