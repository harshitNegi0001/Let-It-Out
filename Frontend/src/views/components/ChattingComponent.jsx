import { Avatar, Box, Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setState } from "../../store/authReducer/authReducer";

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




function ChattingComponent({ username, userData }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [messagesList, setMessagesList] = useState([]);
    const [sendMessageBox, setSendMessageBox] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);
    const { userInfo } = useSelector(state => state.auth);
    const openMenu = Boolean(anchorEl);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        if (username) {
            setSendMessageBox("");
            // getMessages();
            // get userData();
        }
    }, [username])

    const handleMenuChange = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleCloseMenu = () => {
        setAnchorEl(null);
    }
    const getUserData = async () => {
        try {
            const result = await axios.get(
                `${backend_url}/msg/get-user-data`
            )
        } catch (err) {
            // console.log(err);
            dispatch(setState({ error: err?.response?.data?.error || 'Internal Server Error!' }));
        }
    }
    const sendMessage = async () => {

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

            setMessagesList(prev => ([...prev, result?.data?.sentMessage]));
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
                    <Avatar sx={{ width: '45px', height: "45px",bgcolor:'#aeaabb' }}>
                        {userData?.image && <img src={userData.image} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '25px' }} alt="" />}
                    </Avatar>
                    <Box sx={{ width: 'calc(100% - 140px)', height: '50px' }} >
                        <Typography variant="body1" color="text.primary" component={'div'} noWrap textOverflow={'ellipsis'}>{userData?.name}</Typography>
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
                                <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>3:40 pm <VisibilityIcon sx={{ fontSize: '14px',transform:"translateY(4px)" }} /></Typography>
                            </Box>
                        </Box>
                        {messagesList.map(m => <Box key={m.id} width={'100%'} sx={{ display: 'flex', justifyContent: `${(m.receiver_id == userInfo.id) ? 'start' : 'end'}`, px: '8px' }}>
                            {(m.sender_id != userInfo.id) ? <Box maxWidth={'70%'} boxShadow={2} position={'relative'} minWidth={'70px'} borderRadius={'5px'} bgcolor={'#474747'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #2b2b2bff, #444346ff)" }}>
                                <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{m.message}</Typography>
                                <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>3:40 pm</Typography>
                            </Box> :
                                <Box maxWidth={'70%'} boxShadow={2} minWidth={'70px'} position={'relative'} borderRadius={'8px'} p={'4px 10px'} pb={2} sx={{ background: "linear-gradient(135deg, #6b2b6bff, #290938ff)" }}>

                                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>{m.message}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontSize={10} position={'absolute'} bottom={'3px'} right={'5px'} component={'span'}>3:40 pm {(m.is_read) ? <VisibilityIcon sx={{ fontSize: '14px',transform:"translateY(4px)" }} /> : (m.is_delivered) ? <DoneAllIcon sx={{ fontSize: '14px',transform:"translateY(4px)" }} /> : <DoneIcon sx={{ fontSize: '14px',transform:"translateY(4px)" }} />}</Typography>
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
                        <TextField fullWidth value={sendMessageBox} onChange={(e) => { setSendMessageBox(e.target.value) }} multiline minRows={1} maxRows={3} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder="write message..." color="secondary" size="small" />
                    </Box>
                    <IconButton loading={sendingMsg} size="small" disabled={!sendMessageBox?.trim()} onClick={() => sendMessage()}>
                        <SendIcon color={(sendMessageBox?.trim()) ? "secondary" : ""} fontSize="large" />
                    </IconButton>
                </Box>
            </Stack>
        </>
    )
}

export default ChattingComponent;
