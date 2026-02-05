import { Avatar, Box, Button, Paper, Stack, Typography, ThemeProvider } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';
import toast from 'react-hot-toast';
import { addChatId, increaseNotif } from '../../store/notificationReducer/notifReducer';


function NotificationSystem({ customTheme }) {
    const notificationSoundRef = useRef(null);
    const { userInfo } = useSelector(state => state.auth);
    const { openedPage } = useSelector(state => state.notif);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        notificationSoundRef.current = new Audio('/msg-notification-sound.mp3');
        notificationSoundRef.current.volume = 0.6;
        if (userInfo?.username) {
            const handleOfflineMsgReceive = (data) => {
                if (notificationSoundRef.current) {
                    notificationSoundRef.current.currentTime = 0;
                    notificationSoundRef.current
                        .play()
                        .catch(() => {
                            // Autoplay blocked — happens if user hasn’t interacted yet
                        });
                }

                data?.map(d => {
                    dispatch(addChatId(d.id));
                    toast.custom((t) => {

                        socket.emit('msg_received', {
                            receiverId: d.id,
                            userId: userInfo.id,
                            msgIds: d.msg_ids
                        });
                        return (
                            <ThemeProvider theme={customTheme}>
                                <Paper elevation={3} sx={{ maxWidth: '320px', width: "100%", pointerEvents: "auto", animation: t.visible ? "fadeIn 0.3s ease-out" : "fadeOut 0.3s ease-in" }}>
                                    <Stack direction="row" spacing={1} p={1} alignItems="center">
                                        <Avatar src={d.image} sx={{ width: 30, height: 30 }} />
                                        <Box flex={1} onClick={() => { navigate(`/chats/${d.username}`); toast.dismiss(t.id) }} sx={{ cursor: 'pointer' }}>
                                            <Typography variant="body1" noWrap maxWidth={'150px'} textOverflow={'ellipsis'} fontSize={{ xs: '13px', sm: '15px' }} color='#fff' fontWeight={600}>
                                                {d.name}
                                            </Typography>
                                            <Typography textOverflow={'ellipsis'} noWrap maxWidth={'150px'} variant="body2" fontSize={{ xs: '10px', sm: '13px' }} color="text.secondary">
                                                {`${d.msg_count} new ${d.msg_count > 1 ? 'messages' : 'message'}.`}
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
                    }, {
                        duration: 4000
                    })
                })
            }
            const handleNotification = (data) => {
                
                dispatch(increaseNotif(1));
                
            }
            const handleMessageRecived = (data) => {

                if (notificationSoundRef.current) {
                    notificationSoundRef.current.currentTime = 0;
                    notificationSoundRef.current
                        .play()
                        .catch(() => {
                            // Autoplay blocked — happens if user hasn’t interacted yet
                        });
                }

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
                                    <Box flex={1} onClick={() => { toast.dismiss(t.id); navigate(`/chats/${data.username}`); }} sx={{ cursor: 'pointer' }}>
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
                }, {
                    duration: 4000
                })

            }
            socket.on('get_notify', ({ data }) => {
                if (data?.type == 'chat') {

                    dispatch(addChatId(data?.data?.id));
                    if (openedPage == 'chat') {
                        return;
                    }
                    handleMessageRecived(data.data);

                }
                if (data?.type == 'notification') {
                    handleNotification(data);


                }
            });
            socket.on('offline_notification', ({ type, data }) => {
                if (type == 'chat') {


                    if (openedPage == 'chat') {
                        return;
                    }
                    handleOfflineMsgReceive(data);
                }
                if (type == 'notification') {
                    handleNotification(data);
                }
            });

            return () => {
                socket.off('get_notify');
                socket.off('offline_notification');
            }
        }
    }, [userInfo, openedPage]);


}

export default NotificationSystem;
