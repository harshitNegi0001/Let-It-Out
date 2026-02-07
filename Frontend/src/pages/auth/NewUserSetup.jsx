import { Avatar, Box, Button, Divider, IconButton, InputAdornment, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setState } from "../../store/authReducer/authReducer";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';




function NewUserSetup() {
    const { userInfo, isLoading } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [btnLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameStatus, setUsernameStatus] = useState({
        loading: false,
        available: null, // true | false | null
        error: ""
    });
    const [showPass, setShowPass] = useState({
        new: false,
        confirm: false,
    });
    const [newUserDetail, setNewUserDetail] = useState({

        password: "",
        confirmPass: "",
        fake_name: "",
        image: "",

    });
    const dispatch = useDispatch();
    const [progressUpload, setProgressUpload] = useState(0);
    const profileRef = useRef();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!isLoading && !userInfo?.id) {
            navigate('/login');
        }
        if (userInfo?.username) {
            navigate('/');
        }

    }, [userInfo, isLoading])

    useEffect(() => {
        if (!username) {
            setUsernameStatus({
                loading: false,
                available: null,
                error: ""
            });
            return;
        }
        const usernameRegex = /^[a-z][a-z0-9_]{2,19}$/;

        if (!usernameRegex.test(username)) {
            setUsernameStatus({
                loading: false,
                available: null,
                error: "Only a-z, 0-9, _. Min 3 chars. Must start with letter"
            });
            return;
        }

        let cancelled = false;

        const timer = setTimeout(async () => {
            try {
                const res = await axios.post(
                    `${backend_url}/api/check-username`,
                    { username },
                    { withCredentials: true }
                );

                if (!cancelled) {
                    setUsernameStatus({
                        loading: false,
                        available: res.data.isAvailable,
                        error: res.data.isAvailable ? "" : "Username not available."
                    });
                }
            } catch (err) {
                if (!cancelled) {
                    setUsernameStatus({
                        loading: false,
                        available: null,
                        error: err?.response?.data?.error || "Failed to check username"
                    });
                }
            }
        }, 2000);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [username]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'profile');

        try {
            setProgressUpload(40);
            setIsLoading(true);
            const result = await axios.post(`${backend_url}/api/upload/image`, formData, {

                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    const precent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgressUpload(precent);
                }
            });
            setProgressUpload(100);
            setIsLoading(false);

            setNewUserDetail(prev => ({ ...prev, image: result.data.imageUrl }));

        }
        catch (err) {
            setProgressUpload(100);
            setIsLoading(false);
            // console.log(err?.response?.data?.error);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));

        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // input validation here

        const password = newUserDetail?.password;
        const confirmPass = newUserDetail?.confirmPass;
        const fakeName = newUserDetail?.fake_name;
        const profileImg = newUserDetail?.image;
        if (!usernameStatus.available) {
            dispatch(setState({ error: "Please choose an available username" }));
            setIsLoading(false);
            return;
        }
        if (password != confirmPass) {
            dispatch(setState({ error: 'Confirmation password did not matched!' }));
            setIsLoading(false);
            return;
        }

        try {
            const result = await axios.post(`${backend_url}/api/setup/my-profile`, { username, password, fakeName, profileImg }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });
            setIsLoading(false);

            dispatch(setState({ userInfo: result?.data?.userInfo, success: 'Profile created.' }));


            navigate('/');
        } catch (err) {
            setIsLoading(false);
            // console.log(err?.response?.data?.error);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
        }
    }
    const handleUserInfoChange = (e) => {
        setNewUserDetail(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    return (
        <>
            <Stack width={'100vw'} height={'100vh'} sx={{ justifyContent: 'center', position: 'relative', alignItems: 'center' }} >
                {(progressUpload > 0 && progressUpload < 100) && <LinearProgress color="info" variant='determinate' sx={{ position: 'absolute', top: 0 }} value={progressUpload}></LinearProgress>}
                <Stack width={'100%'} height={'100%'} overflow={'scroll'} p={2} alignItems={'center'}>
                    <Box width={'100%'} maxWidth={'450px'} mb={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <Typography width={'100%'} zIndex={2} variant="h5" fontSize={32} fontWeight={'bold'} textOverflow={'ellipsis'} noWrap component={'div'}>Welcome {userInfo?.first_name || 'User'}!</Typography>
                        <Typography variant="body2" zIndex={2} component={'span'}>Let's set up your new account</Typography>
                    </Box>

                    <Stack width={'100%'} maxWidth={'450px'} position={'relative'} spacing={1} py={2} alignItems={'start'}>
                        <Typography variant="body2" width={'100%'} color="text.secondary" maxWidth={'450px'} fontSize={12} component={'span'}>Set your profile to get started</Typography>
                        <Box width={{ xs: '130px', sm: '200px' }} zIndex={1} position={'absolute'} right={{ xs: '-18px', sm: '-78px' }} top={{ xs: '-30px', sm: '-75px' }} >
                            <img style={{ width: '100%' }} src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1766064493/d4q87m73brjwu5iotd0v.png" alt="" />
                        </Box>
                        <Box width={'calc(100% - 40px)'} borderRadius={2} sx={{ bgcolor: 'primary.main', zIndex: 20 }} border={'3px solid white'} maxWidth={'450px'}>
                            <form onSubmit={handleSubmit}>
                                <Stack width={'100%'} maxWidth={'450px'} p={1} spacing={2}>

                                    <Typography variant="body1" component={'div'} fontWeight={500} >Create your profile</Typography>
                                    <TextField value={username} autoComplete="lio_username" error={Boolean(usernameStatus.error)} onChange={(e) => setUsername(e.target.value.toLowerCase())} name="username" label="create username" size="small" color="secondary" required helperText={usernameStatus.loading ? "Checking availability..." : usernameStatus.error ? usernameStatus.error : usernameStatus.available ? "Username available" : "Pick a unique username"} placeholder="eg. lio@user.001"></TextField>
                                    <Divider />
                                    <TextField value={newUserDetail?.password} autoComplete="current-password" onChange={handleUserInfoChange} name="password" label="create password" size="small" color="secondary" required
                                        type={showPass.new ? 'text' : 'password'}
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
                                    <TextField value={newUserDetail?.confirmPass} autoComplete="confirm-password" onChange={handleUserInfoChange} name="confirmPass" label="confirm password" size="small" color="secondary" required
                                        type={showPass.confirm ? 'text' : 'password'}
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
                                    <Divider />
                                    <TextField value={newUserDetail?.fake_name} autoComplete="fake-name" onChange={handleUserInfoChange} name="fake_name" label="fake name(optional)" size="small" color="secondary" helperText="We prefer not reveal your identity" ></TextField>
                                    <Divider />
                                    <Box width={'100%'} gap={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body2" fontSize={'15px'} fontWeight={'500'} component={'div'}>
                                            Upload your profile picture(optional)
                                        </Typography>
                                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: '120px', height: '120px' }}>{newUserDetail?.image && <img src={newUserDetail?.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="" />}</Avatar>
                                            <input type="file" name="" ref={profileRef} id="get-profile" onChange={handleImageChange} style={{ display: 'none' }} />

                                            <Button loading={btnLoading} variant="contained" onClick={() => profileRef.current.click()} sx={{ textTransform: 'none' }} color="secondary" size="small" >Upload Image </Button>
                                        </Box>
                                    </Box>
                                    <Divider />
                                    <Button loading={btnLoading || usernameStatus.loading} type="submit" fullWidth color="secondary" sx={{ textTransform: 'none' }} variant="contained">Complete Setup</Button>
                                </Stack>
                            </form>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

export default NewUserSetup;