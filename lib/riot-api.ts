
import axios from "axios"
import { AxiosResponse } from "axios"
import { bigRegions, Region, regionCodes, RegionCodes } from "./interfaces"
import { Match, Player, Summoner, Team, RankedInfo, internalError, Status } from "./interfaces"

const riotapi = process.env.RIOTAPI

export class League{

    public static async summoner(name:string,region:string):Promise<Summoner> {
        console.log(name,region);
        let result:AxiosResponse<any, any>
        const config = {
            method:'GET',
            url:'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + name,
            headers:{"X-Riot-Token": riotapi||''}
        }
        
        try{
            result = await axios(config);
            console.log('object');
        }
        catch(err){
            throw err
        }
        let summoner:Summoner = result.data
        return summoner
    }

    public static async ranked_info(encID:string,reg:Region):Promise<Status>{
        let result:AxiosResponse<RankedInfo[]>
        let soloq:RankedInfo|null = null
        const config = {
            method:'get',
            url:'https://' + regionCodes[reg] + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + encID,
            headers:{"X-Riot-Token": riotapi||''}
        }
        try{
            result = await axios(config)
            for(let info of result.data)
                if(info.queueType === 'RANKED_SOLO_5x5'){
                    soloq = info
                    break;
                }
            if(soloq === null)
                return{
                    error:true,
                    status:'No soloq games on this account'
                }
            return{
                error:false,
                status:JSON.stringify(soloq)
            }
        }
        catch(err){
            console.log(err)
            return internalError
        }
    }

    public static async match_history(puuid:string,reg:RegionCodes):Promise<Match[]>{
        let region = bigRegions[reg];
        const config = {
            method:'get',
            url:'https://' + region + '.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids',
            headers:{"X-Riot-Token": riotapi||''}
        }
        let fullmatches = await axios(config);
        let matches:Match[] = [];
        for(let i = 0; i < 2; ++i){
            let matchID:string = fullmatches.data[i];
            let fullMatch = await axios({
                method:'get',
                url:'https://' + region + '.api.riotgames.com/lol/match/v5/matches/' + matchID,
                headers:{"X-Riot-Token": riotapi||''}
            });
            let match:Match;
            let players:Player[] = [];
            for(let participant of fullMatch.data.info.participants){
                let prov:Player = {
                    lane:participant.teamPosition,
                    championId:participant.championId,
                    championName : participant.championName,
                    level : participant.champLevel,
                    cs : participant.totalMinionsKilled + participant.neutralMinionsKilled,
                    csPerMin : (participant.totalMinionsKilled + participant.neutralMinionsKilled) / (fullMatch.data.info.gameDuration / 60),
                    damageDealt : participant.totalDamageDealtToChampions,
                    damageTaken : participant.totalDamageTaken,
                    kills : participant.kills,
                    deaths : participant.deaths,
                    assists : participant.assists,
                    kda : participant.challenges.kda,
                    goldPerMinute : participant.challenges.goldPerMinute,
                    summoner1 : participant.summoner1Id,
                    summoner2 : participant.summoner2Id,
                    wardsKilled : participant.wardsKilled,
                    wardsPlaced : participant.wardsPlaced,
                    visionScore : participant.visionScore,
                    items : [
                        participant.item1,
                        participant.item2,
                        participant.item3,
                        participant.item4,
                        participant.item5,
                        participant.item6,
                    ],
                    runes: {
                        primary : [
                            participant.perks.styles[0].selections[0].perk,
                            participant.perks.styles[0].selections[1].perk,
                            participant.perks.styles[0].selections[2].perk,
                            participant.perks.styles[0].selections[3].perk,
                        ],
                        secondary : [
                            participant.perks.styles[1].selections[0].perk,
                            participant.perks.styles[1].selections[1].perk,
                        ],
                    },
                    puuid : participant.puuid,
                }
                players.push(prov)
            }
            let calculateDragons = (start:number,end:number):number => {
                let res = 0
                for(let i = start; i < end; ++i){
                    res += fullMatch.data.info.participants[i].dragonKills
                }
                return res
            }
            let teams:{
                red:Team,
                blue:Team
            } = {
                red:{
                    win: fullMatch.data.info.participants[0].win,
                    barons:fullMatch.data.info.participants[0].challenges.teamBaronKills,
                    dragons:calculateDragons(0,5),
                    players:[],
                },
                blue:{
                    win : fullMatch.data.info.participants[5].win,
                    barons:fullMatch.data.info.participants[5].challenges.teamBaronKills,
                    dragons:calculateDragons(5,10),
                    players:[],
                }
            };
            for(let i = 0; i < 5; ++i)
                teams.blue.players.push(players[i]);
            
            for(let i = 0; i < 5; ++i)
                teams.red.players.push(players[5 + i]);
            
            match = {
                id:matchID,
                teams:teams,
                minutes: Math.floor(fullMatch.data.info.gameDuration / 60),
                seconds: fullMatch.data.info.gameDuration % 60,
                player_puuid:puuid
            }
            matches.push(match)
        }
        return matches
    }
}