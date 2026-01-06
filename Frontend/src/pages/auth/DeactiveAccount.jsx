import { Box, Typography, Button, Backdrop, Stack, Divider } from "@mui/material";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import appLogo from "../../assets/letitout_logo.png";
import { useDispatch } from "react-redux";
import { setState } from "../../store/authReducer/authReducer";
import { useState } from "react";


function DeactiveAccount() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const handleCloseBackdrop = () => {
        document.activeElement?.blur();
        setOpenBackdrop(false);
    }
    const reactivateAccount = async () => {
        setIsLoading(true);
        try {
            const result = await axios.get(`${backend_url}/api/reactivate-my-account`, {
                withCredentials: true
            });
            setIsLoading(false);
            dispatch(setState({ success: result.data.message, userInfo: result.data.userInfo }));
            navigate('/');
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
            // console.log(err);
        }
    }
    return (


        <Stack width={'100vw'} height={'100vh'} alignItems={'center'} p={2} overflow={'scroll'}>

            <Stack width={'100%'} maxWidth={'600px'} alignItems={'center'} spacing={1} >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box width={{ xs: '50px', sm: '70px' }}>
                        <img src={appLogo} style={{ width: '100%', aspectRatio: "1", objectFit: 'contain' }} alt="" />
                    </Box>
                    <Typography variant="h6" fontFamily={'Winky Rough'} fontSize={{ xs: '22px', sm: '28px' }} component={'span'}>LET IT OUT</Typography>

                </Box>

                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }} p={2}>
                    <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1767693864/pibtqokt3n1nn25yzyaq.png" style={{ width: '100%', maxWidth: '400px', objectFit: 'contain' }} alt="" />
                </Box>

                <Box width={'100%'}>
                    <Typography variant="h6" textAlign={'center'} fontSize={{ xs: '22px', sm: '28px' }} >
                        Account Temporarily Deactivated
                    </Typography>
                </Box>
                <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '13px' }} textAlign={'center'}>
                        Your account has been temporarily deactivated.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '13px' }} textAlign={'center'}>
                        Don't worry — all your data is safe
                    </Typography>
                    <Typography variant="body1" fontSize={{ xs: '14px', sm: '16px' }} textAlign={'center'}>
                        You can reactive your account anytime.
                    </Typography>

                </Box>
                <Divider orientation="horizontal" sx={{ width: '80%' }} />
                <Box width={'100%'} sx={{ display: 'flex', pt: 2, flexDirection: "column", alignItems: "center", gap: 2 }}>

                    <Button variant="contained" onClick={() => setOpenBackdrop(true)} color="secondary" sx={{ textTransform: 'none' }}>Reactivate Account</Button>
                    <Button color="secondary" size="small" onClick={() => navigate('/login')} sx={{ textTransform: 'none', color: 'text.primary', borderColor: 'white' }} variant="outlined">Back to login</Button>
                </Box>
                <Backdrop sx={{ zIndex: 10000 }} open={openBackdrop} onClick={() => setOpenBackdrop(false)}>
                    <Box width={'280px'} onClick={(e) => e.stopPropagation()} bgcolor={'primary.light'} borderRadius={2} display={'flex'} flexDirection={'column'} gap={2} p={2}>
                        <Box width={'100%'} >
                            <Typography variant="body1" component={'div'}>Reactivate my account</Typography>
                        </Box>
                        <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>

                            <Button variant="text" color="secondary" onClick={handleCloseBackdrop}>Cancle</Button>
                            <Button variant="contained" color="secondary" loading={isLoading} onClick={reactivateAccount}>Confirm</Button>
                        </Box>
                    </Box>
                </Backdrop>
            </Stack>
        </Stack>
    )
}

export default DeactiveAccount;