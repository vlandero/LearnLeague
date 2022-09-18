import React, { useState } from 'react'

interface Props{
    add:(comment:string)=>Promise<void>
}

export default function AddComment({add}:Props) {
    const [text, setText] = useState('')
  return (
    <div>
        <textarea placeholder='Type your comment' value={text} onChange={(e)=>{setText(e.target.value)}}></textarea>
        <br></br>
        <button className='button' onClick={()=>{add(text); setText('')}}>Add comment</button>
    </div>
  )
}
