import React, { useEffect, useState } from 'react';
import { useAuth } from '../wrappers/state';
import { ApiService } from '../lib/ApiCalls';
import { Status, User } from '../lib/interfaces';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const {user,login} = useAuth();
    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
        if(event.target.name==="username")
            setUsername(event.target.value);
        if(event.target.name==="password")
            setPassword(event.target.value);
    }
    useEffect(() => {
      if(user !== null)
        window.location.href = `/profile/${user.username}`;
    }, [])
      
  return (
    <div>
        <form onSubmit={async (e)=>{
            e.preventDefault();
            let promise = await ApiService.post('login',{
              username:username,
              password:password
            },{})
            let res:Status = await promise;
            if(res.error){
              return setMessage(res.status);
            }
            const user: User = JSON.parse(res.status);
            login(user);
            window.location.href = `/profile/${(JSON.parse(res.status)).username}`;
        }}>
            <label htmlFor="username" >Username</label>
            <input type="text" required name="username" id="" onChange={handleChange} />
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" required name="password" id="" onChange={handleChange} />
            <p>{message !== '' ? message : null}</p>
            <input type="submit" value="Submit" />
            <br />
            
        </form>
    </div>
  )
}
