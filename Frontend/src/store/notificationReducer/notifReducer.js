import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    notificationCount: {
        chat: 0,
        notification: 0

    }
}
const notificationSlice = createSlice({
    name: 'notif',
    initialState: initialState,
    reducers: {
        setNotif: (state, action) => {
            if (action.payload.chat) {
                state.notificationCount.chat = action.payload.chat
            }
            if (action.payload.notification) {
                state.notificationCount.notification = action.payload.notification
            }
        },
        increaseNotif: (state, action) => {
            if (action.payload.chat) {
                state.notificationCount.chat = action.payload.chat + state.notificationCount.chat
            }
            if (action.payload.notification) {
                state.notificationCount.notification = action.payload.notification + state.notificationCount.notification
            }
        }
    },
    extraReducers: (builder) => {

    }
})

export const {setNotif,increaseNotif } = notificationSlice.actions;
export default notificationSlice.reducer;