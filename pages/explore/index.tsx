import React from 'react'
import { GetServerSideProps } from 'next'
import { Match, MatchInDB, MatchLink } from '../../lib/interfaces'
import connection from '../../lib/postgre'
import GamePreview from '../../components/game-preview'
import { QueryResult } from 'pg'


interface Props{
  matches:MatchLink[]
}

export default function Explore({matches}:Props) {
  return (
    <div>
      {matches.map((mt)=>
        <div key={mt.match.toString()}>
          <p>By {mt.username}</p>
          <GamePreview onClick={()=>{window.location.href=`/explore/${mt.token+mt.id.toString()}`}} match={mt.match}></GamePreview>
        </div>
        
      )}
    </div>
  )
}

export const getServerSideProps:GetServerSideProps = async() => {
  let query = `SELECT date_added,json,user_id,(SELECT username FROM users WHERE id=user_id),id,token from matches ORDER BY date_added FETCH FIRST 10 ROW ONLY;`
  let result:QueryResult<MatchInDB> = await connection.query(query)
  let arr:MatchLink[] = []
  for(let match of result.rows){
    arr.push({username:match.username,match:JSON.parse(match.json),id:match.id,token:match.token})
  }
  return{
    props:{
      matches:arr
    }
  }
}
