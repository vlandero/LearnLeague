import React from 'react'
import { GetServerSideProps } from 'next'
import { Match } from '../../lib/interfaces'
import connection from '../../lib/postgre'
import GamePreview from '../../components/game-preview'

type Matches = {
  username:string,
  id:number,
  token:string,
  match:Match,
}

interface Props{
  matches:Matches[]
}

export default function Explore({matches}:Props) {
  return (
    <div className='w-1/4 p-5'>
      {matches.map((mt)=>
        <div key={mt.id.toString()}>
          <p>By {mt.username}</p>
          <GamePreview onClick={()=>{window.location.href=`/explore/${mt.token+mt.id.toString()}`}} match={mt.match}></GamePreview>
        </div>
        
      )}
    </div>
  )
}

export const getServerSideProps:GetServerSideProps = async() => {
  let query = `SELECT date_added,json,user_id,(SELECT username FROM users WHERE id=user_id),id,token from matches ORDER BY date_added FETCH FIRST 10 ROW ONLY;`
  let result = await connection.query(query)
  let arr:Matches[] = []
  for(let match of result.rows){
    arr.push({username:match.username,match:JSON.parse(match.json),id:match.id,token:match.token})
  }
  return{
    props:{
      matches:arr
    }
  }
}
