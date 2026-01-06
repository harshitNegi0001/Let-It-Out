import { Backdrop, Box, Button, Divider, IconButton, Stack, Switch, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import axios from 'axios';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function PrivacySetting() {
    const { userInfo } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [privacy, setPrivacy] = useState(userInfo?.acc_type);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [confirmBackdrop, setConfirmBackdrop] = useState(false);
    const handlePrivacyChange = (newValue) => {
        setConfirmBackdrop(false)
        setPrivacy(newValue);

    }

    useEffect(() => {
        if (privacy != userInfo?.acc_type) {
            changePrivacy();
        }

    }, [privacy]);

    const changePrivacy = async () => {
        try {
            const result = await axios.post(`${backend_url}/api/change-privacy`,
                {
                    accountType: privacy
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        } catch (err) {
            // console.log(err);
        }
    }
    return (
        <>
            <Stack width={'100%'} height={"100%"} p={2}>
                <Stack width={'100%'} height={'100%'} pb={{ xs: '50px', sm: '10px' }} spacing={3} overflow={'scroll'}>

                    <Box width={'100%'} sx={{ display: 'flex', gap: 2 ,alignItems:'center'}}>
                        <IconButton  onClick={()=>navigate('/settings')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" component={'div'} color="text.main" fontWeight={'600'}>
                            Account privacy
                        </Typography>
                    </Box>

                    <Box width={'100%'} border={'1px solid #6E5FAE'} borderRadius={3} height={'85px'} p={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontSize={'18px'}>Private account</Typography>
                        <Switch checked={privacy == 'private'} onChange={() => setConfirmBackdrop(true)} color="secondary" icon={<Box bgcolor={'text.secondary'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} p={'2px'} borderRadius={'50%'}><LockOpenIcon color="primary" fontSize="small" /></Box>} checkedIcon={<Box bgcolor={'secondary.main'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} p={'2px'} borderRadius={'50%'}><LockIcon color="primary" fontSize="small" /></Box>} sx={{ height: '46px', "& .MuiSwitch-switchBase": { pt: '11px' }, "& .MuiSwitch-track": { borderRadius: 12 } }} />
                    </Box>

                    <Typography variant="body2" fontSize={{ xs: '11px', sm: '14px' }}>
                        When your account is public, your profile and posts can be seen by anyone.
                    </Typography>
                    <Typography variant="body2" fontSize={{ xs: '11px', sm: '14px' }}>
                        When your account is private, only the followers you approve can see what you share, including your photos or posts, and your followers and following lists. Certain info on your profile, like your profile picture and username, is visible to everyone.
                    </Typography>
                </Stack>
                <Backdrop open={confirmBackdrop} onClick={() => setConfirmBackdrop(false)} sx={{ zIndex: 9999 }}>
                    <Box width={'100%'} maxWidth={'550px'} p={3} borderRadius={3} bgcolor={'primary.light'} onClick={(e) => e.stopPropagation()} >
                        {(privacy != 'private') ? <Stack width={'100%'} spacing={1} alignItems={'center'} >
                            <Typography variant="body1" sx={{ color: '#fff' }} component={'div'} fontWeight={400} fontSize={{ xs: '16px', sm: '21px' }}>
                                Switch to private account?
                            </Typography>
                            <Box width={'100%'} sx={{ display: 'flex', pt: 4, alignItems: 'center', gap: 2 }} >
                                <DynamicFeedIcon sx={{ color: 'text.primary' }} />
                                <Typography variant="body2" component={'span'} fontSize={{ xs: '12px', sm: '15px' }}>
                                    Only your followers will be able to see your photos and videos.
                                </Typography>

                            </Box>
                            <Box width={'100%'} sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
                                <AlternateEmailIcon sx={{ color: 'text.primary' }} />
                                <Typography variant="body2" component={'span'} fontSize={{ xs: '12px', sm: '15px' }}>
                                    This won't change who can message, tag or @mention you, but you won't be able to tag people who don't follow you.
                                </Typography>

                            </Box>



                            <Stack width={'100%'}>
                                <Divider sx={{ borderBottom: '1px solid #666666ff', width: '100%' }} />

                                <Button variant="text" fullWidth onClick={() => handlePrivacyChange('private')}>
                                    <Typography color="#8176cc" fontWeight={'600'} >
                                        Switch to private
                                    </Typography>
                                </Button>
                                <Divider sx={{ borderBottom: '1px solid #666666ff', width: '100%' }} />
                                <Button variant="text" fullWidth onClick={() => setConfirmBackdrop(false)} >
                                    <Typography color="#fff" fontWeight={'400'}>
                                        Cancle
                                    </Typography>
                                </Button>
                            </Stack>
                        </Stack> : <Stack width={'100%'} spacing={2} alignItems={'center'} >
                            <Typography variant="body1" component={'div'} fontWeight={400} fontSize={{ xs: '16px', sm: '21px' }}>
                                Switch to public account?
                            </Typography>
                            <Box width={'100%'} sx={{ display: 'flex', pt: 4, alignItems: 'center', gap: 2 }} >
                                <DynamicFeedIcon sx={{ color: 'text.primary' }} />
                                <Typography variant="body2" component={'span'} fontSize={{ xs: '12px', sm: '15px' }}>
                                    Anyone can see your posts, reels and stories, and can use your original audio and text.
                                </Typography>

                            </Box>
                            <Box width={'100%'} sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
                                <AlternateEmailIcon sx={{ color: 'text.primary' }} />
                                <Typography variant="body2" component={'span'} fontSize={{ xs: '12px', sm: '15px' }}>
                                    This won't change who can message, tag or @mention you.
                                </Typography>

                            </Box>
                            <Stack width={'100%'}>
                                <Divider sx={{ borderBottom: '1px solid #666666ff', width: '100%' }} />

                                <Button variant="text" fullWidth onClick={() => handlePrivacyChange('public')}>
                                    <Typography color="#8176cc" fontWeight={'600'}>
                                        Switch to public
                                    </Typography>
                                </Button>
                                <Divider sx={{ borderBottom: '1px solid #666666ff', width: '100%' }} />
                                <Button variant="text" fullWidth onClick={() => setConfirmBackdrop(false)} >
                                    <Typography color="#fff" fontWeight={'400'}>
                                        Cancle
                                    </Typography>
                                </Button>
                            </Stack>

                        </Stack>}
                    </Box>
                </Backdrop>
            </Stack>
        </>
    )
}

export default PrivacySetting;