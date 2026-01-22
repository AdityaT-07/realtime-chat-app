import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {axiosInstance} from '../../lib/axios';
import {toast} from 'react-toastify';


export const getUsers = createAsyncThunk('chat/getusers',async (_, thunkAPI)=>{
    try {
        const res = await axiosInstance.get('/message/users');
        // console.log(res.data);
        // console.log(res.data.user);
        
        return res.data.user;


    } catch (error) {
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})


export const getMessages = createAsyncThunk('chat/getMessages', async (userId, thunkAPI)=>{
    try {
        const res = await axiosInstance.get(`message/${userId}`)
        return res.data;
        
    } catch (error) {

        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
        
    }

})

export const sendMessage = createAsyncThunk('chat/sendMessage',  async({text,media},thunkAPI)=>{
    try {
        // const {chat} =thunkAPI.getState();
        // const res = await axiosInstance.post(`/message/send/${chat.selectedUser._id}`,messageData)
        // return res.data;

        const { chat } = thunkAPI.getState();

      if (!chat.selectedUser?._id) {
        return thunkAPI.rejectWithValue("No user selected");
      }

      const formData = new FormData();
      if (text) formData.append("text", text);
      if (media) formData.append("media", media);

      const res = await axiosInstance.post(
        `/message/send/${chat.selectedUser._id}`,
        formData
      );

      return res.data;
        
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
            // state.users = action.payload.users;


        },
        pushNewMessage : (state,action)=>{
            state.messages.push(action.payload)
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(getUsers.pending,(state)=>{
            state.isUserLoading = true;
        }).addCase(getUsers.fulfilled, (state,action)=>{
            // state.getUsers = action.payload;
            state.users = action.payload;
            state.isUserLoading = false; 
        }).addCase(getUsers.rejected, (state)=>{
            state.isUserLoading = false;
        }).addCase(getMessages.pending,(state)=>{
            state.isMessageLoading = true;
        }).addCase(getMessages.fulfilled,(state,action)=>{
            state.messages = action.payload.messages;
            state.isMessageLoading = false;
        }).addCase(getMessages.rejected,(state,action)=>{
            state.isMessageLoading = false;

        }).addCase(sendMessage.fulfilled,(state,action)=>{
            state.messages.push(action.payload)
        })
    }
})


export const {setSelectedUser,pushNewMessage} = chatSlice.actions;

export default chatSlice.reducer;