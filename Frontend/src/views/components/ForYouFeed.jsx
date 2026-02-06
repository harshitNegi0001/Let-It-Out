import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import LoadingPost from "./LoadingPosts";
import { useEffect } from "react";
import { setState } from "../../store/authReducer/authReducer";
import { useDispatch } from "react-redux";
import axios from "axios";
import PostUI from "./PostUI";
import { useRef } from "react";




function ForYouFeed() {
    const [isLoading, setIsLoading] = useState(false);
    const [postList, setPostList] = useState([]);
    const [hasmore, setHasmore] = useState(true);
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {

        const el = scrollRef.current;
        if (!el) {
            return;
        }
        el.addEventListener('scroll', handleScroll);

        return () => {
            el.removeEventListener("scroll", handleScroll);
        }

    }, [isLoading])
    useEffect(() => {
        getPosts();
    }, []);
    const handleScroll = () => {
        if (!hasmore) {
            return;
        }

        if (isLoading) {
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
            const lastFeedId = postList.length == 0 ? null : postList[postList.length - 1]?.post_data.id;
            const url = (lastFeedId) ?
                `${backend_url}/api/get-posts?limit=${20}&&lastFeedId=${lastFeedId}` :
                `${backend_url}/api/get-posts?limit=${20}`
            const result = await axios.get(
                url,
                { withCredentials: true }
            );
            if (result?.data?.postsList?.length < 20) {
                setHasmore(false);
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
        <Stack width={'100%'} ref={scrollRef} height={'100%'} spacing={1} overflow={'scroll'} sx={{ scrollbarWidth: 'none' }} p={1} pb={{ xs: '110px', sm: '55px' }} alignItems={'center'} boxSizing={'border-box'}>
            <Stack width={'100%'} px={1} spacing={2} height={'fit-content'} >

                {postList.map(p => {

                    return (<PostUI key={p.post_data.id} followed={p.user_data.following_status} postData={p.post_data} userData={p.user_data} />)
                }
                )}
            </Stack>
            {
                isLoading &&
                <Box width={'100%'}>

                    <LoadingPost />
                    <LoadingPost />

                </Box>


            }
            {
                !hasmore &&
                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary" component={'span'} fontSize={{ xs: '10px', sm: '13px' }}>
                        ( ︶︵︶ ) No more posts ( ︶︵︶ )
                    </Typography>
                </Box>
            }
        </Stack>
    )
}

export default ForYouFeed;