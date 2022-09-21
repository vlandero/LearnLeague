import React, { useEffect, useState } from 'react'
import { ApiService } from '../lib/ApiCalls'
import { Status, User } from '../lib/interfaces'
import { withIronSessionSsr } from 'iron-session/next'
import ironSessionOptions from '../lib/session-options'
import { useUser } from '../lib/helpers'

export default function Login(props:{user:User}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
        if(event.target.name==="username")
            setUsername(event.target.value)
        if(event.target.name==="password")
            setPassword(event.target.value)
    }
    useEffect(() => {
      if(props.user !== null)
        window.location.href = '/profile'
    }, [])
      
  return (
    <div>
        <form onSubmit={async (e)=>{
            e.preventDefault()
            let promise = await ApiService.post('login',{
              username:username,
              password:password
            },{})
            let res = await promise
            console.log(res)
            if(res.error){
              return setMessage(res.status)
            }
            window.location.href = '/profile'
        }}>
            <label htmlFor="username" >Username</label>
            <input type="text" required name="username" id="" onChange={handleChange} />
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" required name="password" id="" onChange={handleChange} />
            <p>{message!==''?message:null}</p>
            <input type="submit" value="Submit" />
            <br />
            
        </form>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(useUser,ironSessionOptions)