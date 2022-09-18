import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { User } from "./interfaces";

export function ValidateEmail(mail:string) 
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        return true
    return false
}

export function ValidatePassword(password:string){
    let result = 'For password, you need '
    let valid = true

    if(password.length < 8){
        valid = false
        result += 'at least 8 characters, '
    }

    if(password.toLowerCase() === password){
        result += 'at least one uppercase letter, '
        valid = false
    }
    
    let prov = false
    for(let char of password)
        if(!isNaN(char as any))
            prov = true
    if(!prov){
        result += 'at least one number, '
        valid = false
    }
    
    return {
        valid: valid,
        error: result.slice(0,-2)
    }
}

export function generateToken(length:number){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function useUser(req:GetServerSidePropsContext<ParsedUrlQuery, PreviewData>){
    let toReturn:User
    if(req.req.session.user)
        toReturn = req.req.session.user
    else toReturn = null
    return{
        props:{
            user:toReturn
        }
    }
}


