import React from 'react'
import { useAuth } from '../context/state'
import NavItem from './nav-item';

export default function Nav() {
  const { user } = useAuth();
  const renderProfile = (): JSX.Element | null => {
    if(user === null)
      return null;
    return(
      <NavItem link={`/profile/${user.username}`}>{user.username}</NavItem>
    );
  }
  return (
    <div className='w-1/3 flex justify-between'>
      <NavItem link='/explore'>Explore</NavItem>
      <NavItem link='/login'>Login</NavItem>
      <NavItem link='/register'>Register</NavItem>
      {renderProfile()}
    </div>
  )
}
