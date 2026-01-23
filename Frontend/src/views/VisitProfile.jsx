import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setState } from "../store/authReducer/authReducer";
import Posts from "./components/Posts";
import Replies from "./components/Replied";
import Bookmarked from "./components/Bookmarked";
import axios from "axios";
import { useState } from "react";
import { Avatar, Box, Button, Divider, IconButton, Tab, Tabs, Skeleton, Stack, Typography } from "@mui/material";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LoadingPost from "./components/LoadingPosts";

function CustomPannel(props) {
    const { children, keyValue, value, ...other } = props;

    return (
        <div role='tabpanel' hidden={value != `${keyValue}`} id={`${keyValue}-pannel`} aria-labelledby={`${keyValue}`} {...other}>
            {value === `${keyValue}` && <Box >
                {children}
            </Box>}
        </div>
    )
}

function VisitProfile() {

    const [userProfileData, setUserProfileData] = useState(null);
    const [restriction, setRestriction] = useState({
        isRestricted: false,
        reason: '',
        message: ''

    })
    const [isLoading, setIsLoading] = useState(false);
    const [loadingFollowBtn, setLoadingFollowBtn] = useState(false);
    const [value, setValue] = useState('posts');

    const { username } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const backend_url = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        if (username) {
            if (username == userInfo.username) {
                navigate('/profile');
            }
            getUserProfileData();
        }
    }, [username]);


    const handleFollow = async () => {
        if (!userProfileData?.followingStatus) {
            return;
        }
        const reqFor = (userProfileData.followingStatus == 'not_followed') ? 'follow' : 'cancle';
        try {
            setLoadingFollowBtn(true);
            const result = await axios.post(
                `${backend_url}/api/req-follow`, {
                reqFor,
                following_id: userProfileData?.id
            }, {
                withCredentials: true
            }
            );
            setLoadingFollowBtn(false);
            setUserProfileData(prev => ({ ...prev, followingStatus: result.data.followingStatus }));
        } catch (err) {
            // console.log(err);
            setLoadingFollowBtn(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));
        }
    }
    const getUserProfileData = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/api/get-profile-data?username=${username}`,
                { withCredentials: true }
            );


            setIsLoading(false);
            if (result?.data?.restriction) {
                setRestriction(result.data.restriction);
            }
            setUserProfileData(result?.data?.userDetail);

        } catch (err) {
            setIsLoading(false);
            // console.log(err);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));
        }
    }
    const handleChange = (_, newValue) => {
        setValue(newValue);

    };

    return (

        <>
            <Stack width={'100%'} height={'100%'} spacing={1} overflow={'scroll'} sx={{ scrollbarWidth: 'none' }} p={1} alignItems={'center'} pb={{ xs: '55px', sm: 2 }} boxSizing={'border-box'}>
                <Box width={'100%'} height={{ xs: '130px', sm: '280px' }} minHeight={{ xs: '130px', sm: '280px' }} position={'relative'}>
                    <Box width={'100%'} height={'100%'}>
                        {!isLoading && userProfileData?.cover_image && <img src={userProfileData.cover_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                        {isLoading && <Skeleton animation="wave" width={'100%'} height={'100%'} variant="rectangular"></Skeleton>}
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box width={{ xs: '100px', sm: '180px' }} height={{ xs: '100px', sm: '180px' }} bgcolor={'primary.main'} borderRadius={'50%'} position={'absolute'} overflow={'hidden'} sx={{ bottom: { xs: '-50px', sm: '-90px' }, left: { xs: '15px', sm: '20px' } }} border={'4px solid #1E1B29'}>
                        {!isLoading && <Avatar sx={{ width: '100%', height: '100%', bgcolor: '#aeaabb' }}>
                            {userProfileData?.image && <img src={userProfileData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}

                        </Avatar>}
                        {isLoading && <Skeleton animation="wave" sx={{ position: 'absolute' }} variant="circular" width={'100%'} height={'100%'} />}
                    </Box>
                </Box>
                <Box width={'100%'} p={1} pt={{ xs: '60px', sm: '100px', display: 'flex', flexDirection: "column", gap: 2 }} position={'relative'}>
                    {!isLoading && !restriction?.isRestricted && <Box height={'50px'} position={'absolute'} sx={{ top: 8, right: 8, display: 'flex', gap: 1, alignItems: "center" }}>
                        <IconButton onClick={() => navigate(`/chats/${userProfileData.username}`, { state: { userData: userProfileData | {} } })}>
                            <SmsOutlinedIcon />
                        </IconButton>
                        {!(userProfileData?.followingStatus == 'not_followed') ? <Button loading={loadingFollowBtn} onClick={handleFollow} color="secondary" sx={{ textTransform: 'none' }} variant="outlined" >{userProfileData?.followingStatus == 'accepted' ? 'Unfollow' : 'Requested'}</Button> : <Button onClick={handleFollow} loading={loadingFollowBtn} color="secondary" sx={{ textTransform: 'none' }} variant="contained" >Follow</Button>}
                    </Box>}
                    <Stack width={'100%'}>
                        {isLoading ? <Skeleton animation="wave" width={'40%'} height={'30px'} sx={{ maxWidth: '200px' }} variant="rounded"></Skeleton> : <Box width={'100%'} sx={{ display: "flex", flexDirection: "column", p: 1 }}>
                            <Typography variant="body1" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '16px', sm: '22px' }} fontWeight={'bold'} color="#fff" >
                                {userProfileData?.name}
                            </Typography>
                            <Typography variant="body2" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '12px', sm: '15px' }} color="text.secondary" >
                                @{userProfileData?.username}
                            </Typography>
                        </Box>}
                    </Stack>
                    <Stack width={'100%'} >
                        {
                            isLoading ?
                                <Skeleton width={'80%'} height={'40px'} variant="rounded" animation="wave" /> :
                                <Box width={'100%'} px={1} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" fontSize={{ xs: '10px', sm: '14px' }} color="text.primary">
                                        {userProfileData?.bio}
                                    </Typography>
                                    <Box width={'100%'} sx={{ display: 'flex', gap: 4, pb: 2 }}>
                                        <Button variant="text" onClick={()=>{if(restriction?.isRestricted){return;} else{navigate(`/profile/${userProfileData?.username}/followers`)}}}  color="secondary">{restriction?.isRestricted ? '0' : `${userProfileData?.followers}`} Follower</Button>
                                        <Button variant="text" onClick={()=>{if(restriction?.isRestricted){return;} else{navigate(`/profile/${userProfileData?.username}/followings`)}}} color="secondary">{restriction?.isRestricted ? '0' : `${userProfileData?.followings}`} Following</Button>
                                    </Box>
                                </Box>

                        }
                    </Stack>
                    <Divider sx={{ width: '100%' }} />
                    {!isLoading && <Stack height={'100%'} position={'relative'} boxSizing={'border-box'}>
                        <Stack direction={'row'} spacing={2} justifyContent={'center'} >
                            <Tabs variant='scrollable' value={value} scrollButtons='auto' sx={{ maxWdth: '100%' }} slotProps={{ indicator: { sx: { backgroundColor: 'secondary.main', borderRadius: '10px', height: 2 } } }} onChange={handleChange} aria-label="Feed options tab">
                                <Tab sx={{ color: '#fff', textTransform: 'none', '&.Mui-selected': { color: 'secondary.main', } }} value={'posts'} label='Posts' id="posts" aria-controls="posts-pannel" />
                                <Tab sx={{ color: '#fff', textTransform: 'none', '&.Mui-selected': { color: 'secondary.main' } }} value={'replies'} label='Replies' id="replies" aria-controls="replies-pannel" />
                                <Tab sx={{ color: '#fff', textTransform: 'none', '&.Mui-selected': { color: 'secondary.main' } }} value={'bookmarked'} label='Bookmarked' id="bookmarked" aria-controls="bookmarked-pannel" />

                            </Tabs>


                        </Stack>
                        <CustomPannel keyValue={'posts'} value={value}>
                            <Posts userData={userProfileData || {}} />
                        </CustomPannel>
                        <CustomPannel keyValue={'replies'} value={value}>
                            <Replies />
                        </CustomPannel>
                        <CustomPannel keyValue={'bookmarked'} value={value}>
                            <Bookmarked userData={userProfileData || {}}/>
                        </CustomPannel>
                    </Stack>}

                    {
                        isLoading && <Stack width={'100%'} p={1} spacing={1} mt={3}>
                            <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center', gap: '10%' }}>
                                <Skeleton animation="wave" variant="rounded" width={'50px'} height={'35px'} />
                                <Skeleton animation="wave" variant="rounded" width={'50px'} height={'35px'} />
                                <Skeleton animation="wave" variant="rounded" width={'50px'} height={'35px'} />
                            </Box>
                            <Divider />
                            <LoadingPost/>
                        </Stack>


                    }

                </Box>
            </Stack>
        </>
    )
}

export default VisitProfile;