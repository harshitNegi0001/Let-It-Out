import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";
import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import PostUI from "./PostUI";


function ExploreFeed({ moods = [] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [postslist, setPostslist] = useState([]);
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
                {postslist.map(p => {
                    
                    return (<PostUI key={p.post_data.id} followed={true} postData={p.post_data} userData={p.user_data} />)
                }
                )}

            </Stack>}
            {
                isLoading && <Stack width={'100%'} p={1} spacing={1} mt={3}>

                    <Box width={'100%'} mt={2} borderRadius={3} overflow={'hidden'} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack direction={'row'} width={'100%'} spacing={2} boxSizing={'border-box'} p={1} justifyContent={'start'} bgcolor={'#42424250'} alignItems={'center'}>
                            <Box width={{ xs: '40px', sm: '55px' }} height={{ xs: '40px', sm: '55px' }} overflow={'hidden'} borderRadius={'30px'} >
                                <Skeleton animation="wave" variant="circular" width={'100%'} height={'100%'} />


                            </Box>
                            <Stack spacing={'4px'} width={'calc(100% - 70px)'} >
                                <Skeleton animation="wave" variant="text" width={'40%'} sx={{ minWidth: '60px', maxWidth: '150px' }} />
                                <Skeleton animation="wave" variant="text" width={'30%'} sx={{ minWidth: '40px', maxWidth: '120px' }} />

                            </Stack>
                        </Stack>
                        <Box width={'100%'} pt={'4px'} sx={{ display: 'flex', flexDirection: 'column', aspectRatio: { xs: '5/3', sm: '2/1' } }}>
                            <Skeleton animation="wave" variant="rectangle" width={'100%'} height={'100%'} />
                        </Box>
                    </Box>
                </Stack>
            }
            {!isLoading && postslist.length == 0 && < Stack width={'100%'} spacing={1} pt={2}>


                <Box width={'100%'} py={3} px={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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