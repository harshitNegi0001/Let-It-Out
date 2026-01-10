import { Avatar, Badge, Box, Button, Chip, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, Stack, TextField, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';
import { useDispatch, useSelector } from "react-redux";
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';

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


function Messages() {
    const { userId } = useParams();
    const { userInfo } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [isTyping, setIsTyping] = useState(false); // example ke liye true
    const [chatlist, setChatlist] = useState([]);
    const [sendMessageBox, setSendMessageBox] = useState("");
    const [messagesList, setMessagesList] = useState([]);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [sendingMsg, setSendingMsg] = useState(false);

    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (userId) {
            setSendMessageBox("");
            // getMessages();
        }
    }, [userId])
    useEffect(() => {
        getChatlist();
    }, [])

    const sendMessage = async () => {

        try {
            if(!sendMessageBox.trim()){
                return;
            }
            setSendingMsg(true);
            const result = await axios.post(
                `${backend_url}/msg/send-message`,
                {
                    receiverId: userId,
                    message: sendMessageBox.trim(),
                    replyTo: null,

                },
                {
                    withCredentials: true
                }
            )
            setSendingMsg(false);
            setSendMessageBox('');

            setMessagesList(prev => ([...prev, result?.data?.sentMessage]));
        } catch (err) {
            setSendingMsg(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }
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
    const handleMenuChange = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    return (
        <>
            <Stack width={'100%'} alignItems={"center"} height={{ sm: '100%', xs: 'calc(100% - 110px)' }} boxSizing={'border-box'}>
                {!userId && <Stack sx={{ boxSizing: 'border-box', overflowY: 'scroll', scrollbarWidth: 'none' }} direction={'column'} width={'100%'} height={'100%'} mb={{ sm: '0', xs: '0px' }}>
                    {/* Users list's section */}
                    {
                        chatlist.map(u =>
                            <Button sx={{ p: 0, m: 0, borderRadius: '0' }} key={u.id} color="secondary" onClick={() => navigate(`/chats/${u.id}`)}>
                                <Box width={'100%'} minHeight={'60px'} display={'flex'} justifyContent={'start'} p={1} gap={2} >
                                    <Avatar sx={{ width: '50px', height: "50px" }}>
                                        {u.image && <img src={u.image} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '25px' }} alt="" />}
                                    </Avatar>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc( 100% - 75px)', alignItems: 'start' }}>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" color="text.primary" component={'span'}>{u.fake_name || u.name}</Typography>
                                            <Typography variant="body2" fontSize={10} component={'span'} color="text.secondary">12/12/2025</Typography>
                                        </Box>
                                        <Box sx={{ width: '100%', mt: 1, alignItems: 'center', justifyContent: 'start', display: 'flex', gap: '4px' }}>
                                            <DoneAllIcon sx={{ fontSize: 14, mt: '2px', color: 'info.light' }} />
                                            <Typography variant="body2" width={'calc(100% - 55px)'} noWrap textOverflow={'ellipsis'} textAlign={'start'} fontSize={12} color="text.prymary" >

                                                {u.name}
                                            </Typography>
                                            {/* <Chip variant='filled' color="secondary" label='244' size="small"/> */}
                                            {/* <Badge  badgeContent={100} color="secondary" sx={{width:'5px',ml:1,height:'5px',mt:'6px'}} max={99}></Badge> */}
                                        </Box>


                                    </Box>
                                </Box>
                            </Button>

                        )
                    }
                    {
                        isLoading && <Stack width={'100%'}>
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

                        </Stack>
                    }
                </Stack>}
                {userId && <Stack height={'100%'} position={'relative'} width={'100%'}>
                    {/* Chatting section */}
                    <Divider />
                    <Box width={'100%'} bgcolor={'primary.dark'} sx={{ display: 'flex', alignItems: 'center' }} p={1} height={'65px'} gap={1}>

                        <IconButton size="small" onClick={() => navigate('/chats')}><ArrowBackIcon sx={{ color: 'text.primary' }} /></IconButton>
                        <img src="https://lh3.googleusercontent.com/a/ACg8ocIeBt81ImfZlaz9bECptfoge0TD9IB-eEEqAvzrBccWZchQfZ2d=s96-c" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '25px' }} alt="" />
                        <Box sx={{ width: 'calc(100% - 140px)', height: '50px' }} >
                            <Typography variant="body1" color="text.primary" component={'div'} noWrap textOverflow={'ellipsis'}>Harshit Singh Negi </Typography>
                            <Typography variant="body2" color="text.secondary" fontSize={12} component={'div'} noWrap textOverflow={'ellipsis'}>online </Typography>
                        </Box>
                        <IconButton size="small" onClick={handleMenuChange} id="user-chatting-options-btn" aria-haspopup='true' aria-expanded={openMenu ? 'true' : undefined} aria-controls={openMenu ? 'user-chatting-option-menu' : undefined}> <MoreHorizIcon sx={{ color: 'text.primary' }} /> </IconButton>
                    </Box>
                    <Menu id="user-chatting-option-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu} slotProps={{ list: { 'aria-labelledby': 'user-chatting-options-btn' } }}>
                        <MenuItem onClick={handleCloseMenu}>
                            <ListItemIcon>
                                <BlockIcon />
                            </ListItemIcon>
                            <ListItemText>Block</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <ListItemIcon>
                                <ReportIcon />
                            </ListItemIcon>
                            <ListItemText>Report</ListItemText>
                        </MenuItem>

                    </Menu>
                    <Stack width={'100%'} height={'calc(100% - 70px)'} sx={{ overflowY: 'scroll' }} spacing={2} pb={'55px'}>
                        <Stack width={'100%'} spacing={2}>
                            <Box width={'100%'} pt={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Chip label="December 10, 2025" size="small" />
                            </Box>
                            <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'start', px: '8px' }}>
                                <Box maxWidth={'70%'} boxShadow={2} position={'relative'} minWidth={'70px'} borderRadius={'5px'} bgcolor={'#474747'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #2b2b2bff, #444346ff)" }}>
                                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{'hlo \nhow are you'}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>3:40 pm</Typography>
                                </Box>
                            </Box>
                            <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'end', px: '8px' }}>

                                <Box maxWidth={'70%'} boxShadow={2} minWidth={'70px'} position={'relative'} borderRadius={'8px'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #6b2b6bff, #290938ff)" }}>

                                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>Hii</Typography>
                                    <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>3:40 pm <DoneAllIcon sx={{ fontSize: '14px' }} /></Typography>
                                </Box>
                            </Box>
                            {messagesList.map(m => <Box key={m.id} width={'100%'} sx={{ display: 'flex', justifyContent: `${(m.receiver_id == userInfo.id) ? 'start' : 'end'}`, px: '8px' }}>
                                {(m.sender_id != userInfo.id) ? <Box maxWidth={'70%'} boxShadow={2} position={'relative'} minWidth={'70px'} borderRadius={'5px'} bgcolor={'#474747'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #2b2b2bff, #444346ff)" }}>
                                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{m.message}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>3:40 pm</Typography>
                                </Box> :
                                    <Box maxWidth={'70%'} boxShadow={2} minWidth={'70px'} position={'relative'} borderRadius={'8px'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #6b2b6bff, #290938ff)" }}>

                                        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{m.message}</Typography>
                                        <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>3:40 pm {(m.is_read)?<VisibilityIcon sx={{ fontSize: '14px' }} />:(m.is_delivered)?<DoneAllIcon sx={{ fontSize: '14px' }} />:<DoneIcon sx={{ fontSize: '14px' }} />}</Typography>
                                    </Box>}
                            </Box>)}
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
                        </Stack>

                    </Stack>
                    <Box width={'100%'} position={'absolute'} display={'flex'} bottom={'5px'} gap={1} px={1} alignItems={'end'} >
                        <Box width={'calc(100% - 50px)'} sx={{ bgcolor: '#3f3f3fff' }} borderRadius={1}>
                            <TextField fullWidth value={sendMessageBox} onChange={(e) => setSendMessageBox(e.target.value)} multiline minRows={1} maxRows={3} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { sendMessage() } }} placeholder="write message..." color="secondary" size="small" />
                        </Box>
                        <IconButton loading={sendingMsg} size="small" disabled={!sendMessageBox?.trim()} onClick={() => sendMessage()}>
                            <SendIcon color={(sendMessageBox?.trim()) ? "secondary" : ""} fontSize="large" />
                        </IconButton>
                    </Box>
                </Stack>}
            </Stack>
        </>
    )
}
export default Messages;