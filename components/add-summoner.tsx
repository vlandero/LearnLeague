import React,{useState} from 'react'
import Modal from './modal'
import ModalTitle from './modal-title'
import { Region, RegionCodes, regionCodes, regions } from '../lib/interfaces'
import { ApiService } from '../lib/ApiCalls'
import { Status, User } from '../lib/interfaces'

interface RegionHTMLSelectElement extends HTMLSelectElement{
    value:Region
}

interface SelectEvent extends React.ChangeEvent<HTMLSelectElement>{
    target:EventTarget & RegionHTMLSelectElement
}

interface Props{
    close:()=>void,
    isOpen:boolean,
    user:User,
    setTrigger:React.Dispatch<React.SetStateAction<boolean>>
}

const iconURL = (id:number)=>{
    return `http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/${id}.png`
} 

export default function AddSummoner({isOpen,close,user,setTrigger}:Props) {
    const [summonerName, setsummonerName] = useState('')
    const [region, setRegion] = useState<Region>('EUNE')
    const [message, setMessage] = useState('')
    const [summonerOK, setSummonerOK] = useState(false)
    const iconId = Math.floor(Math.random() * 30)

    function closeModal(){
        close();
        setSummonerOK(false)
        setsummonerName('')
        setMessage('')
    }

    function renderSwitchIcon(){
        
        if(!summonerOK)
            return null
        return(
            <div>
                <p>Change your summoner icon to the icon below to verify the account.</p>
                <img src={iconURL(iconId)}></img>
                <button className='button' onClick={async ()=>{
                    let promise = await ApiService.post(`/riot/checkicon`,{id:iconId,summonerName:summonerName,region:region,user:user},{})
                    let result:Status = await promise
                    console.log(result)
                    if(result.error)
                        return setMessage(result.status)
                    setMessage('Account added')
                    closeModal()
                    setTrigger(prev=>!prev)
                    
                }}>Verify</button>
            </div>
        )
    }

    if(!isOpen)
        return null
  return (
    <Modal closeModal={closeModal}>
        <ModalTitle closeModal={closeModal}>
            <div>Title</div>
        </ModalTitle>
        <div>
            <form className='flex flex-col w-2/6' onSubmit={async (e)=>{
                e.preventDefault()
                setSummonerOK(false)
                setMessage('')
                let promise = await ApiService.get(`/riot/${summonerName}/${region}`,{})
                let res:Status = await promise
                if(res.error === false)
                    return setSummonerOK(true)

                setMessage(res.status)
                
            }}>
                <input value={summonerName} type="text" placeholder="Summoner Name" name="summoner" onChange={(e)=>{setsummonerName(e.target.value);setSummonerOK(false);setMessage('')}}/>
                
                <select value={region} onChange={(e:SelectEvent)=>{setRegion(e.target.value)}} name="region">
                    {regions.map(reg => 
                        <option key={reg} value={reg}>{reg}</option>
                    )}
                </select>
                <input className='button' type="submit" value="Search" />
            </form>
            {renderSwitchIcon()}
            <p>{message}</p>
        </div>
    </Modal>
  )
}
