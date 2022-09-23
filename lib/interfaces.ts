export interface Register{
    username:string,
    password:string,
    email:string
}

export interface Login{
    username:string,
    password:string
}

export interface Status{
    error:boolean,
    status:string
}

export type SummonerInDB = {
    summoner_name:string,
    puuid:string,
    id:string,
    account_id:string,
    user_id:string,
    tier:string,
    rank:string,
    LP:number,
    region:Region
}

export type User = {
    id:number,
    username:string
}|null

export interface Summoner{
    id:string,
    accountId:string,
    puuid:string,
    name:string,
    profileIconId:number,
    revisionDate:number,
    summonerLevel:number
}

export const regions = ['EUW','EUNE'] as const
export const codes = ['euw1','eun1'] as const

export const regionCodes:{
    [key in Region]:RegionCodes
} = {
    'EUW':'euw1',
    "EUNE":'eun1',
} as const

export const bigRegions:{
    [key in RegionCodes]:string
} = {
    'euw1':'EUROPE',
    'eun1':'EUROPE'
} as const

export type Region = typeof regions[number]
export type RegionCodes = typeof codes[number]

type roles = 'TOP'|'JUNGLE'|'MIDDLE'|'BOTTOM'|'UTILITY'|''

export interface Player{
    lane: roles,
    championId:number,
    championName:string,
    level:number,
    cs:number,
    csPerMin:number,
    damageDealt:number,
    damageTaken:number,
    kills:number,
    deaths:number,
    assists:number,
    kda:number,
    goldPerMinute:number,
    summoner1:number,
    summoner2:number,
    wardsKilled:number,
    wardsPlaced:number,
    visionScore:number,
    items:number[]
    runes:{
        primary:number[],
        secondary:number[]
    },
    puuid:string
}

export interface Team{
    win:boolean,
    barons:number,
    dragons:number,
    players:Player[]
}

export interface Match{
    id:string,
    teams:{
        blue:Team,
        red:Team,
    },
    minutes:number,
    seconds:number,
    player_puuid:string
}
export interface Matches{
    matches:Match[],
    error:string|null
}

export interface CommentType{
    id:number,
    content:string,
    username:string,
    replies:CommentType[]
}

export type RankedInfo = {
    leagueId: string,
    queueType: 'RANKED_SOLO_5x5'|'RANKED_TFT_DOUBLE_UP'|'RANKED_FLEX_SR',
    tier: string,
    rank: string,
    summonerId: string,
    summonerName: string,
    leaguePoints: number,
    wins: number,
    losses: number,
    veteran: boolean,
    inactive: boolean,
    freshBlood: boolean,
    hotStreak: boolean
}

export let internalError:Status = {
    error:true,
    status:'Internal error'
}
