import { Backdrop, Box, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import ForYouFeed from "./components/ForYouFeed";
import FollowingFeed from "./components/FollowingFeed";
import WritePostIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import CreatePost from "./components/CreatePost";
function CustomPannel(props) {
    const { children, keyValue, value, ...other } = props;

    return (
        <div role='tabpanel' hidden={value != `${keyValue}-feed`} id={`${keyValue}-pannel`} aria-labelledby={`${keyValue}-feed`} {...other}>
            {value === `${keyValue}-feed` && <Box sx={{ m: 3, p: 2 }}>
                {children}
            </Box>}
        </div>
    )
}

export default function Home() {
    const [value, setValue] = useState('for-you-feed');
    const navigate = useNavigate();
    const [isOpenCreatePost,setIsOpenCreatePost] =useState(false);
    const closeCreatePost = ()=>{
        document.activeElement?.blur();
        setIsOpenCreatePost(false);
    }
    const handleChange = (_, newValue) => {
        setValue(newValue);

    };
    return (
        <>
            <Stack height={'100%'} position={'relative'}>
                <Backdrop  sx={{zIndex:9999,bgcolor:'#ffffff18',backdropFilter:'blur(2px)'}} open={isOpenCreatePost} onClick={closeCreatePost}>
                    <CreatePost closeCreatePost={closeCreatePost}/>
                </Backdrop>
                <Stack direction={'row'} spacing={2} justifyContent={'center'} >

                    <Tabs value={value} slotProps={{ indicator: { sx: { backgroundColor: 'secondary.main', borderRadius: '10px', height: 2 } } }} onChange={handleChange} aria-label="Feed options tab">
                        <Tab sx={{ color: '#fff', m: '0 10px', '&.Mui-selected': { color: 'secondary.main', } }} value={'for-you-feed'} label='For you' id="for-you-feed" aria-controls="for-you-pannel" />
                        <Tab sx={{ color: '#fff', m: '0 10px', '&.Mui-selected': { color: 'secondary.main' } }} value={'following-feed'} label='Following' id="following-feed" aria-controls="following-pannel" />
                    </Tabs>


                </Stack>
                <CustomPannel keyValue={'for-you'} value={value}>
                    <ForYouFeed />
                </CustomPannel>
                <CustomPannel keyValue={'following'} value={value}>
                    <FollowingFeed />
                </CustomPannel>

                <IconButton onClick={() =>setIsOpenCreatePost(true)} title="Create post" sx={{ bgcolor: 'secondary.main', position: 'absolute', bottom: { xs: '70px', sm: '15px' }, right: '15px', '&:hover': { bgcolor: 'secondary.dark', color: 'text.secondary' } }}>
                    <WritePostIcon />
                </IconButton>
            </Stack>
        </>
    )
}