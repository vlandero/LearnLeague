import React, { useState } from 'react'
import { ApiService } from '../lib/ApiCalls'
import { regionCodes, regions, SummonerInDB } from '../lib/interfaces'
import Loading from './loading'
import { Match, Matches } from '../lib/interfaces'
import GamePreview from './game-preview'
import {MatchDetails} from './add-game'

interface Props{
    matchDetails:MatchDetails,
    setMatchDetails:React.Dispatch<React.SetStateAction<MatchDetails>>,
    goBack:()=>void,
    accounts:SummonerInDB[]
}

export default function ChooseGame({setMatchDetails,matchDetails,goBack,accounts}:Props) {
    const [loading, setLoading] = useState(false)
    const [summonerName, setSummonerName] = useState<string>('---')
    const [message,setMessage] = useState('')
    const [matches, setMatches] = useState<Match[]>([])
    
    let accountMap:{
        [index:string]:SummonerInDB
    } = {}

    for(let account of accounts){
        accountMap[account.summoner_name] = account
    }

    function handleSelect(e:React.ChangeEvent<HTMLSelectElement>){
        setSummonerName(e.target.value)
        
    }
    async function findGames(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(summonerName === '---')
            return setMessage('Summoner name field can not be empty')
        setLoading(true)
        setMessage('')
        let promise = await ApiService.get(`/riot/${summonerName}/${region}`,{})
        let res:Matches = await promise
        if(res.error !== null){
            setLoading(false)
            return setMessage(res.error)
        }
        setMatches(res.matches)
        console.log(matches);
        setLoading(false)
    }
    if(loading){
        return (
            <div>
                <Loading />
            </div>
          )
    }
  return (
    <div className='flex flex-col'>
        <form className='flex flex-col w-2/6' onSubmit={findGames}>            
            <select value={summonerName} onChange={handleSelect} name="region">
                {accounts.map(acc => 
                    <option key={acc.puuid} value={acc.puuid}>{acc.summoner_name} - {acc.region}</option>
                )}
            </select>
            <input className='button' type="submit" value="Search games" />
        </form>
        <p>{message}</p>
        <div>
            {matches.map(mt=><GamePreview onClick={()=>{
                setMatchDetails({...matchDetails,match:mt})
                goBack()
            }} key={mt.id} match={mt}></GamePreview>)}
        </div>
        
    </div>
  )
}
