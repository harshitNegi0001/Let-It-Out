import { Stack, Box, Typography, Divider, Button, Avatar, Skeleton } from "@mui/material";
import { useEffect, useRef } from "react";
import { useState } from "react";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { timeCount } from "../utils/formatDateTime";
import { setNotif } from "../store/notificationReducer/notifReducer";


function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const scrollRef = useRef(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const { userInfo } = useSelector(state => state.auth);
    const { notificationCount } = useSelector(state => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {
        getNotification();

    }, []);
    useEffect(() => {
        if (isLoading) {
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
    }, [isLoading]);

    const handleScroll = () => {
        if (!hasMore) {
            return;
        }
        if (isLoading) {
            return;
        }
        const el = scrollRef.current;
        if (!el) {
            return;
        }
        if (el.scrollTop + el.clientHeight + 1 >= el.scrollHeight) {
            getNotification();
        }

    }

    const getNotification = async () => {
        try {
            setIsLoading(true);
            const lastNotifTime = notifications.length == 0 ? null : notifications[notifications.length - 1]?.updated_at;
            const url = (lastNotifTime) ?
                `${backend_url}/api/get-notifications?lastNotifTime=${lastNotifTime}&&limit=${20}` :
                `${backend_url}/api/get-notifications?limit=${20}`;
            const result = await axios.get(
                url,
                {
                    withCredentials: true
                }
            );
            setIsLoading(false);
            if (result.data.notifications?.length < 20) {
                setHasMore(false);
            }
            setNotifications(prev => ([...prev, ...result.data.notifications]));

            const countRead = result.data?.notifications.reduce((a, b) => (b.is_read) ? a : a + 1, 0);

            dispatch(setNotif(notificationCount - countRead));
        } catch (err) {
            setIsLoading(false);
            // console.log(err);
        }
    }
    return (
        <>
            <Stack width={'100%'} p={{ xs: 1, sm: 2 }} height={'100%'} ref={scrollRef} spacing={2} overflow={'scroll'} pb={{ xs: '60px', sm: '10px' }}>

                <Box width={'100%'} borderBottom={1} borderColor={'divider'}>
                    <Typography variant="h6" width={'100%'} fontSize={{ xs: '18px', sm: '24px' }} textAlign={'center'} color="#fff">
                        Notifications
                    </Typography>
                </Box>
                <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column' }}>
                    {

                        notifications.map(n =>
                            n.type == 'like' || n.type == 'reply' ?
                                <Box width={'100%'} p={1} onClick={() => navigate(`/p/${n.post_data?.id ? n.post_data?.id : n.comment_data?.post_id}`, { state: { prevUrl: location.pathname + location.search } })}
                                    borderRadius={2} key={n.id}
                                    sx={{ display: 'flex', gap: { xs: '4px', sm: 1 }, alignItems: 'center', bgcolor: `${n.is_read ? 'primary.main' : '#20174959'}`, '&:hover': { bgcolor: '#2d283f59' }, '&:active': { bgcolor: '#14102259' } }}>
                                    <Box width={{ xs: '40px', sm: '50px' }}
                                        height={{ xs: '40px', sm: '50px' }}
                                        onClick={(e) => e.stopPropagation()}>
                                        <Avatar onClick={() => navigate(`/profile/${n.username}`)}
                                            src={n.image}
                                            sx={{ width: { xs: '40px', sm: '50px' }, height: { xs: '40px', sm: '50px' } }} />
                                    </Box>
                                    <Box width={{ xs: 'calc(100% - 100px)', sm: 'calc(100% - 130px)' }}
                                        sx={{ display: 'flex', flexDirection: 'column' }}>

                                        <Typography variant="body2"
                                            fontSize={{ xs: '12px', sm: '15px' }}
                                            textAlign={'start'} component={'div'}>
                                            <span style={{ fontWeight: 'bold' }}>
                                                {`${n.name} ${n.count > 1 ? `and ${n.count - 1} other ` : ''}`}
                                            </span>
                                            <span>
                                                {`${n.type == 'like' ? 'liked' : 'replied'} your ${n.target_type}.`}
                                            </span>
                                        </Typography>
                                        <Typography variant="body2"
                                            width={'100%'} noWrap
                                            textOverflow={'ellipsis'}
                                            fontSize={{ xs: '10px', sm: '12px' }}
                                            component={'span'} >
                                            {n.post_data?.content || n.comment_data?.content}
                                        </Typography>
                                        <Typography variant="body2"
                                            color="text.secondary"
                                            fontSize={{ xs: '8px', sm: '10px' }}
                                            component={'span'} >
                                            {timeCount(n.updated_at)}
                                        </Typography>
                                    </Box>

                                    <Box width={{ xs: '40px', sm: '50px' }}
                                        height={{ xs: '30px', sm: '40px' }}
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                        {
                                            n.post_data?.media_url ? <img src={n.post_data?.media_url[0]}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                                alt="" />

                                                : n.target_type == 'post' ?
                                                    <ImageOutlinedIcon sx={{ color: '#fff' }} /> :
                                                    <SmsOutlinedIcon sx={{ color: '#fff' }} />
                                        }
                                    </Box>



                                </Box>



                                :
                                n.type == 'follow' || n.type == 'follow_req' ?
                                    <Box width={'100%'} p={1} onClick={() => navigate(`/profile/${userInfo?.username}/followers`, { state: { prevUrl: location.pathname + location.search } })} borderRadius={2} key={n.id} sx={{ display: 'flex', gap: { xs: '4px', sm: 1 }, bgcolor: `${n.is_read ? 'primary.main' : '#20174959'}`, '&:hover': { bgcolor: '#2d283f59' } }}>

                                        <Box width={{ xs: '40px', sm: '50px' }} height={{ xs: '40px', sm: '50px' }} onClick={(e) => e.stopPropagation()}>
                                            <Avatar onClick={() => navigate(`/profile/${n.username}`)} src={n.image} sx={{ width: { xs: '40px', sm: '50px' }, height: { xs: '40px', sm: '50px' } }} />
                                        </Box>
                                        <Box width={{ xs: 'calc(100% - 60px)', sm: 'calc(100% - 70px)' }}
                                            sx={{ display: 'flex', flexDirection: 'column' }}>

                                            <Typography variant="body2" fontSize={{ xs: '12px', sm: '15px' }} textAlign={'start'} component={'div'}>
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {`${n.name} ${n.count > 1 ? `and ${n.count - 1} other ` : ''}`}
                                                </span>
                                                <span>
                                                    {n.type == 'follow' ? 'started following you.' : 'sent you follow request'}
                                                </span>
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" fontSize={{ xs: '8px', sm: '10px' }} component={'span'} >
                                                {timeCount(n.updated_at)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    :
                                    null
                        )


                    }
                    {
                        !hasMore && notifications.length > 0 &&
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary" component={'span'} fontSize={{ xs: '10px', sm: '13px' }}>
                                ( ︶︵︶ ) No more notifications ( ︶︵︶ )
                            </Typography>
                        </Box>
                    }
                    {
                        isLoading &&
                        [1, 2, 3, 4, 5].map(i =>
                            <Box width={'97%'} key={i} p={1} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Box width={{ xs: '40px', sm: '50px' }} height={{ xs: '40px', sm: '50px' }}>
                                    <Skeleton variant='circular' width={'100%'} animation="wave" height={'100%'} />
                                </Box>
                                <Box width={'calc(100% - 120px)'} maxWidth={'450px'} sx={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                    <Skeleton width={'100%'} animation="wave" height={'24px'} />
                                    <Skeleton width={'80%'} animation="wave" height={'15px'} />

                                </Box>

                            </Box>
                        )

                    }
                </Box>
            </Stack >
        </>
    )
}
export default Notifications;