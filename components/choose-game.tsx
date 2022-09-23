import React, { useState } from 'react';
import { ApiService } from '../lib/ApiCalls';
import { regionCodes, regions, Status, SummonerInDB } from '../lib/interfaces';
import Loading from './loading';
import { Match } from '../lib/interfaces';
import GamePreview from './game-preview';
import {MatchDetails} from './add-game';

interface Props{
    matchDetails:MatchDetails,
    setMatchDetails:React.Dispatch<React.SetStateAction<MatchDetails>>,
    goBack:()=>void,
    accounts:SummonerInDB[]
}

export default function ChooseGame({setMatchDetails,matchDetails,goBack,accounts}:Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [summoner, setSummoner] = useState<SummonerInDB|null>(accounts[0]||null);
    const [summonerName, setSummonerName] = useState<string>(accounts[0].summoner_name||'---');
    const [message, setMessage] = useState<string>('');
    const [matches, setMatches] = useState<Match[]>([]);
    
    let accountMap:{
        [index:string]:SummonerInDB|null
    } = {};

    for(let account of accounts){
        accountMap[account.summoner_name] = account;
    }
    accountMap['---'] = null;

    function handleSelect(e:React.ChangeEvent<HTMLSelectElement>){
        setSummonerName(e.target.value);
        setSummoner(accountMap[e.target.value]);
    }
    async function findGames(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if(summonerName === '---' || summoner === null)
            return setMessage('Summoner name can not be empty');
        setLoading(true);
        setMessage('');
        let promise = await ApiService.get(`/riot/${summoner.puuid}/${summoner.region}`,{});
        let res:Status = await promise;
        if(res.error === true){
            setLoading(false);
            return setMessage(res.status);
        }
        console.log(res)
        setMatches(JSON.parse(res.status));
        console.log(matches);
        setLoading(false);
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
                setMatchDetails({...matchDetails,match:mt});
                goBack();
            }} key={mt.id} match={mt}></GamePreview>)}
        </div>
        
    </div>
  )
}
