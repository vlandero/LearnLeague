import { Login, Register } from "./interfaces"

const URL = 'http://localhost:3000/'

export class ApiService{
    public static async post(api:string,data: any,headers:any) {
        
        const response = await fetch(`${URL}/api/${api}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',...headers},
            body: JSON.stringify(data)
        })
        return await response.json()
    }
    public static async get(api:string,headers:any) {
        
        const response = await fetch(`${URL}/api/${api}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json',...headers},
        })
        return await response.json()
    }
}

