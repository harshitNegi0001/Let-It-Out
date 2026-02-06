import { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";
import { Box, Stack, Typography } from "@mui/material";
import PostUI from "./PostUI";
import ConfirmBox from "./ConfirmBox";
import LoadingPost from "./LoadingPosts";


function ExploreFeed({ moods = [] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [postslist, setPostslist] = useState([]);

    const scrollRef = useRef();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {

        if (moods.length > 0) {
            const reqMood = moods.map(m => m.value);
            getPosts(reqMood);
        }


        return (() => {
            setPostslist([])
        })
    }, [moods])

    const getPosts = async (reqMood) => {
        setIsLoading(true);
        try {
            const result = await axios.get(
                `${backend_url}/api/get-posts?currPage=${1}&&limit=${10}&&reqMood=${reqMood}`,
                { withCredentials: true }
            );

            setPostslist(prev => ([...prev, ...result?.data?.postsList]));
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Interal Server Error!" }));
            // console.log(err);
        }
    }
    return (
        <>

            {!isLoading && <Stack width={'100%'} spacing={1} >
                <Box width={'100%'} position={'absolute'} top={0} >
                    <ConfirmBox setUserPost={setPostslist} userPost={postslist} />
                </Box>
                {postslist.map(p => {

                    return (<PostUI key={p.post_data.id} followed={p.user_data?.following_status} postData={p.post_data} userData={p.user_data} />)
                }
                )}

            </Stack>}
            {
                isLoading && [1,2,3].map(i=>
                    <LoadingPost key={i}/>
                )
            }
            {!isLoading && postslist.length == 0 && < Stack width={'100%'} spacing={1} pt={2}>


                <Box width={'100%'} py={0} px={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={'100%'} maxWidth={{ xs: '250px', sm: '400px' }}>
                        <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768469024/rltbhfkuuvq7mxre6vjr.png" style={{ width: "100%", objectFit: "contain" }} alt="" />

                    </Box>
                    <Typography width={'100%'} textAlign={'center'} variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                        {(moods.length > 0) ? 'Nothing here yet' : 'Choose a mood to explore'}
                    </Typography>
                    <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                        {(moods.length > 0) ? "You're not alone — just the first one here right now." : 'Select a mood above to see posts that match how you’re feeling.'}
                    </Typography>
                    <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                        {(moods.length > 0) ? " Your words could help someone else too." : 'Every mood has a story waiting.'}
                    </Typography>
                </Box>

            </Stack >}

        </>
    )
}

export default ExploreFeed;