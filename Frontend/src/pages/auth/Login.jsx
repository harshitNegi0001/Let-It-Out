import appLogo from '../../assets/letitout_logo.png';
import {  Button, Divider, Slide, Stack, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authReducer/authReducer';
import { setState } from '../../store/authReducer/authReducer';
function Login() {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const [state, setLoginState] = useState({
        email: '',
        password: '',
    });
    const [loadingBtn, setloadingBtn] = useState('')
    const navigate = useNavigate();
    const handleStateChange = (e) => {
        setLoginState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = state.email;
        const password = state.password;
        const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!checkEmail.test(email)){
            
            dispatch(setState({error:'Invalid Email Address'}));
        }

        try {
            setloadingBtn('loginBtn');
            const result = await axios.post(`${backend_url}/api/login`, { email, password }, { withCredentials: true });
            setloadingBtn('');
            dispatch(setState({success: result.data.message}));
            dispatch(login({ userInfo: result.data.userInfo }));
            navigate('/');

        }
        catch (err) {
            setloadingBtn('');
            // console.log(err.response.data.error);
            dispatch(setState({error: err?.response?.data?.error}));

            return;
        }
    }
    
    const handleGoogleLogin = () => {
        setloadingBtn('googleBtn');
        window.location.href = `${backend_url}/api/google-login`;
    }


    return (
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} height={'100vh'} width={'100vw'}>
            <Stack justifyContent={'center'} alignContent={'center'} width={290} p={'20px'} spacing={2} border={'2px solid #F3ECFF'} bgcolor={'#ffffff15'} sx={{ borderRadius: 2 }}>
                <Stack width={'100%'} direction={'column'} alignItems={'center'} justifyContent={'center'} spacing={1}>
                    <img src={appLogo} style={{ width: '55px', objectFit: 'contain' }} alt="" />
                    <Typography variant='h5' color='text.primary' fontSize={30} component={'span'} textAlign={'center'} sx={{ fontWeight: 'bold' }}>

                        Log in
                    </Typography>
                </Stack>
                <Typography variant='body2' color='text.secondary' fontSize={12} textAlign={'center'} component={'span'} >
                    Welcome user, Please log in to continue.
                </Typography>
                <form onSubmit={handleLogin}>
                    <Stack spacing={1} pt={2}>
                        <TextField label='Email' color='secondary' value={state.email} onChange={handleStateChange} required size='small' name='email' autoComplete="username" type='email' />
                        <TextField label='Password' autoComplete="current-password" value={state.password} onChange={handleStateChange} name='password' type='password' required color='secondary' size='small' />
                        <Button loading={loadingBtn == 'loginBtn'} variant='contained' type='submit' sx={{ textTransform: 'none' }}>Login</Button>
                    </Stack>
                </form>
                <Divider><Typography variant='body2' color='text.secondary' component={'span'}>or</Typography></Divider>
                <Button loading={loadingBtn == 'googleBtn'} fullWidth onClick={handleGoogleLogin} variant='outlined' sx={{ color: 'secondary.light', borderColor: 'secondary.light', textTransform: 'none' }} startIcon={loadingBtn == 'googleBtn' ? null : <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>}>

                    Log in with Google
                </Button>
                {/* <Snackbar open={state.snackbarOpen} anchorOrigin={{ horizontal: 'center', vertical: 'top' }} slots={{ transition: Slide }} slotProps={{ transition: { direction: 'down', onExited: () => { setState(prev => ({ ...prev, error: '', success: '' })) } } }} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                    <Alert severity={Boolean(state.success) ? 'success' : 'error'}>{state.success || state.error}</Alert>
                </Snackbar> */}


                {/* <Typography variant='body2' sx={{ '&:hover': { cursor: 'pointer' } }} textAlign={'center'} ><Link to='/register' style={{ color: '#C1B5DD' }}>create a new account</Link></Typography> */}
            </Stack>
        </Stack>
    )
}

export default Login;