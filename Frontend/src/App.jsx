import { ThemeProvider } from '@mui/material';
import { customTheme } from './utils/theme.js';
import { publicRoutes } from './routes/route/publicRoute.jsx';
import { useEffect, useState } from 'react';
import Router from './routes/router.jsx';
import { getAllRoutes } from './routes/route/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getInitialState } from './store/authReducer/authReducer.js';
import Toaster from './views/components/Toaster.jsx';

import socket from './utils/socket.js';
import NotificationSystem from './views/components/MessageSystem.jsx';

function App() {
    const { userInfo } = useSelector(state => state.auth);
    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getInitialState());
        const routes = getAllRoutes();
        setAllRoutes(prev => [...prev, routes]);

    }, []);
    useEffect(() => {


        if (userInfo?.id) {




            socket.auth = {
                userId: userInfo.id
            }
            socket.connect();



            return () => {
                socket.disconnect();

            }
        }

    }, [userInfo]);
    return (
        <>
            <ThemeProvider theme={customTheme}>
                <NotificationSystem customTheme={customTheme}/>
                <Router allRoutes={allRoutes} />

                <Toaster />
            </ThemeProvider>

        </>
    )
}

export default App;