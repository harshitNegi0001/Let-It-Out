import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack, Box, Skeleton, IconButton, Button, Divider, Avatar, Typography, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { setState } from '../../store/authReducer/authReducer';
import { formatDate } from '../../utils/formatDateTime';


const backend_url = import.meta.env.VITE_BACKEND_URL;
const visibily_type = {
    'blocked': {
        title: 'Blocked Accounts',
        subtitle: "Manage the accounts you've blocked.",
        api: `${backend_url}/api/get-my-blocked-acc`
    },
    'account-visitors': {
        title: 'Account Visitors',
        subtitle: "See who's viewing your profile.",
        api: `${backend_url}/api/get-profile-visitor`
    }
}

function VisibilityPage() {
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { req_type } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        if (req_type) {
            getUserList();
        }
    }, [req_type])

    const getUserList = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${visibily_type[req_type]?.api}`,
                { withCredentials: true }
            );

            setIsLoading(false);
            setUsersList(result?.data?.usersList);
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
                        <IconButton onClick={() => navigate(`/settings/connections/`)} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Box width={'calc(100% - 70px)'} sx={{ display: 'flex', flexDirection: 'column' }}>

                            <Typography variant="body1" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '16px', sm: '22px' }} fontWeight={'500'} color="#fff" >
                                {visibily_type[req_type]?.title}
                            </Typography>
                            <Typography variant="body2" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '12px', sm: '15px' }} color="text.secondary" >
                                {visibily_type[req_type]?.subtitle}
                            </Typography>
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
                    usersList.map((l, i) =>
                        <Stack key={i} width={'100%'} spacing={1} p={1}>
                            <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Chip label={`${formatDate(l.visited_date)}`} />
                            </Box>
                            {l?.users_list?.map(u => <Box key={u.id} width={'100%'} p={'4px'} height={{ xs: '60px', sm: '70px' }} onClick={() => navigate(`/profile/${u?.user_info?.username}`)} sx={{ display: 'flex', gap: 1, alignItems: 'center', '&:hover': { bgcolor: '#10151f38' }, '&:active': { bgcolor: '#1f2c4938', transition: 'all 100ms', transform: 'scale(0.99)' }, borderRadius: 3 }} >
                                <Box height={'100%'} sx={{ aspectRatio: 1 }} >
                                    <Avatar sx={{ width: '100%', height: '100%' }}>
                                        {u?.user_info?.image && <img src={u?.user_info?.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />}
                                    </Avatar>

                                </Box>
                                <Box width={{ xs: 'calc(100% - 140px)', sm: 'calc(100% - 160px)' }} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body1" width={'100%'} textAlign={'start'} noWrap color="#fff" textOverflow={'ellipsis'} fontSize={{ xs: '14px', sm: '18px' }} >
                                        {u?.user_info?.name}
                                    </Typography>
                                    <Typography variant="body1" width={'100%'} textAlign={'start'} color="text.secondary" noWrap textOverflow={'ellipsis'} fontSize={{ xs: '10px', sm: '14px' }} >
                                        @{u?.user_info?.username}
                                    </Typography>
                                    {u?.user_info?.bio && <Typography variant="body1" width={'100%'} textAlign={'start'} color="text.secondary" noWrap textOverflow={'ellipsis'} fontSize={{ xs: '10px', sm: '14px' }} >
                                        {u?.user_info?.bio}
                                    </Typography>}
                                </Box>
                                {req_type=='account-visitors'&&<Button variant={`${(u?.user_info?.following_status == 'accepted' || u?.user_info?.following_status == 'pending') ? 'outlined' : 'contained'}`} size="small" sx={{ fontSize: { xs: '10px', sm: '14px' }, textTransform: 'none', width: { xs: '70px', sm: '90px' } }} color="secondary">{(!u?.user_info?.following_status) ? 'Follow' : (u?.user_info?.following_status == 'accepted') ? 'following' : 'requested'}</Button>}
                            </Box>)}
                        </Stack>
                    )
                }
            </Stack>
        </>
    )
}

export default VisibilityPage;