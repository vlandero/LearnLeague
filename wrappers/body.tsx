import React from 'react'

export default function Body({children}:{children:JSX.Element|JSX.Element[]}) {
  return (
    <div style={{
      width:'90%',
      maxWidth:'1600px',
      margin:'70px auto'
    }}>
        {children}
    </div>
  )
}
