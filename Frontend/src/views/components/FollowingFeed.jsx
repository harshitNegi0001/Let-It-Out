import { Box, Button, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import LoadingPost from "./LoadingPosts";
import { useEffect } from "react";
import { setState } from "../../store/authReducer/authReducer";
import { useDispatch } from "react-redux";
import axios from "axios";
import PostUI from "./PostUI";
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router-dom";


function FollowingFeed() {
    const [isLoading, setIsLoading] = useState(true);
    const [postList, setPostList] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const scrollRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

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
    useEffect(() => {

        getPosts();
    }, []);

    const handleScroll = () => {
        if (isLoading) {
            return;
        }
        if (!hasMore) {
            return;
        }
        const el = scrollRef.current;

        if (el.scrollTop + el.clientHeight + 1 >= el.scrollHeight) {
            getPosts();
        }
    }
    const getPosts = async () => {
        setIsLoading(true);
        try {
            const lastFeedId = postList.length == 0 ? null : postList[postList.length - 1]?.post_data?.id;
            const url = lastFeedId ?
                `${backend_url}/api/get-posts?limit=${20}&&reqFollowing=${true}&&lastFeedId=${lastFeedId}` :
                `${backend_url}/api/get-posts?limit=${20}&&reqFollowing=${true}`
            const result = await axios.get(
                url,
                { withCredentials: true }
            );

            if (result?.data?.postsList?.length < 20) {
                setHasMore(false);
            }
            setPostList(prev => ([...prev, ...result?.data?.postsList]));

            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);

            dispatch(setState({ error: err?.response?.data?.error || "Something Went wrong!" }));
            // console.log(err);
        }
    }

    return (
        <Stack width={'100%'} height={'100%'} spacing={1} overflow={'scroll'} ref={scrollRef} sx={{ scrollbarWidth: 'none' }} p={1} pb={{ xs: '110px', sm: '55px' }} alignItems={'center'} boxSizing={'border-box'}>
            <Stack width={'100%'} px={1} spacing={2} height={'fit-content'}>

                {postList.map(p => {

                    return (<PostUI key={p.post_data.id} followed={p.user_data?.following_status} postData={p.post_data} userData={p.user_data} />)
                }
                )}
                {
                    isLoading ?
                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                            <LoadingPost />
                            <LoadingPost />

                        </Box> :

                        postList.length == 0 &&

                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} p={1} >
                            <Box width={'100%'} maxWidth={{ xs: '280px', sm: '350px' }}>
                                <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768990892/pahraxrxhocdy6zn5aqd.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                            </Box>
                            <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography width={'100%'} textAlign={'center'} variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                                    Your space is quite right now
                                </Typography>
                                <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                    Follow people to see their thoughts, moods, moments here.
                                </Typography>
                            </Box>
                            <Box width={'100%'} maxWidth={{ xs: '280px', sm: '350px' }}>
                                <Button fullWidth color="secondary" sx={{ borderRadius: 4, textTransform: 'none' }} onClick={() => navigate('/search')} endIcon={<SearchIcon />} variant="contained" >
                                    Explore people
                                </Button>
                            </Box>
                            <Box width={'100%'} maxWidth={{ xs: '280px', sm: '350px' }}>
                                <Button fullWidth color="secondary" onClick={() => navigate('/explore')} sx={{ borderRadius: 4, textTransform: 'none' }} endIcon={<ArrowForwardIosIcon />} >
                                    Find moods you related to
                                </Button>
                            </Box>
                        </Box>

                }
                {
                    postList.length != 0 && !hasMore &&
                    <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary" component={'span'} fontSize={{ xs: '10px', sm: '13px' }}>
                        ( ︶︵︶ ) No more posts ( ︶︵︶ )
                    </Typography>
                </Box>
                }

            </Stack>

        </Stack>
    )
}

export default FollowingFeed;