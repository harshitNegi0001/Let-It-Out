import { Box, Divider, TextField, Button, Backdrop, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useState } from "react";
import axios from 'axios';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { logout, setState } from '../../store/authReducer/authReducer.js';


function DeleteAccount() {
    const navigate = useNavigate();
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (e)=>{
        e.preventDefault();
        setOpenBackdrop(true);
    }
    const handleCloseBackdrop = () => {

        document.activeElement?.blur();
        setOpenBackdrop(false);
    }
    const deleteAccount = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(`${backend_url}/api/delete-my-account`,
                {
                    password
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            dispatch(setState({ success: result.data.message}));

            dispatch(logout());
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error }));
            // console.log(err);

        }

    }

    return (
        <>
            <Stack width={'100%'} height={"100%"} p={2}>
                <Stack width={'100%'} height={'100%'} pb={{ xs: '50px', sm: '10px' }} spacing={3} overflow={'scroll'}>
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start' }}>
                        <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton onClick={() => navigate('/settings/account')} size="small">
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" component={'div'} color="text.main" fontWeight={'600'}>
                                Delete account
                            </Typography>
                        </Box>
                        <Typography variant="body2" component={'div'} fontSize={{ xs: '11px', sm: '14px' }} color="text.secondary" >
                            Deleting your account is permanent. When you delete your account, your profile, photos, videos, comments, likes and followers will be permanently removed. If you’d just like to take a break, you can temporarily deactivate your account.
                        </Typography>
                        {/* <Typography variant="body2" component={'div'} fontSize={{ xs: '11px', sm: '14px' }} color="text.secondary" >
                            We’re sorry to see you go. We’d like to know why you’re deleting your account as we may be able to help with common issues.
                        </Typography> */}

                    </Box>
                    <form onSubmit={handleSubmit}>
                        <Box width={'100%'} p={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
                            <Typography variant="body1" fontWeight={'600'}>
                                For your security, please re-enter your password to continue
                            </Typography>
                            <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="password" fullWidth color="secondary" label="Password" />
                            <Box width={'100%'} pt={3} sx={{ display: 'flex', justifyContent: "center" }}>
                                <Button loading={isLoading} type="submit" variant="contained" color="secondary" size="large" sx={{ width: '100%', maxWidth: '230px', textTransform: 'none' }}>Continue</Button>
                            </Box>
                            {/* <Box width={'100%'}  sx={{display:'flex',justifyContent:"center"}}>
                                                <Button  color="secondary" >Cancle</Button>
                                            </Box> */}
                        </Box>
                    </form>
                    
                </Stack>
                <Backdrop sx={{ zIndex: 10000 }} open={openBackdrop} onClick={() => setOpenBackdrop(false)}>
                        <Box width={'80%'} maxWidth={'450px'} onClick={(e) => e.stopPropagation()} bgcolor={'primary.light'} borderRadius={2} display={'flex'} flexDirection={'column'} gap={2} p={2}>
                            <Box width={'100%'} >
                                <Typography variant="body1" component={'div'}>Are you sure to permanent delete your account</Typography>
                                <Typography variant="body2" fontSize={'10px'}>Once deleted account can't be recover</Typography>
                            </Box>
                            <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>

                                <Button variant="text"   sx={{color:'text.primary'}} onClick={handleCloseBackdrop}>Cancle</Button>
                                <Button variant="contained" color="error" loading={isLoading} onClick={deleteAccount} startIcon={<WarningAmberIcon/>}>Confirm</Button>
                            </Box>
                        </Box>
                    </Backdrop>
            </Stack>
        </>
    )
}

export default DeleteAccount;