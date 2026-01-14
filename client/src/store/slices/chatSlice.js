import {createSlice} from '@reduxjs/toolkit'


const chatSlice = createSlice({
    name : 'chat',
    initialState : {
        messages : [],
        users : [],
        selectedUser : null,
        isUserLoading : false,
        isMessageLoading : false,
    },
    reducers :{
        setSelectedUser : (state,action)=>{
            state.selectedUser = action.payload;

        },
        pushNewMessage : (state,action)=>{
            state.messages.push(action.payload)
        }
    }
})


export const {setSelectedUser,pushNewMessage} = chatSlice.actions;