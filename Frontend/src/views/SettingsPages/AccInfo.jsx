import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
// import EditIcon from '@mui/icons-material/Edit';

function AccInfo() {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);

    return (
        <>

            <Stack width={'100%'} height={"100%"} p={{xs:1,sm:2}}>
                <Stack width={'100%'} height={'100%'} pb={{ xs: '50px', sm: '10px' }} spacing={3} overflow={'scroll'}>

                    <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton onClick={() => navigate('/settings/account')} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" component={'div'} color="text.main" fontWeight={'600'}>
                            Account information
                        </Typography>
                    </Box>


                    <Stack width={'100%'} spacing={2} px={3}>
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Typography variant="body1" fontWeight={'400'}>Name</Typography>

                            <Typography variant="body2" pl={1} color="text.secondary">{userInfo?.name ?? 'not availible'}</Typography>



                        </Box>
                        <Divider />
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Typography variant="body1" fontWeight={'400'}>Email</Typography>
                            <Typography variant="body2" pl={1} color="text.secondary">{userInfo?.email}</Typography>
                        </Box>
                        <Divider />
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Typography variant="body1" fontWeight={'400'}>Username</Typography>
                            <Typography variant="body2" pl={1} color="text.secondary">{userInfo?.username}</Typography>
                            {/* <Box sx={{display:'flex',alignItems:"center",gap:2}} >
                            <Typography variant="body2" pl={1} color="text.secondary">{userInfo?.lio_userid}</Typography>
                                <IconButton  size="small" sx={{m:0}}>
                                    <EditIcon fontSize="small" sx={{color:'#fff'}}/>
                                </IconButton>
                            </Box> */}
                        </Box>
                        <Divider />
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Typography variant="body1" fontWeight={'400'}>Date of birth</Typography>
                            <Typography variant="body2" pl={1} color="text.secondary">{userInfo?.dob ?? 'not availible'}</Typography>
                        </Box>
                        <Divider />
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Typography variant="body1" fontWeight={'400'}>Account created</Typography>
                            <Typography variant="body2" pl={1} color="text.secondary">{userInfo?.created_at ?? 'not availible'}</Typography>
                        </Box>
                        <Divider />
                    </Stack>

                </Stack>
            </Stack>


        </>
    )
}

export default AccInfo;
