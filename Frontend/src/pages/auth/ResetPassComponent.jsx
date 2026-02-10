import { Box, Button, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setState } from "../../store/authReducer/authReducer";


function ResetPassComponent({ otp, email }) {


    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const changePassword = async (e) => {
        e.preventDefault();
        if (!newPassword.trim()) {
            dispatch(setState({ error: 'Please Enter a password.' }));
            return;
        }
        if (newPassword.trim() != confirmPass.trim()) {
            dispatch(setState({ error: 'Password confirmation failed!' }));
            return;
        }
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/api/reset-password`,
                {
                    email: email,
                    otp: otp,
                    newPassword: newPassword
                },
                {
                    withCredentials: true
                }
            );

            dispatch(setState({ userInfo: result?.data?.userInfo, success: 'Password reset.' }));
            navigate('/')
            setIsLoading(false);

        } catch (err) {
            isLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
            setIsLoading(false);
        }
    }

    return (
        <Stack width={'100%'} borderRadius={3}
            maxWidth={{ xs: '320px', sm: '480px' }}
            border={'2px solid white'}
        >

            <Box width={'100%'} height={'100%'}
                sx={{
                    bgcolor: '#ffffff15',
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 3
                }}>
                <Box width={{ xs: '45px', sm: '55px' }}>
                    <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1770694122/fjfuwt1osgk63l8ci86w.png"
                        style={{ width: '100%', objectFit: 'contain' }}
                        alt="" />
                </Box>
                <Box width={'100%'}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignItems: 'center'
                    }}>
                    <Typography width={'100%'}
                        fontWeight={'600'}
                        textAlign={"center"}
                        variant="h6"
                        fontSize={{ xs: '22px', sm: '28px' }}
                        color="#fff">
                        Reset Password
                    </Typography>
                    <Typography width={'100%'}
                        textAlign={"center"}
                        variant="body2"
                        fontSize={{ xs: '12px', sm: '15px' }}
                        color="text.secondary">
                        Kindly enter a new password
                    </Typography>
                </Box>
                <form onSubmit={changePassword} style={{ width: '100%' }}>
                    <Stack width={'100%'} px={2} spacing={2} pt={2} alignItems={'center'}>

                        <Box width={'100%'} maxWidth={'320px'}>
                            <TextField label="New password" size="small" required
                                value={newPassword} autoComplete="new-pass" onChange={(e) => setNewPassword(e.target.value)} fullWidth color="secondary" type={showPass.new ? 'text' : 'password'}
                                sx={{
                                    '& input::-ms-reveal, & input::-ms-clear': {
                                        display: 'none',
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPass(prev => ({ ...prev, new: !prev.new }))}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPass.new ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Box>

                        <Box width={'100%'} maxWidth={'320px'}>
                            <TextField label="Confirm password" size="small" required
                                value={confirmPass} autoComplete="confirm-pass" onChange={(e) => setConfirmPass(e.target.value)} fullWidth color="secondary" type={showPass.confirm ? 'text' : 'password'}
                                sx={{
                                    '& input::-ms-reveal, & input::-ms-clear': {
                                        display: 'none',
                                    },

                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPass(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPass.confirm ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Box>

                        <Divider sx={{ width: '100%' }} />

                        <Box width={'100%'} sx={{ display: "flex", justifyContent: 'center', pt: 4 }}>
                            <Button loading={isLoading} type="submit" variant="contained" color="secondary" sx={{ width: '100%', maxWidth: '200px', p: 1 }}>
                                Save
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
        </Stack>
    )
}

export default ResetPassComponent;