import { useEffect, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { getMessages } from '../store/slices/chatSlice';
import{getSocket} from '../lib/socket'
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton'
import MessageInput from './MessageInput'

const ChatContainer = () => {
  
  const {messages, isMessageLoading, selectedUser} = useSelector((state) => state.chat)
  const { authUser} = useSelector((state) =>state.auth);

  const dispatch = useDispatch()

  const messageEndRef = useRef(null);

  useEffect(()=>{
    dispatch(getMessages(selectedUser._id));
  },[selectedUser._id])
  
  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior : 'smooth'})
    }
  },[messages])
  
  function formatMessageTime(date){
    return new Date(date).toLocaleTimeString('en-US',{
      hour : '2-digit',
      minute : '2-digit',
      hour12 : false,
    })
  }


  useEffect(()=>{
    if(!selectedUser?._id) return;

    dispatch(getMessages(selectedUser._id))

    const socket = getSocket();

    if(!socket) return;
  },selectedUser?._id)

  if(isMessageLoading){
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }
  
  
  
  return <>
  
  
  
  </>;
};

export default ChatContainer;
