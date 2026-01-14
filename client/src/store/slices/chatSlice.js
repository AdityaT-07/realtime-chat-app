import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {axiosInstance} from '../../lib/socket';
import {toast} from 'react-toastify';


export const getUsers = createAsyncThunk('chat/getusers',async (_, thunkAPI)=>{
    try {
        const res = await axiosInstance.get('/message/users');
        return res.data.users;


    } catch (error) {
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

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

export default chatSlice.reducer;