import { Avatar, Box, Chip, IconButton,  Skeleton, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setState } from "../../store/authReducer/authReducer";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import ChatOptionsComponent from "./ChatOptionsComponent";
import socket from "../../utils/socket";

function TypingDots() {
    return (
        <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
        </Box>
    );
}
function Dot({ delay }) {
    return (
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'text.primary',
                animation: 'typing 1.4s infinite',
                animationDelay: delay,
                '@keyframes typing': {
                    '0%': { opacity: 0.3, transform: 'translateY(0px)' },
                    '50%': { opacity: 1, transform: 'translateY(4px)' },
                    '100%': { opacity: 0.3, transform: 'translateY(0px)' },
                },
            }}
        />
    );
}


function ChattingComponent({ username, getChatlist }) {
    const [isTyping, setIsTyping] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [lastOnline, setLastOnline] = useState(null);
    const [messagesList, setMessagesList] = useState([]);
    const [sendMessageBox, setSendMessageBox] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const { userInfo } = useSelector(state => state.auth);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

    }, [])
    useEffect(() => {
        if (username) {
            getUserData();
        }

    }, [username]);
    useEffect(() => {
        if (!userData?.id) return;
        setSendMessageBox("");
        setIsOnline(userData?.online_status);
        getMessages();
        setLastOnline(userData?.last_login);

        const handleTyping = ({ userId }) => {
            if (userId === userData.id) setIsTyping(true);
        };

        const handleStopTyping = ({ userId }) => {
            if (userId === userData.id) setIsTyping(false);
        };

        const handleReceiveMsg = ({ wrappedMessage }) => {
            setMessagesList(prev => {
                const lastGroup = prev[0];

                if (lastGroup && lastGroup.message_date === wrappedMessage.message_date) {
                    return [
                        {
                            ...lastGroup,
                            messages: [...lastGroup.messages, ...wrappedMessage.messages]
                        },
                        ...prev.slice(1)
                    ];
                }

                return [
                    {
                        message_date: wrappedMessage.message_date,
                        messages: [...wrappedMessage.messages]
                    },
                    ...prev
                ];
            });

            socket.emit('msg_seen', {
                receiverId: userData.id,
                userId: userInfo.id,
                msgIds: wrappedMessage.messages.map(m => m.id)
            });
            return () => {
                socket.off('msg_seen');
            }
        };

        const handleOnline = ({ online_userId }) => {
            if (online_userId === userData.id) setIsOnline(true);
        };

        const handleOffline = ({ online_userId }) => {
            if (online_userId === userData.id) {
                setIsOnline(false);
                setLastOnline(new Date());
            }
        };
        const handleDoubletTick = ({ userId, msgIds }) => {
            if (userId == userData.id) {
                setMessagesList(prev => {
                    return prev.map(grp => {

                        return {
                            ...grp, messages: grp.messages.map(m => {
                                return { ...m, is_delivered: true }
                            })
                        };
                    })
                })
            }
        }
        const handleSeen = ({ userId, msgIds }) => {
            if (userId == userData.id) {
                setMessagesList(prev => {
                    return prev.map(grp => {

                        return {
                            ...grp, messages: grp.messages.map(m => {
                                return { ...m, is_read: true }
                            })
                        };
                    })
                })
            }
        }

        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);
        socket.on('receive_msg', handleReceiveMsg);
        socket.on('add-online', handleOnline);
        socket.on('remove-online', handleOffline);
        socket.on('user_get_msg', handleDoubletTick);
        socket.on('user_read_msg', handleSeen);


        return () => {
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
            socket.off('receive_msg', handleReceiveMsg);
            socket.off('add-online', handleOnline);
            socket.off('remove-online', handleOffline);
            socket.off('user_get_msg', handleDoubletTick);
            socket.off('user_read_msg', handleSeen);

        };
    }, [userData?.id]);


    const emitTyping = () => {

        socket.emit('typing', { userId: userInfo?.id, receiverId: userData?.id });
    }
    const emitStopTyping = () => {
        socket.emit('stop_typing', { userId: userInfo?.id, receiverId: userData?.id });
    }
    const getUserData = async () => {
        try {
            const result = await axios.get(
                `${backend_url}/msg/get-user-basic-data?username=${username}`,
                { withCredentials: true }
            );

            setUserData(result?.data?.userDetail);

        } catch (err) {
            // console.log(err);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }
    const getMessages = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/msg/get-messages`,
                {
                    userId: userData.id

                },
                {
                    withCredentials: true
                }
            )

            setMessagesList(result?.data?.messagesList);

            getChatlist();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }

    const sendMessage = async () => {

        document.activeElement.blur();
        try {
            if (!sendMessageBox.trim() || !userData?.id) {
                return;
            }
            setSendingMsg(true);
            const result = await axios.post(
                `${backend_url}/msg/send-message`,
                {
                    receiverId: userData.id,
                    message: sendMessageBox.trim(),
                    replyTo: null,

                },
                {
                    withCredentials: true
                }
            )
            setSendingMsg(false);
            setSendMessageBox('');
            getChatlist();

            setMessagesList(prev => {
                const lastGroup = prev[0];

                if (lastGroup && lastGroup.message_date === result.data.wrappedMessage.message_date) {
                    return [
                        {
                            ...lastGroup,
                            messages: [...lastGroup.messages, ...result.data.wrappedMessage.messages]
                        },
                        ...prev.slice(1)
                    ];
                }

                return [
                    {
                        message_date: result.data.wrappedMessage.message_date,
                        messages: [...result.data.wrappedMessage.messages]
                    },
                    ...prev
                ];
            });



        } catch (err) {
            setSendingMsg(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }
    return (
        <>
            <Stack height={'100%'} position={'relative'} width={'100%'}>
                {/* Chatting section */}

                <Box width={'100%'} bgcolor={'primary.dark'} sx={{ display: 'flex', alignItems: 'center' }} p={1} height={'65px'} gap={1}>

                    <IconButton size="small" onClick={() => navigate('/chats')}><ArrowBackIcon sx={{ color: 'text.primary' }} /></IconButton>
                    <Avatar sx={{ width: '45px', height: "45px", bgcolor: '#aeaabb' }}>
                        {userData?.image && <img src={userData.image} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '25px' }} alt="" />}
                    </Avatar>
                    <Box sx={{ width: 'calc(100% - 140px)', height: '50px' }} >
                        {isLoading ? <Skeleton width={'120px'} /> : <Typography variant="body1" color="text.primary" component={'div'} noWrap textOverflow={'ellipsis'}>{userData?.name}</Typography>}
                        {isLoading ? <Skeleton width={'45px'} /> : <Typography variant="body2" color={`${isTyping ? 'secondary.main' : isOnline ? "#2fa500" : '#fff'}`} fontSize={12} component={'div'} noWrap textOverflow={'ellipsis'}>{isTyping ? 'typing...' : (isOnline) ? "Online" : (lastOnline) ? `last seen ${formatDate(lastOnline)} ${formatTime(lastOnline)}` : `last seen ${formatDate(userData?.last_login)} ${formatTime(userData?.last_login)}`} </Typography>}
                    </Box>
                    <ChatOptionsComponent userData={userData} getUserData={getUserData} />
                </Box>

                {isLoading ? <Stack width={'100%'} height={'calc(100% - 70px)'} direction={'column-reverse'} sx={{ overflowY: 'scroll' }} spacing={2} pb={'55px'}>
                    <Stack width={'100%'} spacing={2}>
                        <Box width={'100%'} pt={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Skeleton variant="rounded" animation="pulse" width={'100px'} height={'25px'} />
                        </Box>
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'start', px: '8px' }}>
                            <Skeleton variant="rounded" animation="wave" width={'40%'} height={'55px'} sx={{ background: "linear-gradient(135deg, #2b2b2bff, #444346ff)", borderRadius: 3 }} />
                        </Box>
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'end', px: '8px' }}>
                            <Skeleton variant="rounded" animation="wave" width={'30%'} height={'55px'} sx={{ background: "linear-gradient(135deg, #6b2b6bff, #290938ff)", borderRadius: 3 }} />
                        </Box>

                    </Stack>
                </Stack> :
                    <Stack width={'100%'} height={'calc(100% - 70px)'} direction={'column-reverse'} sx={{ overflowY: 'scroll' }} spacing={2} pb={'55px'}>
                        {isTyping && (
                            <Box width="100%" sx={{ display: 'flex', justifyContent: 'start', px: '8px' }}>
                                <Box
                                    maxWidth="100px"
                                    height={'35px'}
                                    borderRadius="10px"
                                    p="8px 12px"
                                    sx={{
                                        background: "linear-gradient(135deg, #2b2b2bff, #444346ff)",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <TypingDots />
                                </Box>
                            </Box>
                        )}
                        {!isLoading && messagesList?.map((m, i) => <Stack key={i} width={'100%'} spacing={2}>
                            <Box width={'100%'} pt={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Chip label={formatDate(m.message_date)} size="small" />
                            </Box>

                            {m?.messages?.map(msg => <Box key={msg.id} width={'100%'} sx={{ display: 'flex', justifyContent: `${(msg.receiver_id == userInfo.id) ? 'start' : 'end'}`, px: '8px' }}>
                                {(msg.sender_id != userInfo.id) ? <Box maxWidth={'70%'} boxShadow={2} position={'relative'} minWidth={'70px'} borderRadius={'5px'} bgcolor={'#474747'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #2b2b2bff, #444346ff)" }}>
                                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>{formatTime(msg.created_at)}</Typography>
                                </Box> :
                                    <Box maxWidth={'70%'} boxShadow={2} minWidth={'70px'} position={'relative'} borderRadius={'8px'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #6b2b6bff, #290938ff)" }}>

                                        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                                        <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>{formatTime(msg.created_at)} {(msg.is_read) ? <VisibilityIcon sx={{ fontSize: '14px', transform: "translateY(4px)" }} /> : (msg.is_delivered) ? <DoneAllIcon sx={{ fontSize: '14px', transform: "translateY(4px)" }} /> : <DoneIcon sx={{ fontSize: '14px', transform: "translateY(4px)" }} />}</Typography>
                                    </Box>}
                            </Box>)}

                        </Stack>)
                        }
                        {!isLoading && messagesList.length == 0 && <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Box width={'90%'} maxWidth={{ xs: '320px', sm: '450px' }} >
                                <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768276563/uof3wqwlmc9tojb6yfk9.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                            </Box>
                            <Typography variant="body1" fontWeight={'bold'} fontSize={{ xs: '24px', sm: '32px' }} color="#fff">
                                No Messages Yet
                            </Typography>
                            <Typography variant="body2" fontSize={{ xs: '10px', sm: '15px' }} color="text.secondary">
                                Send a message to start a conversation.
                            </Typography>
                        </Stack>}


                    </Stack>}
                {!userData?.is_blocked && !userData?.blocked_me && <Box width={'100%'} position={'absolute'} display={'flex'} bottom={'5px'} gap={1} px={1} alignItems={'end'} >
                    <Box width={'calc(100% - 50px)'} sx={{ bgcolor: '#3f3f3fff' }} borderRadius={1}>
                        <TextField onFocus={() => emitTyping()} onBlur={() => emitStopTyping()} fullWidth value={sendMessageBox} onChange={(e) => { setSendMessageBox(e.target.value) }} multiline minRows={1} maxRows={3} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder="write message..." color="secondary" size="small" />
                    </Box>
                    <IconButton loading={sendingMsg} size="small" disabled={!sendMessageBox?.trim()} onClick={() => sendMessage()}>
                        <SendIcon color={(sendMessageBox?.trim()) ? "secondary" : ""} fontSize="large" />
                    </IconButton>
                </Box>}
            </Stack>
        </>
    )
}

export default ChattingComponent;
