import { Avatar, Box, Divider, Skeleton, Stack, Typography, Tab, Tabs, Button } from "@mui/material";
import { useState } from "react";
import Posts from "./components/Posts";
import Replies from "./components/Replied";
import Bookmarked from "./components/Bookmarked";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FullPageImage from "./components/FullPageImage";

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

function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState('posts');
    const [images, setImages] = useState([]);

    const { userInfo } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const handleChange = (_, newValue) => {
        setValue(newValue);

    };
    return (
        <>
            <Stack width={'100%'} height={'100%'} spacing={1} overflow={'scroll'} sx={{ scrollbarWidth: 'none' }} p={1} alignItems={'center'} pb={{ xs: '55px', sm: 2 }} boxSizing={'border-box'}>
                
                <Box width={'100%'} height={{ xs: '130px', sm: '280px' }} minHeight={{ xs: '130px', sm: '280px' }} position={'relative'}>
                    <Box width={'100%'} height={'100%'} onClick={()=>{if(userInfo?.cover_image){setImages([userInfo.cover_image])}}}>
                        {!isLoading && userInfo?.cover_image && <img src={userInfo.cover_image}  style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                        {isLoading && <Skeleton animation="wave" width={'100%'} height={'100%'} variant="rectangular"></Skeleton>}
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box width={{ xs: '100px', sm: '180px' }} height={{ xs: '100px', sm: '180px' }} bgcolor={'primary.main'} onClick={()=>{if(userInfo?.image){setImages([userInfo.image])}}} borderRadius={'50%'} position={'absolute'} overflow={'hidden'} sx={{ bottom: { xs: '-50px', sm: '-90px' }, left: { xs: '15px', sm: '20px' } ,zIndex:1}} border={'4px solid #1E1B29'}>
                        {!isLoading && <Avatar sx={{ width: '100%', height: '100%', bgcolor: '#aeaabb' }}  >
                            {userInfo?.image && <img src={userInfo.image}  style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}

                        </Avatar>}
                        {isLoading && <Skeleton animation="wave" sx={{ position: 'absolute' }} variant="circular" width={'100%'} height={'100%'} />}
                    </Box>
                </Box>
                <Box width={'100%'} p={1} pt={{ xs: '60px', sm: '100px', display: 'flex', flexDirection: "column", gap: 2 }} position={'relative'}>

                    <Stack width={'100%'}>
                        {isLoading ? <Skeleton animation="wave" width={'40%'} height={'30px'} sx={{ maxWidth: '200px' }} variant="rounded"></Skeleton> : <Box width={'100%'} sx={{ display: "flex", flexDirection: "column", p: 1 }}>
                            <Typography variant="body1" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '16px', sm: '22px' }} fontWeight={'bold'} color="#fff" >
                                {userInfo?.fake_name || userInfo?.name}
                            </Typography>
                            <Typography variant="body2" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '12px', sm: '15px' }} color="text.secondary" >
                                @{userInfo?.username}
                            </Typography>
                        </Box>}
                    </Stack>
                    <Stack width={'100%'} >
                        {
                            isLoading ?
                                <Skeleton width={'80%'} height={'40px'} variant="rounded" animation="wave" /> :
                                <Box width={'100%'} px={1} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" fontSize={{ xs: '10px', sm: '14px' }} color="text.primary">
                                        {userInfo?.bio}
                                    </Typography>
                                    <Box width={'100%'} sx={{ display: 'flex', gap: 4, pb: 2 }}>
                                        <Button variant="text" onClick={() => navigate(`/profile/${userInfo?.username}/followers`)} color="secondary">{userInfo?.followers || 0} Follower</Button>
                                        <Button variant="text" onClick={() => navigate(`/profile/${userInfo?.username}/followings`)} color="secondary">{userInfo?.followings || 0} Following</Button>
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
                            <Posts userData={userInfo || {}} />
                        </CustomPannel>
                        <CustomPannel keyValue={'replies'} value={value}>
                            <Replies userData={userInfo || {}}/>
                        </CustomPannel>
                        <CustomPannel keyValue={'bookmarked'} value={value}>
                            <Bookmarked userData={userInfo || {}} />
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
                            <LoadingPost />
                        </Stack>


                    }

                </Box>

            </Stack>
            {images.length > 0 && <FullPageImage images={images} setImages={setImages} />}
        </>
    )
}
export default Profile;