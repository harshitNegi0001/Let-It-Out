import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authReducer/authReducer.js';


export const store = configureStore({
    reducer:{
        auth:authReducer
    }
});