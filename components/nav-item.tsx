import React from 'react'

export default function NavItem({link,children,className}:{link:string,children:JSX.Element|JSX.Element[]|string,className?:string}) {
  return (
    <a className={className} href={link}><span>{children}</span></a>
  )
}
