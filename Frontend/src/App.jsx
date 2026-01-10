import { ThemeProvider } from '@mui/material';
import { customTheme } from './utils/theme.js';
import { publicRoutes } from './routes/route/publicRoute.jsx';
import { useEffect, useState } from 'react';
import Router from './routes/router.jsx';
import { getAllRoutes } from './routes/route/index.jsx';
import { useDispatch } from 'react-redux';
import { getInitialState } from './store/authReducer/authReducer.js';
import Toaster from './views/components/Toaster.jsx';

function App() {
    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getInitialState());
        const routes = getAllRoutes();
        setAllRoutes(prev => [...prev, routes]);

    }, []);
    return (
        <>
            <ThemeProvider theme={customTheme}>

                <Router allRoutes={allRoutes} />
                
                <Toaster/>
            </ThemeProvider>

        </>
    )
}

export default App;