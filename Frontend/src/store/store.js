import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authReducer/authReducer.js';
import notificationReducer from './notificationReducer/notifReducer.js';

export const store = configureStore({
    reducer:{
        auth:authReducer,
        notif:notificationReducer
    }
});