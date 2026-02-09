import { Box, Button, Chip, Divider, IconButton, InputBase, Stack, Typography } from "@mui/material";
import SearchButtonIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { moods } from "../utils/moods";
import ExploreFeed from "./components/ExploreFeed";
import { useDispatch } from 'react-redux';
import { setState } from "../store/authReducer/authReducer.js";
import axios from "axios";



function Explore() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [selectedMood, setSelectedMood] = useState([]);
    const [showAllMoods, setShowAllMoods] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postslist, setPostslist] = useState([]);
    const [hasmore, setHasmore] = useState(true);

    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (isLoading) {
            return;
        }
        const el = scrollRef.current;
        if (!el) {
            return;
        }
        el.addEventListener('scroll', handleScroll);

        return () => {
            el.removeEventListener('scroll', handleScroll);
        }
    }, [isLoading]);
    useEffect(() => {
        setHasmore(true);
        if (selectedMood.length > 0) {
            const reqMood = selectedMood.map(m => m.value);
            getPosts(reqMood);
        }


        return (() => {
            setPostslist([])
        })
    }, [selectedMood]);

    const handleScroll = () => {
        if (!hasmore) {
            return;
        }

        if (isLoading) {
            return;
        }
        const el = scrollRef.current;

        if (el.scrollTop + el.clientHeight + 1 >= el.scrollHeight) {
            const reqMood = selectedMood.map(m => m.value);
            getPosts(reqMood);
        }
    }
    const getPosts = async (reqMood) => {
        if (!reqMood || reqMood?.length == 0) {
            return;
        }
        setIsLoading(true);
        try {
            const lastFeedId = postslist.length == 0 ? null : postslist[postslist.length - 1]?.post_data.id;
            const url = (lastFeedId) ?
                `${backend_url}/api/get-posts?limit=${20}&&reqMood=${reqMood}&&lastFeedId=${lastFeedId}` :
                `${backend_url}/api/get-posts?limit=${20}&&reqMood=${reqMood}`
            const result = await axios.get(
                url,
                { withCredentials: true }
            );
            if (result?.data?.postsList?.length < 20) {
                setHasmore(false);
            }
            setPostslist(prev => ([...prev, ...result?.data?.postsList]));
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Interal Server Error!" }));
            // console.log(err);
        }
    }

    const MOODS_PER_ROW = window.innerWidth < 600 ? 4 : window.innerWidth <= 1024 ? 5 : 7;
    const sortedMood = [

        ...moods.filter(m => !selectedMood.some(sm => sm.id === m.id))
    ]
    const visibleSortedMoods = showAllMoods
        ? sortedMood
        : sortedMood.slice(0, MOODS_PER_ROW);
    const addMood = (mood) => {
        const already = selectedMood.find(m => m.id == mood.id);
        if (!already) {
            setSelectedMood(prev => ([...prev, mood]));
        }

    }

    const removeMood = (mood) => {

        setSelectedMood(prev => ([...prev.filter(m => m.id != mood.id)]));

    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchValue) {
            return;
        }
        navigate(`/search/${searchValue}`);
    }

    return (
        <>
            <Stack width={'100%'} height={'100%'} ref={scrollRef} spacing={2} alignItems={'center'} overflow={'scroll'} p={{ xs: 1, sm: 2, lg: 3 }} pb={{ xs: '70px', sm: 1 }}>
                <Box width={'100%'}  >
                    <form onSubmit={handleSearch} style={{ width: '100%' }}>
                        <Box width={'100%'} p={1} height={'45px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 1 }} bgcolor={'primary.light'}>


                            <InputBase value={searchValue} onChange={(e) => setSearchValue(e.target.value)} variant='outlined' size="small" sx={{ width: 'calc(100% - 100px)' }} placeholder="Search user..." />
                            <Divider orientation='vertical' />
                            <IconButton type='submit' size="small">
                                <SearchButtonIcon />
                            </IconButton>
                        </Box>
                    </form>
                </Box>
                <Box width={'100%'} borderRadius={3} sx={{ backgroundImage: 'url("https://res.cloudinary.com/dns5lxuvy/image/upload/v1768449323/l1maqmtjegucx0babyng.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                    <Box width={'100%'} p={{ xs: 2, sm: 3 }} borderRadius={3} sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#0a032e86' }}>
                        <Typography variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                            You're not alone.
                        </Typography>
                        <Typography variant="body2" color="#fff" fontSize={{ xs: '12px', sm: '16px' }} fontWeight={'300'}>
                            Explore thoughts, feelings and find confort.
                        </Typography>
                    </Box>

                </Box>
                <Stack width={'100%'} spacing={2} >
                    <Box width={'100%'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Typography variant="body1" fontSize={{ xs: '15px', sm: '20px' }} color="#fff">People are feeling ...</Typography>
                        <Button variant="text" color="secondary" onClick={() => setShowAllMoods(prev => !prev)} sx={{ fontSize: { xs: '11px', sm: '14px' } }}>
                            {showAllMoods ? '< See less' : 'See more >'}
                        </Button>
                    </Box>
                    <Box width={'100%'} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedMood?.map((m) => {

                            return (
                                <Chip key={m.id} variant={"filled"}
                                    onDelete={() => removeMood(m)}
                                    color={"secondary"} label={m.label}
                                />
                            )
                        })}
                        {visibleSortedMoods?.map((m) => {

                            return (
                                <Chip key={m.id} variant={'outlined'}
                                    onClick={() => addMood(m)}
                                    color={'default'} label={m.label}
                                />
                            )
                        })}

                    </Box>
                    <Divider />
                </Stack>
                <Stack width={'100%'} pt={2}>
                    <ExploreFeed moods={selectedMood} postslist={postslist} isLoading={isLoading} />
                    {
                        postslist.length != 0 && hasmore &&
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary" component={'span'} fontSize={{ xs: '10px', sm: '13px' }}>
                                ( ︶︵︶ ) No more posts ( ︶︵︶ )
                            </Typography>
                        </Box>
                    }
                </Stack>


            </Stack>
        </>
    )
}
export default Explore;