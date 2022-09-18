import React from 'react'

interface Props{
    children:JSX.Element[]|JSX.Element
    closeModal:()=>void
}

export default function Modal({children,closeModal}:Props) {
  return (
    <div>
        <div className='overlay' onClick={closeModal}></div>
        <div className='modal'>
            {children}
        </div>
    </div>
  )
}
