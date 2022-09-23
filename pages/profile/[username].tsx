import React, { useState,useEffect } from 'react'
import { ApiService } from '../../lib/ApiCalls'
import { Match, Status, User } from '../../lib/interfaces'
import AddGame from '../../components/add-game'
import AddSummoner from '../../components/add-summoner'
import { GetServerSideProps } from 'next'
import connection from '../../lib/postgre'
import {SummonerInDB} from '../../lib/interfaces'
import { QueryResult } from 'pg'
import Account from '../../components/account'
import { useAuth } from '../../context/state'

type Props = {
    pageUser:{
        id:number,
        username:string,
        email:string
    }|null
    error:string
}

export default function Profile({pageUser,error}:Props) {
    const [modal, setModal] = useState(false)
    const [modalSummoner, setModalSummoner] = useState(false)
    const [canEdit, setCanEdit] = useState(false)
    const [accounts, setAccounts] = useState<SummonerInDB[]>([])
    const [posts, setPosts] = useState<Match[]>([])
    const [trigger, setTrigger] = useState<boolean>(false)
    const {user,logout} = useAuth()
    if(!pageUser){
        return(
            <div>
                <p>{error}</p>
            </div>
        )
    }
    async function getGames(){
        let result:Status = await ApiService.get(`/getgames/${pageUser?.id}`,{})
        if(result.error)
            return alert(result.status)
        let accounts:SummonerInDB[] = JSON.parse(result.status)
        setAccounts(accounts)
    }
    useEffect(() => {
        if(pageUser && user?.username === pageUser.username)
            setCanEdit(true);
        }, []
    )
    useEffect(() => {
      getGames()
    }, [trigger])
    
    
    function renderEditable(){
        if(canEdit && user !== null){
            return(
                <div>
                    <button className='button' onClick={async ()=>{
                        const res:Status = await ApiService.post('logout',{},{});
                        if(res.error){
                            console.log(res.status);
                            return alert("Could not log out");
                        }
                        logout();
                    }}>Logout</button>
                    <br/>
                    <button className='button' onClick={()=>{setModal(true)}}>Add Game</button>
                    <br></br>
                    <button className='button' onClick={()=>{setModalSummoner(true)}}>Add summoner</button>
                    <AddGame accounts={accounts} setTrigger={setTrigger} username={user.username} isOpen={modal} setOpen={setModal}></AddGame>
                    <AddSummoner setTrigger={setTrigger} isOpen={modalSummoner} user={user} close={()=>{setModalSummoner(false)}}></AddSummoner>
                </div>
            )
        }
    }
    return (
        <div>
            <p>This is {pageUser.username}'s profile</p>
            {renderEditable()}
            <div>
                <h3>Summoners connected:</h3>
                <div>
                    {accounts.map((acc)=>
                        <Account key={acc.puuid} account={acc}></Account>
                    )}
                </div>
            </div>
            <div>
                <h3>Posts:</h3>
                <div>

                </div>
            </div>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (context) => {
    if(typeof(context.query.username) !== 'string'){
        return {
            props:{
                pageUser:null,
                error:'URL does not exist'
            }
        }
    }
    let userResult:QueryResult<{
        id:number,
        username:string,
        email:string
    }> = await connection.query(`SELECT id,username,email FROM users WHERE username='${context.query.username}'`)
    if(userResult.rows.length === 0)
        return {
            props:{
                pageUser:null,
                error:'Username does not exist'
            }
        }
    return{
      props:{
        pageUser: {
            id:userResult.rows[0].id,
            username:userResult.rows[0].username,
            email:userResult.rows[0].email
        },
        error:''
      }
    }
}