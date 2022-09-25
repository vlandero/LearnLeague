import { useState } from 'react';
import { useAuth } from '../wrappers/state';
import NavItem from './nav-item';
import { AiOutlineArrowLeft } from 'react-icons/ai';


export default function Nav() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const { user } = useAuth();
  const renderProfile = (className:string): JSX.Element | null => {
    if(user === null)
      return null;
    return(
      <NavItem className={className} link={`/profile/${user.username}`}>{user.username}</NavItem>
    );
  }
  const openSideBar = () => {
    return (
      <svg
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed z-30 flex items-center cursor-pointer left-10 top-6 sm:hidden"
        fill="#2563EB"
        viewBox="0 0 100 100"
        width="40"
        height="40"
      >
        <rect width="100" height="10"></rect>
        <rect y="30" width="100" height="10"></rect>
        <rect y="60" width="100" height="10"></rect>
      </svg>
    )
  }
  return (
    <>
      {openSideBar()}
      <div className={`top-0 left-0 w-[40vw] max-w-[300px] bg-navBlue text-white fixed h-full z-40 ease-in-out duration-300 ${
        showSidebar ? "translate-x-0 " : "-translate-x-full"} sm:hidden`}>
        <AiOutlineArrowLeft className='cursor-pointer' size={30} onClick={()=>setShowSidebar(false)}></AiOutlineArrowLeft>
        <div className='flex flex-col justify-around items-center'>
          <NavItem className='mobile-nav-button' link='/'>Home</NavItem>
          <NavItem className='mobile-nav-button' link='/explore'>Explore</NavItem>
          <NavItem className='mobile-nav-button' link='/login'>Login</NavItem>
          <NavItem className='mobile-nav-button' link='/register'>Register</NavItem>
          {renderProfile('mobile-nav-button')}
        </div>
      </div>
      <div className='hidden sm:flex flex-row items-center absolute top-0 w-[100vw] min-h-[60px] h-[60px] bg-navBlue'>
        <div className='ml-auto mr-2 h-full flex flex-row  w-1/2 max-w-[600px] justify-between relative'>
          <NavItem className='nav-button' link='/'>Home</NavItem>
          <NavItem className='nav-button' link='/explore'>Explore</NavItem>
          <NavItem className='nav-button' link='/login'>Login</NavItem>
          <NavItem className='nav-button' link='/register'>Register</NavItem>
          {renderProfile('nav-button')}
        </div>
      </div>
    </>
  )
}
