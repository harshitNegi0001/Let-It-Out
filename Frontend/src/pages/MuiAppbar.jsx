import { AppBar, IconButton, Toolbar, Typography, Button, Box, Stack, Avatar, Badge } from '@mui/material';
import appLogo from '../assets/letitout_logo.png';

import NotificationFilledIcon from '@mui/icons-material/Notifications';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function MuiAppbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const {notificationCount} = useSelector(state=>state.notif);
    return (
        <>
            <AppBar position="static" color='secondary' sx={{ display: { xs: 'flex', sm: 'none' },p:0,m:0 }}>
                <Toolbar sx={{p:0,m:0}}>
                    <Stack direction={'row'} bgcolor={'primary.dark'} height={'100%'} width={'100%'} justifyContent={'space-between'} alignItems={'center'} p={'4px 10px'}>
                        
                        <Box display={'flex'} gap={1} >
                            <img src={appLogo} style={{width:'30px',height:'30px',objectFit:'contain'}} alt="" />
                            <Typography variant="h6" component={'div'} textTransform={'uppercase'} fontFamily={'Winky Rough'}>let it out</Typography>
                            </Box>
                        <Box display={'flex'} gap={2}>
                            <IconButton edge='start' size='large' onClick={() => navigate('/notification')} ><Badge variant='standard' badgeContent={(pathname=='/notification')?0:notificationCount['notification']||0}  color='secondary'><NotificationFilledIcon color={`${pathname == '/notification' ? 'secondary' : ''}`} /></Badge></IconButton>
                            <IconButton edge='start' size='large' onClick={() => navigate('/profile')} ><Avatar sx={{width:'25px',height:'25px',bgcolor:'#fff'}}></Avatar></IconButton>

                        </Box>
                    </Stack>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default MuiAppbar;
