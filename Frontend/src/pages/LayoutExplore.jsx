import { Avatar, Box, Button, Divider, IconButton, InputBase, Skeleton, Stack, TextField, Typography } from "@mui/material";
import SearchButtonIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



function LayoutExplore() {

    const [isLoading, setIsLoading] = useState(false);
    const [newUsersList, setNewUsersList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getNewUsers();
    }, [])

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchValue) {
            return;
        }
        navigate(`/search/${searchValue}`);
    }
    const getNewUsers = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/api/get-new-users`,
                {
                    withCredentials: true
                }
            );
            setIsLoading(false);
            setNewUsersList(result?.data?.usersList);

        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
        }
    }

    return (

        <>
            <Stack direction={'column'} width={'100%'} spacing={2} p={2}>
                <Box width={'100%'} >
                    <Typography variant='body1' color="text.primary" component={'div'}>Search People</Typography>
                </Box>
                <Stack direction={'column'} width={'100%'} spacing={2}>


                    <form onSubmit={handleSearch} >
                        <Box width={'100%'} p={1} height={'45px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderRadius: 1 }} bgcolor={'primary.light'}>


                            <InputBase value={searchValue} onChange={(e) => setSearchValue(e.target.value)} variant='outlined' size="small" sx={{ width: '250px' }} placeholder="Search user..." />
                            <Divider orientation='vertical' />
                            <IconButton type='submit' size="small">
                                <SearchButtonIcon />
                            </IconButton>
                        </Box>
                    </form>

                </Stack>
                <Divider />
                <Box width={'100%'} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                    <Typography variant='body1' fontSize={'18px'} color="text.primary" component={'div'}>New Joiners</Typography>
                    {isLoading ? <Stack spacing={1} width={'100%'} alignItems={'center'}>
                        {
                            [1, 2, 3, 4, 5].map(i =>
                                <Box width={'97%'} key={i} p={1} sx={{ display: 'flex', gap: 1 }}>
                                    <Box width={'50px'} height={'50px'}>
                                        <Skeleton variant='circular' width={'100%'} height={'100%'} />
                                    </Box>
                                    <Box width={'calc(100% - 120px)'} sx={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                        <Skeleton width={'100%'} height={'24px'} />
                                        <Skeleton width={'80%'} height={'15px'} />

                                    </Box>
                                    <Box width={'50px'} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Skeleton variant="rounded" width={'100%'} />

                                    </Box>
                                </Box>

                            )
                        }
                    </Stack> : <Stack spacing={1} width={'100%'} alignItems={'center'}>
                        {
                            (newUsersList?.length == 0) ? <Box width={'100%'} height={'250px'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center', gap: 1 }}>
                                <Box width={'120px'}>
                                    <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768049071/sjdkhrwrnttukqirggxb.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                                </Box>
                                <Typography variant="body2" width={'100%'} textAlign={'center'} color="text.secondary" >
                                    No new users found.
                                </Typography>
                            </Box> : null

                        }
                        {
                            newUsersList?.map(u =>
                                <Box width={'100%'} onClick={() => navigate(`/profile/${u.username}`)} key={`newUser-${u.id}`} p={1} sx={{ display: 'flex', borderRadius: 2, alignItems: "center", gap: 1, '&:hover': { bgcolor: '#63607057', cursor: "pointer" }, '&:active:not(:has(button:active))': { transform: 'scale(0.96)', transition: "all 100ms" } }}>
                                    <Avatar width={'50px'} height={'50px'}>
                                        {u.image && <img src={u.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                                    </Avatar>
                                    <Box width={'calc(100% - 120px)'} sx={{ display: 'flex', flexDirection: "column", alignItems: "start", justifyContent: 'center' }}>
                                        <Typography width={'100%'} variant="body1" noWrap color="#fff" textOverflow={'ellipsis'} >
                                            {u.fake_name || u.name}
                                        </Typography>
                                        <Typography width={'100%'} variant="body2" color="text.secondary" noWrap textOverflow={'ellipsis'}>
                                            @{u.username}
                                        </Typography>
                                    </Box>
                                    <Box width={'50px'} sx={{ display: 'flex', alignItems: 'center' }}>

                                    </Box>

                                </Box>

                            )
                        }

                    </Stack>}
                    <Divider />


                </Box>
                <Box width={'100%'} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                    <Box width={'100%'}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                        <Typography variant='body1' fontSize={'18px'} color="text.primary" component={'div'}>Your diary</Typography>
                        <Button size="small"
                        endIcon={<ChevronRightIcon sx={{fontSize:'16px'}} />}
                         variant="text" color="secondary" onClick={() => navigate('/personal-diary')}>
                            View
                            </Button>
                    </Box>
                    <Stack direction={'column'} width={'100%'} spacing={1}>
                        <Box width={'100%'}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                pt: 2,


                            }}>
                            <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1771324805/akguodlvbcxd9m9byllq.png"
                                alt=""
                                style={{
                                    width: '30%',
                                    objectFit: 'contain',

                                }} />
                            <Typography variant="body2" pt={1}
                                color="text.primary" textAlign={'center'} >
                                Your personal diary is empty
                            </Typography>
                            <Typography variant="body2" fontSize={'12px'} color="text.secondary" textAlign={'center'} >
                                Start writing your thoughts and feelings, and they will appear here.
                            </Typography>
                        </Box>

                    </Stack>
                </Box>
            </Stack>
        </>
    )
}

export default LayoutExplore;