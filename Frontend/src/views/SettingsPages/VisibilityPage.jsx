import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack, Box, Skeleton, IconButton, Button, Divider, Avatar, Typography, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setState } from '../../store/authReducer/authReducer';
import { formatDate } from '../../utils/formatDateTime';





function VisibilityPage() {
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        getUserList();

    }, [])

    const getUserList = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/api/get-profile-visitor`,
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
    const handleFollowingBtn = async (e, userData) => {
        e.stopPropagation();
        try {
            const status = userData?.following_status;
            const following_id = userData?.id;

            setLoadingBtn(true);
            const operation = (status == 'accepted' || status == 'pending') ? 'cancel' : 'follow';
            console.log(following_id, operation, status)
            const result = await axios.post(
                `${backend_url}/api/req-follow`,
                {
                    operation,
                    following_id
                },
                { withCredentials: true }
            );

            const updatedList = usersList.map(l => {
                const filtered_list = l.users_list?.map(u => {
                    return (u.user_info.id == following_id) ? { ...u, user_info: { ...u.user_info, following_status: (result.data.followingStatus == 'not_followed') ? null : result?.data?.followingStatus } } : u
                });
                return { ...l, users_list: filtered_list }
            })


            setUsersList([...updatedList]);
            setLoadingBtn(false);

        } catch (err) {
            setLoadingBtn(false);
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
                                Account Visitors
                            </Typography>
                            <Typography variant="body2" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '12px', sm: '15px' }} color="text.secondary" >
                                See who's viewing your profile.
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
                            {l?.users_list?.map(u => <Box key={u.id} width={'100%'} p={'4px'} height={{ xs: '60px', sm: '70px' }} onClick={() => navigate(`/profile/${u?.user_info?.username}`)} sx={{ display: 'flex', gap: 1, alignItems: 'center', '&:hover': { bgcolor: '#10151f38' }, '&:active': { bgcolor: '#1f2c4938' }, borderRadius: 3 }} >
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
                                <Button loading={loadingBtn} onClick={(e) => handleFollowingBtn(e, u.user_info)} variant={`${(u?.user_info?.following_status == 'accepted' || u?.user_info?.following_status == 'pending') ? 'outlined' : 'contained'}`} size="small" sx={{ fontSize: { xs: '10px', sm: '14px' }, textTransform: 'none', width: { xs: '70px', sm: '90px' } }} color="secondary">{(!u?.user_info?.following_status) ? 'Follow' : (u?.user_info?.following_status == 'accepted') ? 'following' : 'requested'}</Button>
                            </Box>)}
                        </Stack>
                    )
                }
                {
                    !isLoading && usersList.length == 0 &&
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box width={'90%'} maxWidth={{ xs: '280px', sm: '380px' }}>
                            <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1770031468/gfgjcajxtknfkdz480jj.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                        </Box>
                        <Typography width={'100%'} textAlign={'center'} variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                            No blocked user
                        </Typography>
                        <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                            Your blocked users list is empty.
                        </Typography>

                    </Box>

                }
            </Stack>
        </>
    )
}

export default VisibilityPage;