import { Avatar, Badge, Box, Button, Chip, Divider, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AddCommentIcon from '@mui/icons-material/AddComment';

import { useDispatch } from "react-redux";
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";
import ChattingComponent from "./components/ChattingComponent";
import socket from "../utils/socket";
import { setPage } from "../store/notificationReducer/notifReducer";


const formatChatDate = (dateStr) => {
    const date = new Date(dateStr);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) {
        return 'Today';
    }

    if (isSameDay(date, yesterday)) {
        return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';

    // remove microseconds + force UTC
    const cleaned = dateStr.split('.')[0] + 'Z';
    const date = new Date(cleaned);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).toLowerCase();
};


function Messages() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [chatlist, setChatlist] = useState([]);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const backend_url = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        dispatch(setPage('chat'));

        getChatlist();
        socket.on('add-online', ({ online_userId }) => {
            setChatlist(prev => {
                return prev.map(u => {
                    return (u.id == online_userId) ? { ...u, online_status: true } : u
                });
            });
        });
        socket.on('remove-online', ({ online_userId }) => {
            setChatlist(prev => {
                return prev.map(u => {
                    return (u.id == online_userId) ? { ...u, online_status: false } : u
                })
            });
        });
        const handleTyping = ({ userId }) => {
            setChatlist(prev => {
                return prev.map(u => {
                    {
                        return (userId == u.id) ? { ...u, isTyping: true } : u
                    }
                })
            })
        };
        const handleStopTyping = ({ userId }) => {
            setChatlist(prev => {
                return prev.map(u => {
                    {
                        return (userId == u.id) ? { ...u, isTyping: false } : u
                    }
                })
            })
        };
        const handleSeen = ({ userId }) => {
            setChatlist(prev => {
                return prev.map(u => (u.id == userId) ? { ...u, last_message: { ...u.last_message, is_read: true } } : u)
            })
        }
        const handleDoubletTick = ({ userId }) => {
            setChatlist(prev => {
                return prev.map(u => (u.id == userId) ? { ...u, last_message: { ...u.last_message, is_delivered: true } } : u)
            })
        }
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);
        socket.on('user_get_msg', handleDoubletTick);
        socket.on('user_read_msg', handleSeen);
        socket.on('receive_msg', async ({ wrappedMessage }) => {
            try {
                const result = await axios.get(`${backend_url}/msg/get-my-chatlist`,
                    {
                        withCredentials: true
                    }
                );

                setChatlist(result?.data?.chatlist);
                socket.emit('msg_received', ({
                    receiverId: wrappedMessage.messages[0].sender_id,
                    userId: wrappedMessage.messages[0].receiver_id,
                    msgIds: wrappedMessage.messages.map(m => m.id)
                }));
            } catch (err) {
                dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
            }
        })
        return (() => {

            dispatch(setPage(null));

            setChatlist([]);
            socket.off('add-online');
            socket.off('receive_msg');
            socket.off('remove-online');
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
            socket.off('user_read_msg', handleSeen);
        });

    }, [])


    const getChatlist = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(`${backend_url}/msg/get-my-chatlist`,
                {
                    withCredentials: true
                }
            );
            setIsLoading(false);

            setChatlist(result?.data?.chatlist);
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
        }
    }


    return (
        <>
            <Stack width={'100%'} alignItems={"center"} position={'relative'} height={{ sm: '100%', xs: 'calc(100% - 110px)' }} boxSizing={'border-box'}>

                {!username && <Stack sx={{ boxSizing: 'border-box', overflowY: 'scroll', scrollbarWidth: 'none' }} direction={'column'} width={'100%'} height={'100%'}>
                    <IconButton onClick={() => navigate('/new-chat')} size="large" title="New chat" sx={{ bgcolor: 'secondary.main', position: 'absolute', zIndex: 99, bottom: '15px', right: '15px', '&:hover': { bgcolor: 'secondary.dark', color: 'text.secondary' } }}>
                        <AddCommentIcon />
                    </IconButton>
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: "column", gap: '4px' }} p={1} pb={2} >
                        <Typography variant="h6" fontSize={{ xs: '24px', sm: '28px' }} color="#fff">
                            Messages
                        </Typography>
                        <Typography variant="body2" fontSize={{ xs: '10px', sm: '14px' }} color="text.secondary">
                            Chats will appear here after you send or receive a message
                        </Typography>

                    </Box>
                    <Divider />
                    {chatlist.map(u =>
                        <Button sx={{ p: 0, m: 0, borderRadius: '0' }} key={u.id} color="secondary" onClick={() => navigate(`/chats/${u.username}`)}>
                            <Box width={'100%'} minHeight={'60px'} display={'flex'} justifyContent={'start'} p={1} gap={2} >
                                <Badge variant="dot" overlap="circular" invisible={!u.online_status} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} color="success">
                                    <Avatar sx={{ width: '50px', height: "50px" }} src={u.image} >
                                        {/* {u.image && <img src={u.image} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '25px' }} alt="" />} */}
                                    </Avatar>
                                </Badge>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc( 100% - 75px)', alignItems: 'start' }}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body1" color="text.primary" width={'calc(100% - 65px)'} noWrap textOverflow={'ellipsis'} textAlign={'start'} component={'span'}>{u.fake_name || u.name}</Typography>
                                        <Typography variant="body2" fontSize={10} component={'span'} color="text.secondary">{formatChatDate(u?.last_message?.created_at)}</Typography>
                                    </Box>
                                    <Box sx={{ width: '100%', mt: 1, alignItems: 'center', justifyContent: 'start', display: 'flex', gap: '4px' }}>
                                        {(!u?.isTyping) ? <>{(u?.last_message?.sender_id == u.id) ? null : (u?.last_message?.is_read) ? <VisibilityIcon sx={{ fontSize: 14, mt: '2px', color: '#fff' }} /> : (u?.last_message?.is_delivered) ? <DoneAllIcon sx={{ fontSize: 14, mt: '2px', color: '#fff' }} /> : <DoneIcon sx={{ fontSize: 14, mt: '2px', color: '#fff' }} />}
                                            <Typography variant="body2" width={'calc(100% - 70px)'} noWrap textOverflow={'ellipsis'} textAlign={'start'} fontSize={12} color="text.primary" >
                                                {u?.last_message?.message}
                                            </Typography></> :
                                            <>
                                                <Typography variant="body2" width={'calc(100% - 70px)'} noWrap textOverflow={'ellipsis'} textAlign={'start'} fontSize={12} color="secondary.main" >
                                                    typing...
                                                </Typography>
                                            </>}
                                        <Badge badgeContent={parseInt(u?.unread_count)} color="secondary" sx={{ width: '5px', ml: 1, height: '5px', mt: '6px' }} max={99}></Badge>
                                        <Typography variant="body2" width={'55px'} fontSize={10} color="text.secondary">{formatTime(u?.last_message?.created_at)}</Typography>
                                    </Box>


                                </Box>
                            </Box>
                        </Button>

                    )

                    }
                    {
                        isLoading ? <Stack width={'100%'}>
                            {[1, 2, 3, 4, 5].map(i => <Box width={'100%'} key={i} minHeight={'60px'} display={'flex'} justifyContent={'start'} p={1} gap={2} >
                                <Skeleton variant="circular" height={'50px'} width={'50px'} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc( 100% - 75px)', alignItems: 'start' }}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Skeleton width={'40%'} sx={{ maxWidth: '200px' }} height={'25px'} />


                                    </Box>
                                    <Box sx={{ width: '100%', mt: 1, alignItems: 'center', justifyContent: 'start', display: 'flex', gap: '4px' }}>
                                        <Skeleton width={'60%'} sx={{ maxWidth: '330px' }} />
                                    </Box>
                                </Box>
                            </Box>)}

                        </Stack> :
                            (chatlist.length == 0) && <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                <Box width={'90%'} maxWidth={{ xs: '320px', sm: '450px' }} >
                                    <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768276563/uof3wqwlmc9tojb6yfk9.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                                </Box>
                                <Typography variant="body1" fontWeight={'bold'} fontSize={{ xs: '24px', sm: '32px' }} color="#fff">
                                    No conversations yet
                                </Typography>
                                <Typography variant="body2" fontSize={{ xs: '10px', sm: '15px' }} color="text.secondary">
                                    Start a conversation and your messages will appear here.
                                </Typography>
                            </Stack>
                    }

                </Stack>}
                {username && <ChattingComponent username={username} getChatlist={getChatlist} />}
            </Stack>
        </>
    )
}
export default Messages;