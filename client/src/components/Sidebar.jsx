import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import SidebarSkeleton from './skeletons/SidebarSkeleton'

const Sidebar = () => {

  const [showOnlineOnly, setshowOnlineOnly] = useState(false);

  const {users,selectedUser,isUserLoading} = useSelector((state)=>state.chat)
  const {onlineUsers} = useSelector((state)=>state.auth);

  const dispatch = useDispatch();

  useEffect(()=>{
    // dispatch(getUsers())
  },dispatch);

  const filteredUsers = showOnlineOnly ? 
  users.filter((user) => onlineUsers.includes(user._id))
   : users;

  if(isUserLoading) return <SidebarSkeleton />

  return <>
  
  
  
  </>;
};

export default Sidebar;
