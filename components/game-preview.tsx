import React from 'react'
import { Match } from '../lib/interfaces'
import {MatchDetails} from './add-game'

let winningTeamStyles:React.CSSProperties = {
    backgroundColor:'lightblue'
}
let currentPlayerStyles:React.CSSProperties = {
    color:'#75B9BE'
}

interface Props{
    match:Match|null,
    onClick:()=>void
}

export default function GamePreview({match,onClick}:Props) {
    if(match === null)
        return null
    
    //order roles
    let roles = ['TOP','JUNGLE','MIDDLE','BOTTOM','UTILITY']
    let j = 0
    for(let i = 0; i <= 4; ++i){
        for(let k = 0; k <= 4; ++k){
            if(match.teams.blue.players[i].lane == roles[k]){
                let aux
                aux = match.teams.blue.players[i]
                match.teams.blue.players[i] = match.teams.blue.players[k]
                match.teams.blue.players[k] = aux
            }
        }
    }
    j = 0
    for(let i = 0; i <= 4; ++i){
        for(let k = 0; k <= 4; ++k){
            if(match.teams.red.players[i].lane == roles[k]){
                let aux
                aux = match.teams.blue.players[i]
                match.teams.blue.players[i] = match.teams.blue.players[k]
                match.teams.blue.players[k] = aux
            }
        }
    }
    
  return (
    <div onClick={onClick} className='border-2 border-green-500 mb-2 mt-1'>
        <p>{match.minutes}:{match.seconds}</p>
        <div className='flex justify-around'>
            <div className='flex-1 text-center' style={!match.teams.blue.win?winningTeamStyles:{}}>
                {match.teams.blue.players.map(player=><p style={match.player_puuid===player.puuid?currentPlayerStyles:{}} key={player.puuid}>{player.championName}</p>)}
            </div>
            <div className='flex-1 text-center' style={!match.teams.red.win?winningTeamStyles:{}}>
                {match.teams.red.players.map(player=><p style={match.player_puuid===player.puuid?currentPlayerStyles:{}} key={player.puuid}>{player.championName}</p>)}
            </div>
        </div>
    </div>
  )
}
