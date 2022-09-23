import React, { useState,useEffect } from 'react'
import { useAuth } from '../context/state'
import { ApiService } from '../lib/ApiCalls'
import { ValidateEmail, ValidatePassword } from '../lib/helpers'
import { Status } from '../lib/interfaces'

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const {user} = useAuth()
    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
        if(event.target.name==="username")
            setUsername(event.target.value)
        if(event.target.name==="password")
            setPassword(event.target.value)
        if(event.target.name==="email")
            setEmail(event.target.value)
    }
    useEffect(() => {
        if(user !== null)
          window.location.href = '/profile'
      }, [])
  return (
    <div>
        <form onSubmit={async (e)=>{
            e.preventDefault()
            let goodpass = ValidatePassword(password)
            if(!goodpass.valid)
                return setMessage(goodpass.error)
            if(!ValidateEmail(email))
                return setMessage('Invalid email')
            let toSend = {
                username:username,
                password:password,
                email:email
            }
            let promise = await ApiService.post('register',toSend,{})
            let res:Status = await promise
            if(!res.error){
                setMessage(res.status)
                return window.location.href = '/login'
            }
            setMessage(res.status)
            console.log(res)
        }}>
            <label htmlFor="username" >Username</label>
            <input type="text" required name="username" id="" onChange={handleChange} />
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" required name="password" id=""  onChange={handleChange} />
            <p>
                Password should contain at least 8 characters, one uppercase letter and one number.
            </p>
            <label htmlFor="email">Email</label>
            <input type="text" required name="email" id="" onChange={handleChange} />
            <p>{message!==''?message:null}</p>
            <input type="submit" value="Submit" />
            <br />
            
        </form>
    </div>
  )
}

