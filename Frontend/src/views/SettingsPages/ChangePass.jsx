import { Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setState } from "../../store/authReducer/authReducer";



function ChangePass() {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const backend_url = import.meta.env.VITE_BACKEND_URL;


    const changePassword = async (e) => {
        e.preventDefault();
        if (newPass != confirmPass) {
            console.log('Password confirmation does not match');
            return;
        }

        try {
            setLoading(true);

            const result = await axios.post(
                `${backend_url}/api/change-password`,
                {
                    oldPass,
                    newPass
                },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            dispatch(setState({ success: result.data.message }));
            setLoading(false);
            navigate('/settings/account')
        } catch (err) {
            dispatch(setState({ error: err?.response?.data?.error }));
            setLoading(false);
            console.log(err);
        }
    }
    return (
        <>
            <Stack width={'100%'} height={"100%"} p={2}>
                <Stack width={'100%'} height={'100%'} pb={{ xs: '50px', sm: '10px' }} spacing={3} overflow={'scroll'}>
                    <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton onClick={() => navigate('/settings/account')} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" component={'div'} color="text.main" fontWeight={'600'}>
                            Change your password
                        </Typography>
                    </Box>

                    <form onSubmit={changePassword}>
                        <Stack width={'100%'} px={2} spacing={2} pt={2}>

                            <Box width={'100%'} >
                                <TextField label="Current password" autoComplete="curr-pass" value={oldPass} onChange={(e) => setOldPass(e.target.value)} fullWidth color="secondary" type="password" />
                            </Box>
                            <Divider />
                            <Box width={'100%'} >
                                <TextField label="New password" value={newPass} autoComplete="old-pass" onChange={(e) => setNewPass(e.target.value)} fullWidth color="secondary" type="password" />
                            </Box>

                            <Box width={'100%'} >
                                <TextField label="Confirm password" value={confirmPass} autoComplete="confirm-pass" onChange={(e) => setConfirmPass(e.target.value)} fullWidth color="secondary" type="password" />
                            </Box>

                            <Divider />

                            <Box width={'100%'} sx={{ display: "flex", justifyContent: 'center' }}>
                                <Button loading={loading} type="submit" variant="contained" color="secondary" sx={{ width: '100%', maxWidth: '450px', p: 1 }}>
                                    Save
                                </Button>
                            </Box>
                        </Stack>
                    </form>

                </Stack>

            </Stack>

        </>
    )
}


export default ChangePass;