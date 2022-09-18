import React from 'react'
import { SummonerInDB } from '../lib/interfaces'

interface Props{
    account:SummonerInDB
}

export default function Account({account}:Props) {
  return (
    <div>{account.summoner_name}</div>
  )
}
