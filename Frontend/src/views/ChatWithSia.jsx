import { Avatar, Box, Chip, CircularProgress, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setState } from "../store/authReducer/authReducer";
import ReactMarkdown from "react-markdown";
import { formatDate, formatTime } from "../utils/formatDateTime";
import ChatOptionsComponent from "./components/ChatOptionsComponent";
// import socket from "../../utils/socket";

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


function ChatWithSia() {
    const [isTyping, setIsTyping] = useState(false);

    const [loadingOldChat, setLoadingOldChat] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef();
    const [messagesList, setMessagesList] = useState([]);
    const [sendMessageBox, setSendMessageBox] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        getMessages();
    }, [])
    useEffect(() => {
        if (isLoading || loadingOldChat) {
            return;
        }

        const el = scrollRef.current;
        if (!el) {
            return;
        }


        el.addEventListener('scroll', handleScroll);

        return () => {
            el.removeEventListener('scroll', handleScroll);
        }

    }, [isLoading, loadingOldChat]);



    const handleScroll = async () => {
        if (!hasMore) {
            return
        }
        if (isLoading || loadingOldChat) {
            return;
        }
        const el = scrollRef.current;
        if (!el) {
            return;
        }

        if (el.clientHeight - el.scrollTop + 1 >= el.scrollHeight) {
            fetchOldMessages();
        }
    }
    const fetchOldMessages = async () => {
        try {

            setLoadingOldChat(true);
            const lastMessageId = messagesList.length > 0 ? messagesList[messagesList.length - 1]?.id : null;

            const result = await axios.get(
                `${backend_url}/msg/get-messages-with-sia?limit=${10}&&lastMessageId=${lastMessageId}`,

                {
                    withCredentials: true
                }
            )
            if (result?.data?.messagesList?.length < 10) {
                setHasMore(false);
            }

            setMessagesList(prev => ([...prev, ...result?.data?.messagesList]));
            setLoadingOldChat(false);
        } catch (err) {
            setLoadingOldChat(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }


    const getMessages = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/msg/get-messages-with-sia?limit=${20}`,
                { withCredentials: true }
            )
            if (result?.data?.messagesList?.length < 20) {
                setHasMore(false);
                console.log("no more messages");
            }
            setMessagesList(prev => ([...prev, ...result?.data?.messagesList]));

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }

    const sendMessage = async () => {

        document.activeElement.blur();
        try {
            if (!sendMessageBox.trim()) {
                return;
            }
            setIsTyping(true);
            setSendingMsg(true);
            const sentMsg = {
                id: `temp-id-${Date.now()}`,
                message: sendMessageBox.trim(),
                wrote_by: 'user',
                created_at: new Date().toISOString(),
            };
            setSendMessageBox('');
            setMessagesList(prev => (
                [sentMsg, ...prev]
            ));

            const result = await axios.post(
                `${backend_url}/msg/chat-with-sia`,
                {
                    message: sendMessageBox.trim(),

                },
                {
                    withCredentials: true
                }
            )
            setIsTyping(false);
            setSendingMsg(false);

            setMessagesList(prev => (
                [result?.data?.replyMessage, ...prev]
            ));



        } catch (err) {
            setIsTyping(false);
            setSendingMsg(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }
    return (
        <>
            <Stack height={{ sm: '100%', xs: 'calc(100% - 110px)' }} position={'relative'} width={'100%'}>
                {/* Chatting section */}

                <Box width={'100%'} bgcolor={'primary.dark'} sx={{ display: 'flex', alignItems: 'center' }} p={1} height={'65px'} gap={1}>

                    <IconButton size="small" onClick={() => navigate('/chats')}><ArrowBackIcon sx={{ color: 'text.primary' }} /></IconButton>
                    <Avatar src={'https://res.cloudinary.com/dns5lxuvy/image/upload/v1772433796/coetwlmzutvf0mzh9mor.png'} sx={{ width: '45px', height: "45px", bgcolor: '#aeaabb' }}>
                    </Avatar>
                    <Box sx={{ width: 'calc(100% - 140px)', height: '40px' }} >
                        {isLoading ? <Skeleton width={'120px'} /> : <Typography variant="body1" color="text.primary" component={'div'} noWrap textOverflow={'ellipsis'}>Sia</Typography>}

                    </Box>
                    {/* <ChatOptionsComponent  /> */}
                </Box>

                {isLoading ?
                    <Stack width={'100%'} height={'calc(100% - 70px)'} direction={'column-reverse'} sx={{ overflowY: 'scroll' }} spacing={2} pb={'55px'}>
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
                    <Stack width={'100%'} height={'calc(100% - 70px)'} direction={'column-reverse'} ref={scrollRef} sx={{ overflowY: 'scroll' }} spacing={2} pb={'55px'}>
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
                        {messagesList?.map((msg) => <Box key={msg.id} width={'100%'} sx={{ display: 'flex', justifyContent: `${(msg.wrote_by == 'sia') ? 'start' : 'end'}`, px: '8px' }}>
                            {(msg.wrote_by != 'user') ? <Box maxWidth={'70%'} boxShadow={2} position={'relative'} minWidth={'70px'} borderRadius={'5px'} bgcolor={'#474747'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #2b2b2bff, #444346ff)" }}>
                                <Typography variant="body2" color="text.primary" component={'span'} sx={{ whiteSpace: 'pre-wrap' }}><ReactMarkdown>{msg.message}</ReactMarkdown></Typography>

                            </Box> :
                                <Box maxWidth={'70%'} boxShadow={2} minWidth={'70px'} position={'relative'} borderRadius={'8px'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #6b2b6bff, #290938ff)" }}>

                                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>

                                </Box>}
                        </Box>)
                        }
                        {messagesList.length == 0 && <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
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
                        {
                            loadingOldChat &&
                            <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress color="secondary" size={'30px'} />
                            </Box>
                        }


                    </Stack>}

                <Box width={'100%'} position={'absolute'} display={'flex'} bottom={'5px'} gap={1} px={1} alignItems={'end'} >
                    <Box width={'calc(100% - 50px)'} sx={{ bgcolor: '#3f3f3fff' }} borderRadius={1}>
                        <TextField fullWidth value={sendMessageBox}
                            onChange={(e) => { setSendMessageBox(e.target.value) }}
                            multiline minRows={1}
                            maxRows={5}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const isMobile = window.matchMedia("(pointer: coarse)").matches;
                                    if (!isMobile && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }
                            }}
                            placeholder="write message..."
                            color="secondary"
                            size="small" />
                    </Box>
                    <IconButton size="small" disabled={!sendMessageBox?.trim() || sendingMsg} onClick={() => sendMessage()}>
                        <SendIcon color={(sendMessageBox?.trim()) ? "secondary" : ""} fontSize="large" />
                    </IconButton>
                </Box>
            </Stack>
        </>
    )
}

export default ChatWithSia;
