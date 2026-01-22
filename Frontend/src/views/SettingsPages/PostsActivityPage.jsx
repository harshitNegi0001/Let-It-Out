import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setState } from "../../store/authReducer/authReducer";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadingPost from "../components/LoadingPosts";
import PostUI from "../components/PostUI";
import axios from "axios";

const page_type = {
    'liked-posts': {
        title: 'Liked posts',
        subTitle: 'Posts you’ve liked',
        empty: {
            title: 'You haven’t liked any post',
            subTitle: 'When you like a post, it’ll show up here.'
        }
    },
    'interacted-posts': {
        title: 'Interacted posts',
        subTitle: 'Posts you’ve commented on or reacted to',
        empty: {
            title: 'You haven’t commented on any post',
            subTitle: 'When you comment on a post, it’ll show up here.'
        }
    },
    'saved-posts': {
        title: 'Saved posts',
        subTitle: 'Posts you’ve saved for later',
        empty: {
            title: 'You haven’t saved any post',
            subTitle: 'When you save a post, it’ll show up here.'
        }
    },
    'shared-posts': {
        title: 'Shared posts',
        subTitle: 'Posts you’ve shared or reposted ',
        empty: {
            title: 'You haven’t reposted any post',
            subTitle: 'When you repost a post, it’ll show up here.'
        }
    },
    'reported-posts': {
        title: 'Reported posts',
        subTitle: 'Posts you’ve reported',
        empty: {
            title: 'You haven’t reported any post',
            subTitle: 'When you repost a post, it’ll show up here.'
        }
    },
    'not-interested-posts': {
        title: 'Not interested posts',
        subTitle: 'Posts you’ve hidden or marked as not interested',
        empty: {
            title: 'You haven’t marked any post as not interested',
            subTitle: 'When you mark a post as not interested, it’ll show up here.'
        }
    }
}

function PostsActivityPage() {

    const [isLoading, setIsLoading] = useState(true);
    const [postsList, setPostsList] = useState([]);
    const { required_type } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (required_type) {
            getPosts(required_type);
        }
    }, [required_type])

    const getPosts = async (req_type) => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/api/get-activity-posts?currPage=${1}&&limit=${10}&&req_type=${req_type}`,
                { withCredentials: true }
            );

            setPostsList(prev => ([...prev, ...result?.data?.postsList]));
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
        }
    }
    return (
        <>
            <Stack width={'100%'} height={'100%'} overflow={'scroll'} p={{ xs: 1, sm: 2 }} pb={{ xs: '60px', sm: '10px' }} spacing={2} >
                <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start' }}>
                    <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton onClick={() => navigate('/settings/my-activity')} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" component={'div'} color="text.main" fontWeight={'600'}>
                            {required_type && page_type[required_type].title}
                        </Typography>
                    </Box>
                    <Typography variant="body2" component={'div'} fontSize={{ xs: '11px', sm: '14px' }} color="text.secondary" >
                        {required_type && page_type[required_type].subTitle}
                    </Typography>
                    {/* <Typography variant="body2" component={'div'} fontSize={{ xs: '11px', sm: '14px' }} color="text.secondary" >
                            We’re sorry to see you go. We’d like to know why you’re deleting your account as we may be able to help with common issues.
                        </Typography> */}

                </Box>
                <Stack width={'100%'} spacing={1} p={1}>
                    {isLoading ?
                        <>
                            <LoadingPost />
                            <LoadingPost />
                        </>

                        :

                        <>
                            {postsList.map((p) => <PostUI key={p.post_data.id} postData={p.post_data} userData={p.user_data} />)}
                            {postsList.length == 0 &&
                                <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>

                                    <Box width={'100%'} maxWidth={{ xs: '280px', sm: '450px' }}>
                                        <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1769063952/btlbvqsjcmms3bcfkdlg.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                                    </Box>
                                    <Typography width={'100%'} textAlign={'center'} variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                                        {required_type && page_type[required_type].empty.title}
                                    </Typography>
                                    <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                        {required_type && page_type[required_type].empty.subTitle}
                                    </Typography>
                                    <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                    </Typography>
                                </Box>
                            }
                        </>}
                </Stack>
            </Stack>

        </>
    )
}

export default PostsActivityPage;