import { Avatar, Backdrop, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import settingsNav from "../navigation/settingsNav.js";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from "../store/authReducer/authReducer.js";

function Settings() {
    const { userInfo,isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    }

    const navigate = useNavigate();
    return (
        <>
            <Stack width={'100%'} height={{ sm: '100%', xs: 'calc(100% - 60px)' }} spacing={2} p={2} >
                <Stack width={'100%'} direction={'column'} height={'100%'} sx={{pb:{xs:'60px',sm:'10px'},overflowY:'scroll'}} >
                    <Box width={'100%'} height={{ xs: '180px', sm: '250px' }} sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }} pt={3}>
                        <Box width={'100%'} height={{ xs: '75px', sm: '120px' }} sx={{ display: 'flex', gap: 1 }}>
                            {userInfo.image ? <img src={userInfo.image} style={{ height: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '50%' }} alt="" /> : <Box height={'100%'} sx={{ aspectRatio: '1' }}><Avatar sx={{ width: '100%', height: '100%' }} /></Box>}
                            <Box width={{ xs: 'calc(100% - 85px)', sm: 'calc(100% - 130px)' }} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start', justifyContent: 'center' }} height={'100%'} >
                                <Typography variant="body1" component={'div'} width={'100%'} fontSize={{ xs: 18, sm: 24 }} noWrap textOverflow={'ellipsis'} color="text.primary">
                                    {userInfo.fake_name||userInfo.name}
                                </Typography>
                                {<Typography variant="body2" component={'span'} width={'100%'} fontSize={{ xs: 14, sm: 16 }} noWrap textOverflow={'ellipsis'} color="text.secondary">
                                    {userInfo.username }
                                </Typography>}

                            </Box>
                        </Box>
                        <Button variant="contained" color="secondary" sx={{ textTransform: 'none' }} onClick={() => navigate('/edit-profile')} endIcon={<EditOutlinedIcon />}>Edit profile</Button>
                    </Box>
                    <Divider />
                    <Stack width={'100%'} direction={'column'} spacing={1} py={1}>
                        {settingsNav.map(nav => <Button key={nav.id} variant="text" onClick={()=>navigate(nav.path)} fullWidth sx={{ height: '55px', color: 'white', display: 'flex', justifyContent: 'space-between' }} endIcon={<ArrowForwardIosIcon />}>{nav.name}</Button>)}
                    </Stack>
                    <Divider />
                    <Box width={'100%'} sx={{ display: 'flex', pt: 3, justifyContent: 'center' }}>
                        <Button variant="contained" onClick={()=>setOpenBackdrop(true)} color="error" endIcon={<LogoutIcon />}>log out</Button>
                    </Box>
                    <Backdrop sx={{ zIndex: 10000 }} open={openBackdrop} onClick={() => setOpenBackdrop(false)}>
                        <Box width={'280px'} onClick={(e) => e.stopPropagation()} bgcolor={'primary.light'} borderRadius={2} display={'flex'} flexDirection={'column'} gap={2} p={2}>
                            <Box width={'100%'} >
                                <Typography variant="body1" component={'div'}>Are you sure to logout</Typography>
                            </Box>
                            <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>

                                <Button variant="text" color="secondary" onClick={handleCloseBackdrop}>Cancle</Button>
                                <Button variant="contained" color="error" loading={isLoading} onClick={()=>dispatch(logout())}>Confirm</Button>
                            </Box>
                        </Box>
                    </Backdrop>
                </Stack>
            </Stack>
        </>
    )
}
export default Settings;