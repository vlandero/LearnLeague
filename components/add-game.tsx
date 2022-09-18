import React,{useState} from 'react'

import Modal from './modal'
import {Match, Status, SummonerInDB} from '../lib/interfaces'
import ChooseGame from './choose-game'
import GamePreview from './game-preview'
import ModalTitle from './modal-title'
import {IoArrowBackCircle} from 'react-icons/io5'
import { ApiService } from '../lib/ApiCalls'

interface Props{
  isOpen:boolean
  setOpen:React.Dispatch<React.SetStateAction<boolean>>
  username:string
  setTrigger:React.Dispatch<React.SetStateAction<boolean>>
  accounts:SummonerInDB[]
}

export type MatchDetails = {
  description:string,
  questions:string,
  match:Match|null
}

let basicMatchDetails:MatchDetails = {
  description:'',
  questions:'',
  match:null
}

export default function AddGame({isOpen,setOpen,username,setTrigger,accounts}:Props) {
  
  const [matchDetails, setMatchDetails] = useState<MatchDetails>(basicMatchDetails)
  const [chooseMatchActive, setChooseMatchActive] = useState(false)
  const [message, setMessage] = useState<string|null>(null)

  function closeModal(){
    setOpen(false)
    setChooseMatchActive(false)
    setMatchDetails(basicMatchDetails)
    setMessage(null)
  }
  function handleChange(e:React.ChangeEvent<HTMLTextAreaElement>){

    if(e.target.name==="description")
      setMatchDetails({...matchDetails,description:e.target.value})
    if(e.target.name==="questions")
      setMatchDetails({...matchDetails,questions:e.target.value})
        
}
  async function addGame(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    if(matchDetails.match===null)
      return setMessage('Please select a game')
    if(matchDetails.description===''||matchDetails.questions==='')
      return setMessage('Please complete the boxes above')
    let dataToSend = {
      json: JSON.stringify(matchDetails.match),
      description:matchDetails.description,
      questions:matchDetails.questions,
      username:username
    }
    let promise = await ApiService.post('addgame',dataToSend,{})
    let result:Status = await promise
    console.log(result);
    if(result.error)
      return setMessage(result.status)
    closeModal()
    window.location.href = `/explore/${result.status}`
    
  }
  const renderGamePreview = () => {
    let {match} = matchDetails
    if(match === null)
      return(
        <div className='button' onClick={()=>{setChooseMatchActive(true)}}>Select game</div>
      )
    return(
      <GamePreview onClick={()=>{setChooseMatchActive(true)}} match={matchDetails.match}></GamePreview>
    )
  }
  if(!isOpen)
    return null
  if(chooseMatchActive)
    return(
      <Modal closeModal={closeModal}>
        <ModalTitle closeModal={closeModal}>
          <div className='flex justify-center items-center align-middle'>
            <IoArrowBackCircle onClick={()=>{setChooseMatchActive(false)}} className='cursor-pointer mr-1'></IoArrowBackCircle>
            <h3>Choose</h3>
          </div>
        </ModalTitle>
        <ChooseGame accounts={accounts} goBack={()=>{setChooseMatchActive(false)}} setMatchDetails={setMatchDetails} matchDetails={matchDetails}></ChooseGame>
      </Modal>
    )
  return (
    <Modal closeModal={closeModal}>
      <ModalTitle closeModal={closeModal}>
        <h3>Title</h3>
      </ModalTitle>
      <div className="add-game-modal-body">
        <form onSubmit={addGame}>
          <div>
            {renderGamePreview()}
          </div>
          <label htmlFor="description">Why do you think you won/lost? How could you have played better?</label>
          <br/>
          <textarea onChange={handleChange} name='description'></textarea>
          <br/>
          <label htmlFor="questions">Any questions for the community about this game?</label>
          <br/>
          <textarea onChange={handleChange} name='questions'></textarea>
          <br/>
          <input className='button' type="submit" value="Add game" />
        </form>
      </div>
      <p>{message}</p>
    </Modal>

  )
}
