import { Box, Button, Divider, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";



function EnterEmailComponent({setPage,saveEmail}) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsloading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const submitEmail = async (e) => {
        e.preventDefault();
        const trimedEmail=email.trim()
        const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!checkEmail.test(trimedEmail)) {

            dispatch(setState({ error: 'Invalid Email Address' }));
        }

        try {
            setIsloading(true);
            const result = await axios.post(
                `${backend_url}/api/send-otp`,
                {
                    email: trimedEmail
                },
                {
                    withCredentials: true
                }
            )
            dispatch(setState({success:'Otp sent to your email.'}));
            setPage('VERIFY_OTP');
            saveEmail(trimedEmail);
            setIsloading(false);
        } catch (err) {
            setIsloading(false);
            saveEmail('')
            dispatch(setState({ error: err?.response?.data?.error || 'Internal Server Error! ' }));
            console.log(err);
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
                        Search your account
                    </Typography>
                    <Typography width={'100%'}
                        textAlign={"center"}
                        variant="body2"
                        fontSize={{ xs: '12px', sm: '15px' }}
                        color="text.secondary">
                        Enter your email address to find your account and reset your password.
                    </Typography>
                </Box>
                <form onSubmit={submitEmail}
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: "column",
                        alignItems: 'center'
                    }}>
                    <Box width={'90%'} >
                        <TextField
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="small"
                            color="secondary"
                            label={'Email'}
                            required fullWidth>

                        </TextField>
                    </Box>
                    <Box mt={5} >
                        <Button loading={isLoading}
                            type="submit"
                            sx={{ textTransform: 'none' }}
                            variant="contained"
                            color="secondary">
                            Generate OTP
                        </Button>
                    </Box>
                </form>
                <Divider sx={{width:'90%'}} >
                    <Typography variant="body2" fontSize={{xs:'10px',sm:'12px'}} color="text.secondary">
                        or
                    </Typography>
                </Divider>
                <Typography variant="body2"
                    fontSize={{ xs: '12px', sm: '15px' }}
                    color="text.secondary">
                    Back to <Link onClick={() => navigate('/login')}
                        sx={{ color: 'text.primary', cursor: 'pointer' }}>
                        Login
                    </Link>
                </Typography>
            </Box>

        </Stack>
    )
}

export default EnterEmailComponent;