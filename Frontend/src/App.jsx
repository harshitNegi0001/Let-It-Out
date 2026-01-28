import { Avatar, Box, Button, Paper, Stack, ThemeProvider, Typography } from '@mui/material';
import { customTheme } from './utils/theme.js';
import { publicRoutes } from './routes/route/publicRoute.jsx';
import { useEffect, useState } from 'react';
import Router from './routes/router.jsx';
import { getAllRoutes } from './routes/route/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getInitialState } from './store/authReducer/authReducer.js';
import Toaster from './views/components/Toaster.jsx';

import socket from './utils/socket.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function App() {
    const { userInfo } = useSelector(state => state.auth);
    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getInitialState());
        const routes = getAllRoutes();
        setAllRoutes(prev => [...prev, routes]);

    }, []);
    useEffect(() => {

        if (userInfo?.username) {

            const handleMessageRecived = (data) => {
                toast.custom((t) => {
                    socket.emit('msg_received', {
                        receiverId: data.id,
                        userId: userInfo.id,
                        msgIds: [data.msg_id]
                    });
                    return (
                        <ThemeProvider theme={customTheme}>
                            <Paper elevation={3} sx={{ maxWidth: '320px', width: "100%", pointerEvents: "auto", animation: t.visible ? "fadeIn 0.3s ease-out" : "fadeOut 0.3s ease-in" }}>
                                <Stack direction="row" spacing={1} p={1} alignItems="center">
                                    <Avatar src={data.image} sx={{ width: 30, height: 30 }} />
                                    <Box flex={1} onClick={() => navigate(`/chats/${data.username}`)} sx={{ cursor: 'pointer' }}>
                                        <Typography variant="body1" noWrap maxWidth={'150px'} textOverflow={'ellipsis'} fontSize={{ xs: '13px', sm: '15px' }} color='#fff' fontWeight={600}>
                                            {data.name}
                                        </Typography>
                                        <Typography textOverflow={'ellipsis'} noWrap maxWidth={'150px'} variant="body2" fontSize={{ xs: '10px', sm: '13px' }} color="text.secondary">
                                            {data.message}
                                        </Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        color='secondary'
                                        onClick={() => toast.dismiss(t.id)}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                            </Paper>
                        </ThemeProvider>

                    )
                })
            }
            const handleNotification = (data) => {

            }
            socket.auth = {
                userId: userInfo.id
            }
            socket.connect(socket.id, userInfo?.username);
            socket.on('get_notify', ({ data }) => {
                if (data?.type == 'chat') {
                    handleMessageRecived(data.data);
                }
                if (data?.type == 'notification') {
                    handleNotification(data);
                }
            })


            return () => {
                socket.disconnect();
                socket.off('get_notify')
            }
        }

    }, [userInfo]);
    return (
        <>
            <ThemeProvider theme={customTheme}>
                <Router allRoutes={allRoutes} />

                <Toaster />
            </ThemeProvider>

        </>
    )
}

export default App;