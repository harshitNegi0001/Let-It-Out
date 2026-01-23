import { Box, Button, Divider, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setState } from "../store/authReducer/authReducer";


function ConnectionPage() {

    const [usersList, setUsersList] = useState([]);
    const [reqestList, setRequestList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { list_type, username } = useParams();
    const [basicDetail, setBasicDetail] = useState({
        name: '',
        username: ''
    });
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (list_type) {
            if ((list_type != 'followers' && list_type != 'followings') || !username) {
                navigate('/page-not-found');
            }

            getUsersList();
        }

    }, [username, list_type]);


    const getUsersList = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/api/get-connection-list?list_type=${list_type}&&username=${username}`,
                {
                    withCredentials: true
                }
            );

            if(result?.data?.restriction){
                return;
            }
            if(result?.data?.basicDetail){
                setBasicDetail(result.data.basicDetail);
            }
            if(result?.data?.requests_list){
                setRequestList(result.data.requests_list);
            }

            setUsersList(result?.data?.user_list);
            setIsLoading(false);
            
        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something Went Wrong!' }));
        }
    }


    return (
        <>

            <Stack width={'100%'} height={'100%'} overflow={'scroll'} p={{ xs: 1, sm: 2 }} pb={{ xs: '60px', sm: '10px' }} spacing={2} >
                <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start' }}>
                    <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton onClick={() => navigate(`/profile/${username}`)} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Box width={'calc(100% - 70px)'} sx={{ display: 'flex', flexDirection: 'column' }}>
                            {isLoading ?
                                <>
                                    <Skeleton sx={{ width: { xs: '120px', sm: '190px' }, height: { xs: '26px', sm: '36px' } }} />
                                    <Skeleton sx={{ width: { xs: '150px', sm: '250px' }, height: { xs: '16px', sm: '26px' } }} />
                                </>
                                : <><Typography variant="body1" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '16px', sm: '22px' }} fontWeight={'bold'} color="#fff" >
                                    {basicDetail?.name}
                                </Typography>
                                    <Typography variant="body2" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '12px', sm: '15px' }} color="text.secondary" >
                                        @{username}
                                    </Typography></>}
                        </Box>

                    </Box>
                    <Divider sx={{ width: '100%' }} />

                    {isLoading && [1, 2, 3, 4, 5].map((i) => <Box width={'97%'} key={i} p={1} sx={{ display: 'flex', gap: 1 }}>
                        <Box width={'50px'} height={'50px'}>
                            <Skeleton variant='circular' width={'100%'} animation="wave" height={'100%'} />
                        </Box>
                        <Box width={'calc(100% - 120px)'} maxWidth={'450px'} sx={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                            <Skeleton width={'100%'} animation="wave" height={'24px'} />
                            <Skeleton width={'80%'} animation="wave" height={'15px'} />

                        </Box>

                    </Box>)}


                </Box>

                {
                    reqestList.length > 0 && <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} pt={2} >
                        <Typography variant="body1" >
                            Following Requests
                        </Typography>
                        {
                            reqestList.map(i =>
                                <Box width={'100%'} key={i} p={1} sx={{ display: 'flex', gap: 1, bgcolor: '#05236438', borderRadius: 3 }} >
                                    <Box height={{ xs: '55px', sm: '65px' }} sx={{ aspectRatio: 1 }}  >
                                        <img src={basicDetail?.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                                    </Box>
                                    <Box width={'calc(100% - 80px)'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body1" width={'100%'} textAlign={'start'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '14px', sm: '18px' }} >
                                                {basicDetail?.name}
                                            </Typography>
                                            <Typography variant="body1" width={'100%'} textAlign={'start'} color="text.secondary" noWrap textOverflow={'ellipsis'} fontSize={{ xs: '10px', sm: '14px' }} >
                                                @{basicDetail?.username}
                                            </Typography>
                                        </Box>
                                        <Box width={'100%'} maxWidth={{ xs: '240px', sm: '370px' }} sx={{ display: 'flex', justifyContent: 'start', gap: 2 }}>
                                            <Button variant="contained" sx={{ textTransform: 'none', height: '25px' }} color="secondary" size="small">
                                                Accept
                                            </Button>
                                            <Button variant="contained" sx={{ textTransform: 'none', height: '25px' }} color="error" size="small">
                                                Reject
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        }
                    </Box>
                }
                {
                    usersList.length > 0 && <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} pt={2} >
                        <Typography variant="body1" >
                            All {`${list_type}`}
                        </Typography>
                        {
                            usersList.map(i =>
                                <Box width={'100%'} p={'4px'} height={{ xs: '60px', sm: '70px' }} onClick={() => navigate(`/profile/${username}`)} sx={{ display: 'flex', gap: 1, alignItems: 'center', '&:hover': { bgcolor: '#10151f38' }, '&:active': { bgcolor: '#1f2c4938', transition: 'all 100ms', transform: 'scale(0.99)' }, borderRadius: 3 }} >
                                    <Box height={'100%'} sx={{ aspectRatio: 1 }} >
                                        <img src={basicDetail?.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                                    </Box>
                                    <Box width={{ xs: 'calc(100% - 140px)', sm: 'calc(100% - 160px)' }} sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body1" width={'100%'} textAlign={'start'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '14px', sm: '18px' }} >
                                            Harshit
                                        </Typography>
                                        <Typography variant="body1" width={'100%'} textAlign={'start'} color="text.secondary" noWrap textOverflow={'ellipsis'} fontSize={{ xs: '10px', sm: '14px' }} >
                                            @Harshit
                                        </Typography>
                                    </Box>
                                    <Button variant="outlined" size="small" sx={{ fontSize: { xs: '10px', sm: '14px' }, textTransform: 'none', width: { xs: '70px', sm: '90px' } }} color="secondary">Requested</Button>
                                </Box>
                            )
                        }

                    </Box>
                }

            </Stack>
        </>
    )
}

export default ConnectionPage;