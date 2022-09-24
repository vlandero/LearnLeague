import React from 'react'

export default function NavItem({link,children}:{link:string,children:JSX.Element|JSX.Element[]|string}) {
  return (
    <a className='w-4/5 text-center button mt-4' href={link}>{children}</a>
  )
}
