import { useState } from 'react';
import { useAuth } from '../wrappers/state';
import NavItem from './nav-item';
import { AiOutlineArrowLeft } from 'react-icons/ai';


export default function Nav() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const { user } = useAuth();
  const renderProfile = (): JSX.Element | null => {
    if(user === null)
      return null;
    return(
      <NavItem link={`/profile/${user.username}`}>{user.username}</NavItem>
    );
  }
  const openSideBar = () => {
    return (
      <svg
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed  z-30 flex items-center cursor-pointer left-10 top-6"
        fill="#2563EB"
        viewBox="0 0 100 80"
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
      <div className={`top-0 left-0 w-[40vw] max-w-[300px] bg-blue-600 text-white fixed h-full z-40 ease-in-out duration-300 ${
        showSidebar ? "translate-x-0 " : "-translate-x-full"}`}>
        <AiOutlineArrowLeft className='cursor-pointer' size={30} onClick={()=>setShowSidebar(false)}></AiOutlineArrowLeft>
        <div className='flex flex-col justify-around items-center'>
          <NavItem link='/'>Home</NavItem>
          <NavItem link='/explore'>Explore</NavItem>
          <NavItem link='/login'>Login</NavItem>
          <NavItem link='/register'>Register</NavItem>
          {renderProfile()}
        </div>
        
      </div>
    </>
  )
}
