import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";


function VarifyOtpComponent({ setPage, saveOtp,email }) {

    const [otp, setOtp] = useState({
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: ''
    });
    const [isLoading, setIsloading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const valid = (otp?.[1]&&otp?.[2]&&otp?.[3]&&otp?.[4]&&otp?.[5]&&otp?.[6]);

    const handleOtpChange = (e, i) => {
        const value = e.target.value;
        const checkNumber = /^[0-9]?$/;
        if (!checkNumber.test(e.target.value)) {
            return;
        }
        setOtp(prev => ({ ...prev, [i]: value }));
        if (value && i < 6) {
            const nextInput = document.getElementById(`otpInput${i + 1}`);
            nextInput.focus();
            return;
        }
        if (!value && i > 1) {
            const prevInput = document.getElementById(`otpInput${i - 1}`);
            prevInput.focus();
        }

    }

    const submitOtp = async (e) => {
        e.preventDefault();
        
        if(!valid){
            return;
        }
        const structuredOtp = `${otp?.[1]}${otp?.[2]}${otp?.[3]}${otp?.[4]}${otp?.[5]}${otp?.[6]}`;
        saveOtp(structuredOtp);
        try {
            setIsloading(true);
            const result = await axios.post(
                `${backend_url}/api/verify-otp`,
                {
                    otp:structuredOtp,
                    email:email
                },
                {
                    withCredentials: true
                }
            )
            
            setPage('RESET_PASSWORD');
            setIsloading(false);
        } catch (err) {
            setIsloading(false)
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
                        Verify OTP
                    </Typography>
                    <Typography width={'100%'}
                        textAlign={"center"}
                        variant="body2"
                        fontSize={{ xs: '12px', sm: '15px' }}
                        color="text.secondary">
                        Enter 6-digit OTP sent on your email.
                    </Typography>
                </Box>
                <form onSubmit={submitOtp}
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: "column",
                        alignItems: 'center'
                    }}>
                    <Box width={'90%'} sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {[1, 2, 3, 4, 5, 6].map(i =>
                            <TextField
                                key={i}
                                id={`otpInput${i}`}
                                variant="outlined"
                                value={otp?.[i]}
                                onChange={(e) => handleOtpChange(e, i)}
                                size="small"
                                color="secondary"
                                required
                                sx={{
                                    width: { xs: '25px', sm: '35px' },
                                    height: { xs: '25px', sm: '35px' },
                                    "& .MuiOutlinedInput-root": {
                                        height: { xs: "30px", sm: "40px" },
                                        padding: 0,
                                    },
                                    "& input": {
                                        padding: 0,
                                        textAlign: 'center',
                                        fontSize: { xs: '12px', sm: "16px" },
                                    },
                                }}>

                            </TextField>
                        )}
                    </Box>
                    <Box mt={5} >
                        <Button disabled={!valid} loading={isLoading}
                            type="submit"
                            sx={{ textTransform: 'none' }}
                            variant="contained"
                            color="secondary">
                            Verify
                        </Button>
                    </Box>
                </form>

            </Box>

        </Stack>
    )
}

export default VarifyOtpComponent;