import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    notificationCount: 0,
    chatIds: [],
    openedPage: null
}
const backend_url = import.meta.env.VITE_BACKEND_URL;
export const getInitialNotif = createAsyncThunk(
    'notif/getInitialState',
    async (_, thunkApi) => {
        try {
            const result = await axios.get(`${backend_url}/msg/get-unread-chatid`, { withCredentials: true });


            return result.data.notifData;


        } catch (err) {
            // console.log(err);
            return null;
        }
    }
)

const notificationSlice = createSlice({
    name: 'notif',
    initialState: initialState,
    reducers: {
        setNotif: (state, action) => {
            state.notificationCount = action.payload
        },
        setPage: (state, action) => {
            state.openedPage = action.payload
        },
        addChatId: (state, action) => {
            if (!state.chatIds.includes(action.payload)) {
                state.chatIds.push(action.payload)
            }
        },
        deleteChatId: (state, action) => {
            state.chatIds = state.chatIds.filter(id => id !== action.payload);
        },

        increaseNotif: (state, action) => {
            console.log(action.payload)
            console.log(state.notificationCount);
            console.log(action.payload + state.notificationCount)
            state.notificationCount = action.payload + state.notificationCount
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(getInitialNotif.fulfilled, (state, action) => {
                action.payload?.chatIds?.map((c) => {
                    if (!state.chatIds.includes(c)) {
                        state.chatIds.push(c);
                    }
                })
                state.notificationCount = parseInt(action.payload?.notificationCount) ?? 0
            })
    }
})

export const { setNotif, increaseNotif, addChatId, deleteChatId, setPage } = notificationSlice.actions;
export default notificationSlice.reducer;