import { Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch} from 'react-redux';
import axios from 'axios';
import { logout, setState } from '../../store/authReducer/authReducer.js';
import { useState } from "react";

function DeactivateAccount() {
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const deactivateAccount = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const result = await axios.post(`${backend_url}/api/deactivate-my-account`,
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

            dispatch(setState({ success: result.data.message, userInfo: result.data.userInfo }));
            
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
                                Deactivate account
                            </Typography>
                        </Box>
                        <Typography variant="body2" component={'div'} fontSize={{ xs: '11px', sm: '14px' }} color="text.secondary" >
                            Deactivating your account is temporary, and it means your profile will be hidden on our platform until you reactivate it through Accounts Center or by logging in to your Instagram account.
                        </Typography>


                    </Box>

                    <form onSubmit={deactivateAccount}>
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
            </Stack>
        </>
    )
}

export default DeactivateAccount;