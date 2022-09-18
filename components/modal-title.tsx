import React from 'react'
import {AiOutlineCloseCircle} from 'react-icons/ai'

interface Props{
  closeModal:()=>void,
  children:JSX.Element
}

export default function ModalTitle({closeModal,children}:Props) {
  return (
    <div className='add-game-modal-title'>
        {children}
        <div className='cursor-pointer flex justify-center items-center' onClick={closeModal}>
          <AiOutlineCloseCircle />
        </div>
      </div>
  )
}
