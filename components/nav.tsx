import React from 'react'

export default function Nav() {
  return (
    <div className='w-1/3 flex justify-between'>
      <a className='w-full text-center button m-2' href='/explore'>Explore</a>
      <a className='w-full text-center button m-2' href='/login'>Login</a>
      <a className='w-full text-center button m-2' href='/register'>Register</a>
      <a className='w-full text-center button m-2' href='/profile'>Profile</a>
    </div>
  )
}
