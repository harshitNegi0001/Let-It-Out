import { Avatar, Box, Button, Divider, IconButton, InputBase, Skeleton, Stack, Typography } from "@mui/material";
import SearchButtonIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useRef, useState } from "react";
import { setState } from "../../store/authReducer/authReducer";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function NewChat() {

    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [idle, setIdle] = useState(true);
    const [connectedUsers, setConnectedUsers] = useState([]);

    const searchRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        getConnections();
    }, [])

    const getConnections = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/msg/get-connected-users`,
                { withCredentials: true }
            )
            setConnectedUsers(result?.data?.connectedUsers);
            setIsLoading(false);

        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong." }));
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            return;
        }
        try {
            setIdle(false);
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/api/search-user?query=${searchValue}`,
                { withCredentials: true }
            )
            setSearchResults(result?.data?.searchResults);
            setIsLoading(false);

        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong." }));
        }
        // navigate(`/search/${searchValue}`);
    }
    return (
        <>
            <Stack width={'100%'} height={'100%'} spacing={2} overflow={'scroll'} p={{ xs: 1, sm: 2 }} pb={{ xs: '60px', sm: '10px' }}>
                <Box width={'100%'}  >
                    <form onSubmit={handleSearch} style={{ width: '100%' }}>
                        <Box width={'100%'} p={1} height={'45px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 1 }} bgcolor={'primary.light'}>


                            <InputBase inputRef={searchRef} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} variant='outlined' size="small" sx={{ width: 'calc(100% - 100px)' }} placeholder="Search user..." autoComplete="Search-users" />
                            <Divider orientation='vertical' />
                            <IconButton type='submit' size="small">
                                <SearchButtonIcon />
                            </IconButton>
                        </Box>
                    </form>
                </Box>
                <Divider sx={{ width: '100%' }} />

                {
                    isLoading ?
                        [1, 2, 3, 4, 5].map((i) =>
                            <Box width={'97%'} key={i} p={1} sx={{ display: 'flex', gap: 1 }}>
                                <Box width={'50px'} height={'50px'}>
                                    <Skeleton variant='circular' width={'100%'} animation="wave" height={'100%'} />
                                </Box>
                                <Box width={'calc(100% - 120px)'} maxWidth={'450px'} sx={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                    <Skeleton width={'100%'} animation="wave" height={'24px'} />
                                    <Skeleton width={'80%'} animation="wave" height={'15px'} />

                                </Box>

                            </Box>)
                        :
                        <>
                            {
                                searchResults.length > 0 ?

                                    <>
                                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                                            <Typography width={'100%'} textAlign={'start'} variant="body1" color="#fff" fontSize={{ xs: '20px', sm: '26px' }} fontWeight={'400'}>
                                               Search Results
                                            </Typography>
                                            {/* <Typography width={'100%'} textAlign={'start'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                                { `Showing results for : "${searchValue}"`}

                                            </Typography> */}
                                            <Typography width={'100%'} textAlign={'start'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                                { `About ${searchResults?.length} results found`}

                                            </Typography>

                                        </Box>
                                        {
                                            searchResults.map((u) =>
                                                <Box width={'100%'} onClick={() => navigate(`/chats/${u.username}`)} key={`searchChat-${u.id}`} p={1} sx={{ display: 'flex', borderRadius: 2, alignItems: "center", gap: 1, '&:hover': { bgcolor: '#63607057', cursor: "pointer" }, '&:active:not(:has(button:active))': { transform: 'scale(0.96)', transition: "all 100ms" } }}>
                                                    <Avatar src={u.image} width={'50px'} height={'50px'}>

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

                                                </Box>)
                                        }
                                    </> :
                                    (!searchValue) ?
                                        <>
                                            {
                                                connectedUsers.length == 0 ?
                                                    <>
                                                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} p={1} >
                                                            <Box width={'100%'} maxWidth={{ xs: '280px', sm: '350px' }}>
                                                                <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768990892/pahraxrxhocdy6zn5aqd.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                                                            </Box>
                                                            <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                <Typography width={'100%'} textAlign={'center'} variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                                                                    Your space is quite right now
                                                                </Typography>
                                                                <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                                                    Follow or be followed to start chating with others.
                                                                </Typography>
                                                            </Box>
                                                            <Divider>
                                                                <Typography variant="body2" color="text.secondary" fontSize={'12px'}>
                                                                    Or
                                                                </Typography>
                                                            </Divider>
                                                            <Box width={'100%'} maxWidth={{ xs: '280px', sm: '350px' }}>
                                                                <Button fullWidth color="secondary" sx={{ borderRadius: 4, textTransform: 'none' }} onClick={() => searchRef.current.focus()} endIcon={<SearchButtonIcon />} variant="contained" >
                                                                    Find Connections
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </> :
                                                    <>
                                                        <Typography>
                                                            Connected users
                                                        </Typography>
                                                        {connectedUsers.map(u =>
                                                            <Box width={'100%'} onClick={() => navigate(`/chats/${u.username}`)} key={`connection-${u.id}`} p={1} sx={{ display: 'flex', borderRadius: 2, alignItems: "center", gap: 1, '&:hover': { bgcolor: '#63607057', cursor: "pointer" }, '&:active:not(:has(button:active))': { transform: 'scale(0.96)', transition: "all 100ms" } }}>
                                                                <Avatar src={u.image} width={'50px'} height={'50px'}>

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
                                                        )}
                                                    </>
                                            }
                                        </>
                                        :

                                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center', gap: 1 }}>
                                            <Box width={'100%'} maxWidth={{ xs: '280px', sm: '380px' }}>
                                                <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768049071/sjdkhrwrnttukqirggxb.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                                            </Box>
                                            <Typography variant="body2" width={'100%'} fontSize={{ xs: '12px', sm: '16px' }} textAlign={'center'} color="text.secondary" >
                                                {!idle ? "No new users found." : 'Start searching to find users'}
                                            </Typography>
                                        </Box>

                            }

                        </>
                }

            </Stack>
        </>
    )
}

export default NewChat;