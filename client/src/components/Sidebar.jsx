import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import SidebarSkeleton from './skeletons/SidebarSkeleton'
import { getUsers } from "../store/slices/chatSlice";
import { User } from "lucide-react";

const Sidebar = () => {

  const [showOnlineOnly, setshowOnlineOnly] = useState(false);

  const {users,selectedUser,isUserLoading} = useSelector((state)=>state.chat)
  const {onlineUsers} = useSelector((state)=>state.auth);

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getUsers())
  },dispatch);

  const filteredUsers = showOnlineOnly ? 
  users.filter((user) => onlineUsers.includes(user._id))
   : users;

  if(isUserLoading) return <SidebarSkeleton />

  return <>
  <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white">
    {/* header */}
    <div className="border-b  border-gray-200  w-full p-5">
      <div className="flex items-center gap-2">
        <User className="w-6 h-6 text-gray-700"/>
        <span className="font-medium hidden lg:block text-gray-800 ">Contacts</span>
      </div>

    {/* online only filter */}

    <div className="mt3 hidden lg:flex items-center gap-2">
      <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" 
        checked ={showOnlineOnly}
         onChange={(e)=> setshowOnlineOnly(e.target.checked)}
         className="w-4 h-4 border-gray-700 text-blue-600 focus:ring-blue-500"
         /> 
         Show Only Online
      </label>
      <span className="text-xs text-gray-500 ">
        ({onlineUsers.length -1} online)
      </span>
    </div>


    </div>
  </aside>
  
  
  </>;
};

export default Sidebar;
