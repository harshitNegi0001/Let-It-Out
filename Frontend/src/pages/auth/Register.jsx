import appLogo from '../../assets/letitout_logo.png';
import { Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Register(){

    return (
        
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} height={'100vh'} width={'100vw'}>
                    <Stack justifyContent={'center'} alignContent={'center'} width={290} p={'20px'} spacing={2} border={'2px solid #F3ECFF'} bgcolor={'#ffffff15'} sx={{ borderRadius: 2 }}>
                        <Stack width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                            <img src={appLogo} style={{ width: '55px', objectFit: 'contain' }} alt="" />
                            <Typography variant='h5' color='text.primary' component={'span'} textAlign={'center'} sx={{fontWeight:'bold'}}>
        
                                Sign up
                            </Typography>
                        </Stack>
                        <Typography variant='body2' color='text.secondary' textAlign={'center'} component={'span'} >
                            Welcome user, Please sign in to continue.
                        </Typography>
                        <Stack spacing={1} >
                            <TextField label='Full Name' size='small' />
                            <TextField label='Email' size='small' />
                            
                            {/* <TextField label='Password' size='small' />
                            <TextField label='Re-type password' size='small' /> */}
                            <Button variant='contained' sx={{ textTransform: 'none' }}>Create account</Button>
                        </Stack>
                        <Divider />
                        <Button fullWidth variant='outlined' sx={{color:'secondary.light',borderColor:'secondary.light',textTransform:'none'}} startIcon={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>}>
                            Sign in with Google
                        </Button>
                        
                        <Divider><Typography variant='body2' color='text.secondary' component={'span'}>or</Typography></Divider>
                        <Typography variant='body2' sx={{ '&:hover': { cursor: 'pointer' } }} textAlign={'center'} ><Link to='/login' style={{color:'#C1B5DD'}}>I have an account</Link></Typography>
                    </Stack>
                </Stack>
        
    )
}

export default Register;