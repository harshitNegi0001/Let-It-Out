import { Avatar, Box, Divider, Skeleton, Stack, Typography, Tab, Tabs, Button } from "@mui/material";
import { useState } from "react";
import Posts from "./components/Posts";
import Replies from "./components/Replied";
import Bookmarked from "./components/Bookmarked";
import { useSelector } from "react-redux";

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
    const { userInfo } = useSelector(state => state.auth);
    const [profileLoading, setProfileLoading] = useState({
        avatarImg: false,
        coverImage: false,

    })
    const handleChange = (_, newValue) => {
        setValue(newValue);

    };
    return (
        <>
            <Stack width={'100%'} height={'100%'} overflow={'scroll'} sx={{ scrollbarWidth: 'none' }} justifyContent={'center'} p={2} alignItems={'center'} boxSizing={'border-box'}>
                <Stack width={'100%'} height={'100%'} >
                    <Box position={'relative'} width={'100%'} sx={{ aspectRatio: '3/1' }} >

                        {
                            (profileLoading.coverImage) ?
                                <>
                                    <Skeleton variant='rectangular' width={'100%'} height={'100%'} animation='wave'></Skeleton>
                                    <Avatar sx={{ position: 'absolute', width: { sm: '150px', xs: '70px' }, height: { sm: '150px', xs: '70px' }, bottom: { sm: '-60px', xs: '-30px' }, left: '20px', zIndex: '1' }} ></Avatar>
                                    <Skeleton variant='circular' animation='wave' sx={{ position: 'absolute', width: { sm: '150px', xs: '70px' }, height: { sm: '150px', xs: '70px' }, bottom: { sm: '-60px', xs: '-30px' }, left: '20px', zIndex: '2' }}></Skeleton>
                                </>
                                : <>
                                    {userInfo?.bg_image ? <img src={userInfo?.bg_image} onLoad={() => setProfileLoading({ ...profileLoading, coverImage: true })} style={{ width: '100%', aspectRatio: '3/1', objectFit: 'cover' }} alt="" /> : <Box width={'100%'} sx={{ aspectRatio: '3/1' }}></Box>}
                                    <Divider />
                                    <Box sx={{ width: { sm: '150px', xs: '70px' }, height: { sm: '150px', xs: '70px' }, bottom: { sm: '-60px', xs: '-30px' }, borderRadius: '90px', position: 'absolute', zIndex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', left: '20px', border: '3px solid #1E1B29' }}>
                                        {userInfo?.image ? <img src={userInfo?.image} onLoad={() => setProfileLoading({ ...profileLoading, avatarImg: true })} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '90px' }} alt="" /> : <Avatar sx={{ width: '100%', height: '100%' }}></Avatar>}
                                    </Box>
                                </>
                        }
                        {
                            (isLoading) ?
                                <>
                                    <Box width={{ sm: 'calc(100% - 200px)', xs: 'calc(100% - 120px)' }} height={'55px'} sx={{ position: 'absolute', left: { xs: '105px', sm: '185px' }, bottom: '-55px' }}>
                                        <Skeleton variant="text" width={'80%'} animation='wave' height={'45px'} /></Box>
                                </> :
                                <>
                                    <Box width={{ sm: 'calc(100% - 200px)', xs: 'calc(100% - 120px)' }} height={'55px'} sx={{ position: 'absolute', left: { xs: '105px', sm: '185px' }, bottom: '-55px' }}>
                                        <Typography variant="h6" color="text.primary" component={'div'} textOverflow={'ellipsis'} noWrap width={'100%'}> {userInfo?.fake_name || userInfo?.name}</Typography>
                                        <Typography variant="body2" component={'div'} textOverflow={'ellipsis'} noWrap width={'100%'}>{userInfo?.name} </Typography>
                                    </Box>
                                </>
                        }

                    </Box>
                    <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-evenly' }} mt={{ xs: '70px', sm: '100px' }}>
                        <Box width={'fit-content'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} textAlign={'center'}>
                            {(isLoading) ? <><Skeleton width={'100px'} height={'30px'}></Skeleton>
                                <Skeleton width={'50px'} height={'20px'}></Skeleton></>
                                : <Button variant="text" color="secondary">{'3k'} Followers</Button>}
                        </Box>
                        <Box width={'fit-content'} textAlign={'center'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {(isLoading) ? <><Skeleton width={'100px'} height={'30px'}></Skeleton>
                                <Skeleton width={'50px'} height={'20px'}></Skeleton></>
                                : <Button variant="text" color="secondary">{'3k'} Followings</Button>}
                        </Box>
                    </Box>
                    <Box mt={2} mb={1} px={2} width={'100%'} minHeight={'50px'} overflow={'hidden'}>
                        <Typography variant="body2" fontSize={12}>{userInfo?.bio}</Typography>
                    </Box>
                    <Divider orientation='horizontal' />
                    <Stack height={'100%'} position={'relative'} boxSizing={'border-box'}>
                        <Stack direction={'row'} spacing={2} justifyContent={'center'} >
                            <Tabs variant='scrollable' value={value} scrollButtons='auto' sx={{ maxWdth: '100%' }} slotProps={{ indicator: { sx: { backgroundColor: 'secondary.main', borderRadius: '10px', height: 2 } } }} onChange={handleChange} aria-label="Feed options tab">
                                <Tab sx={{ color: '#fff', textTransform: 'none', '&.Mui-selected': { color: 'secondary.main', } }} value={'posts'} label='Posts' id="posts" aria-controls="posts-pannel" />
                                <Tab sx={{ color: '#fff', textTransform: 'none', '&.Mui-selected': { color: 'secondary.main' } }} value={'replies'} label='Replies' id="replies" aria-controls="replies-pannel" />
                                <Tab sx={{ color: '#fff', textTransform: 'none', '&.Mui-selected': { color: 'secondary.main' } }} value={'bookmarked'} label='Bookmarked' id="bookmarked" aria-controls="bookmarked-pannel" />

                            </Tabs>


                        </Stack>
                        <CustomPannel keyValue={'posts'} value={value}>
                            <Posts />
                        </CustomPannel>
                        <CustomPannel keyValue={'replies'} value={value}>
                            <Replies />
                        </CustomPannel>
                        <CustomPannel keyValue={'bookmarked'} value={value}>
                            <Bookmarked />
                        </CustomPannel>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}
export default Profile;