import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
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

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {

        getPosts();
    }, [])
    const getPosts = async (reqMood) => {
        setIsLoading(true);
        try {
            const result = await axios.get(
                `${backend_url}/api/get-posts?currPage=${1}&&limit=${10}&&reqFollowing=${true}`,
                { withCredentials: true }
            );

            setPostList(prev => ([...prev, ...result?.data?.postsList]));

            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);

            dispatch(setState({ error: err?.response?.data?.error || "Something Went wrong!" }));
            // console.log(err);
        }
    }

    return (
        <Stack width={'100%'} height={'100%'} spacing={1} overflow={'scroll'} sx={{ scrollbarWidth: 'none' }} p={1} pb={{xs:'110px',sm:'55px'}} alignItems={'center'} boxSizing={'border-box'}>
            {
                isLoading ?
                    <Box width={'100%'}>

                        <LoadingPost />
                        <LoadingPost />

                    </Box>
                    : <Stack width={'100%'} px={1} spacing={2} height={'fit-content'}>
                        
                        {postList.map(p => {

                            return (<PostUI key={p.post_data.id} followed={p.user_data?.following_status} postData={p.post_data} userData={p.user_data} />)
                        }
                        )}
                        {
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
                                    <Button fullWidth color="secondary" sx={{borderRadius:4, textTransform:'none'}} onClick={()=>navigate('/search')} endIcon={<SearchIcon/>} variant="contained" >
                                        Explore people
                                    </Button>
                                </Box>
                                <Box width={'100%'} maxWidth={{ xs: '280px', sm: '350px' }}>
                                    <Button fullWidth color="secondary" onClick={()=>navigate('/explore')}  sx={{borderRadius:4, textTransform:'none'}} endIcon={<ArrowForwardIosIcon/>} >
                                        Find moods you related to
                                    </Button>
                                </Box>
                            </Box>
                        }
                    </Stack>
            }
        </Stack>
    )
}

export default FollowingFeed;