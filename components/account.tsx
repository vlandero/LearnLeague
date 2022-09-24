import {useState} from 'react'
import { ApiService } from '../lib/ApiCalls'
import { Status, SummonerInDB } from '../lib/interfaces'

interface Props{
    account:SummonerInDB,
    canEdit:boolean,
    setTrigger:React.Dispatch<React.SetStateAction<boolean>>
}

export default function Account({account,canEdit,setTrigger}:Props) {
  const [buttonText, setButtonText] = useState<string>('Refresh');
  const [canRefresh, setCanRefresh] = useState(true)
  const refresh = async () => {
    if(!canRefresh)
      return alert('You already refreshed');
    const res: Status = await ApiService.post('/riot/refreshsummoner',{id:account.id,region:account.region},{});
    console.log(res);
    if(res.error){
      return alert(res.status);
    }
    setTrigger(prev=>!prev);
    setButtonText('Refreshed');
    setCanRefresh(false);
  }

  const refreshButton = () => {
    if(!canEdit)
      return null;
    return (
      <div className='flex-1 flex justify-center items-center'>
        <button className='button text-white h-1/2' onClick={refresh}>{buttonText}</button>
      </div>
    )
  }
  
  return (
    <div className='flex max-w-sm h-28 bg-slate-700 p-3'>
      <div className='flex-1 flex flex-col text-center justify-center'>
        <p className='text-white'>{account.region}</p>
        <p className='text-white'>{account.summoner_name}</p>
        <p className='text-white'>{account.tier} {account.rank} {account.lp} LP</p>
      </div>
      <div className='flex-1'>
        <img className='h-full ml-auto mr-auto' src={`/ranked-emblems/${account.tier}.png`} alt={`${account.tier} ${account.rank}`} />
      </div>
      {refreshButton()}
    </div>
  )
}
