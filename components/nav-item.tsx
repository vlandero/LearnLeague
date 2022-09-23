import React from 'react'

export default function NavItem({link,children}:{link:string,children:JSX.Element|JSX.Element[]|string}) {
  return (
    <a className='w-full text-center button m-2' href={link}>{children}</a>
  )
}
