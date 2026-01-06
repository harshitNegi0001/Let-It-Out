import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const backend_url = import.meta.env.VITE_BACKEND_URL;


export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkApi) => {
        try {
            const result = await axios.post(`${backend_url}/api/logout`, {}, { withCredentials: true });

            return result.data.message
        } catch (err) {
            console.log(err?.response?.data?.error);
            return thunkApi.rejectWithValue(null);
        }
    }
)
export const getInitialState = createAsyncThunk(
    'auth/getInitialState',
    async (_, thunkApi) => {
        try {
            const result = await axios.get(`${backend_url}/api/me`, { withCredentials: true });


            return result.data.userInfo;


        } catch (err) {
            // console.log(err);
            return null;
        }
    }
)
const authSlice = createSlice({
    name: "auth",
    initialState: {
        userInfo: null,
        isLoading: false,
        error: null,
        success: null
    },
    reducers: {
        reset: (state) => {
            state.userInfo = null
            state.isLoading = false
        },
        login: (state, action) => {
            state.userInfo = action.payload.userInfo
            state.isLoading = false
        },
        setState: (state, action) => {
            if ("userInfo" in action.payload) {
                state.userInfo = action.payload.userInfo
            }
            if ("isLoading" in action.payload) {
                state.isLoading = action.payload.isLoading
            }
            if ("error" in action.payload) {
                state.error = action.payload.error
            }
            if ("success" in action.payload) {
                state.success = action.payload.success
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInitialState.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getInitialState.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(getInitialState.fulfilled, (state, action) => {
                state.userInfo = action.payload
                state.isLoading = false
            })

            .addCase(logout.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.userInfo = null
                state.isLoading = false
            })
    }
})



export const { login, reset, setState } = authSlice.actions;
export default authSlice.reducer;