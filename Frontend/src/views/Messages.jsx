import { Avatar, Box, Button,  Skeleton, Stack, Typography } from "@mui/material";

import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";
import ChattingComponent from "./components/ChattingComponent";




function Messages() {
    const { username } = useParams();
    const navigate = useNavigate();
    const {state} = useLocation();
    const userData= state?.userData;
    
    const [chatlist, setChatlist] = useState([]);
    
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const backend_url = import.meta.env.VITE_BACKEND_URL;

    
    useEffect(() => {
        getChatlist();
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
            <Stack width={'100%'} alignItems={"center"} height={{ sm: '100%', xs: 'calc(100% - 110px)' }} boxSizing={'border-box'}>
                {!username && <Stack sx={{ boxSizing: 'border-box', overflowY: 'scroll', scrollbarWidth: 'none' }} direction={'column'} width={'100%'} height={'100%'} mb={{ sm: '0', xs: '0px' }}>                    {
                        chatlist.map(u =>
                            <Button sx={{ p: 0, m: 0, borderRadius: '0' }} key={u.id} color="secondary" onClick={() => navigate(`/chats/${u.username}`,{state:{userData:u}})}>
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
                                            <Typography variant="body2" width={'calc(100% - 55px)'} noWrap textOverflow={'ellipsis'} textAlign={'start'} fontSize={12} color="text.primary" >

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
                {username && userData&& <ChattingComponent username={username} userData={userData}/>}
            </Stack>
        </>
    )
}
export default Messages;