import { Box, Divider, Stack, Typography, IconButton, Skeleton } from "@mui/material";
import { emojis } from "../utils/emoji";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";
import { formatDate } from "../utils/formatDateTime";

function PersonalDiary() {

    const [isLoading, setIsLoading] = useState(true);
    const [notesList, setNotesList] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        getMyDiary();
        const el = scrollRef.current;

        if (!el) {
            return;
        }
        el.addEventListener('scroll', handleScroll)

        return () => {
            el.removeEventListener('scroll', handleScroll);
        }
    }, [])

    const getMyDiary = async () => {
        setIsLoading(true);
        try {
            const lastNoteId = notesList.length > 0 ? notesList[notesList.length - 1].id : null;
            const url = lastNoteId ?
                `${backend_url}/diary/get-my-diary?limit=${10}&&last_note_id=${lastNoteId}` :
                `${backend_url}/diary/get-my-diary?limit=${10}`
            const result = await axios.get(
                url,
                {
                    withCredentials: true,
                }
            )
            if (result.data.notesList.length < 10) {
                setHasMore(false);
            }
            setNotesList(prev => ([...prev, ...result.data.notesList]));
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
            dispatch(setState({ error: err.response?.data?.message || 'Something went wrong!' }));
        }
    }

    const handleScroll = () => {
        if (!hasMore || isLoading) {
            return;
        }
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        if (el.clientHeight + el.scrollTop >= el.scrollHeight - 10) {
            getMyDiary();
        }
    }

    const getEmoji = (key) => {
        const emoji = emojis.find(e => e.key === key);
        return emoji ? emoji.value : '';
    }
    return (
        <>
            <Stack width={'100%'}
                height={{ sm: '100%', xs: 'calc(100% - 110px)' }}
                py={1}
                position={'relative'}>


                <Stack width={'100%'}
                    height={'100%'}

                    overflow={'scroll'}

                    ref={scrollRef}
                >
                    <IconButton onClick={() => navigate('/personal-diary/new')}
                        size="large"
                        title="New chat"
                        sx={{
                            bgcolor: 'secondary.main',
                            position: 'absolute',
                            zIndex: 99,
                            bottom: '15px',
                            right: '15px',
                            '&:hover': {
                                bgcolor: 'secondary.dark',
                                color: 'text.secondary'
                            }
                        }}>
                        <AddIcon />
                    </IconButton>
                    <Stack width={'100%'}
                        direction={'column'}
                        spacing={{ xs: 1, sm: 2 }}>
                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: "column", gap: '4px' }} p={1}  >
                            <Typography variant="h6" fontSize={{ xs: '24px', sm: '28px' }} color="#fff">
                                Personal Diary
                            </Typography>
                            <Typography variant="body2" fontSize={{ xs: '10px', sm: '14px' }} color="text.secondary">
                                Talk with your diary, share your thoughts, feelings, and experiences in your personal space.

                            </Typography>

                        </Box>
                        <Divider />
                        <Stack direction={'column'} width={'100%'} spacing={1} p={{ xs: 1, sm: 2 }}>

                            {
                                notesList.map((n) =>
                                    <Box width={'100%'} key={n.id}
                                        onClick={() => navigate(`/personal-diary/note/${n.id}`, {
                                            state: {
                                                noteData: n
                                            }
                                        })}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '5px',
                                            borderRadius: 3,
                                            p: { xs: 1, sm: 2 },
                                            bgcolor: 'divider',
                                            border: '2px solid #fff',
                                            '&:hover': {
                                                bgcolor: '#322d4b80',
                                                borderColor:'#322d4b'

                                            },
                                            cursor: 'pointer',


                                        }}>
                                        <Box width={'calc(100% - 65px)'} sx={{ display: 'flex', flexDirection: "column", gap: '4px' }}  >
                                            <Box width={'100%'}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                <Typography variant="body1"
                                                    fontSize={{ xs: '16px', sm: '20px' }} color="#fff"
                                                    fontWeight={'bold'} width={'100%'}
                                                    noWrap textOverflow={'ellipsis'} >
                                                    {formatDate(n.creation_date)}
                                                </Typography>

                                            </Box>
                                            <Box width={'100%'} >
                                                <Typography variant="body2"
                                                    fontSize={{ xs: '12px', sm: '15px' }}
                                                    color="text.primary"
                                                    width={'100%'}
                                                    textAlign={'start'}
                                                    noWrap textOverflow={'ellipsis'} >
                                                    {n.title}
                                                </Typography>

                                            </Box>
                                            <Box width={'100%'} >
                                                <Typography variant="body2"
                                                    fontSize={{ xs: '10px', sm: '13px' }}
                                                    color="text.secondary"
                                                    width={'100%'}
                                                    textAlign={'start'}
                                                    noWrap textOverflow={'ellipsis'} >
                                                    {n.content}
                                                </Typography>

                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            width: '50px',
                                        }}>
                                            <img src={getEmoji(n.emoji_key)} alt=""
                                                style={{
                                                    width: '100%',
                                                    objectFit: 'contain'
                                                }} />
                                        </Box>
                                    </Box>
                                )
                            }

                            {
                                isLoading && [1, 2, 3].map((i) =>
                                    <Box key={`note-skeleton-${i}`} width={'100%'} height={{ xs: '60px', sm: '80px' }}>
                                        <Skeleton variant="rounded"
                                            animation='wave'
                                            width={'100%'}
                                            height={'100%'}
                                            sx={{
                                                borderRadius: 3
                                            }} />

                                    </Box>
                                )
                            }
                            {
                                !isLoading && notesList?.length == 0 &&
                                <Box width={'100%'}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        pt: 2,


                                    }}>
                                    <Box width={{ xs: '120px', sm: '200px' }}>
                                        <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1771324805/akguodlvbcxd9m9byllq.png"
                                            alt=""
                                            style={{
                                                width: '100%',
                                                objectFit: 'contain',

                                            }} />
                                    </Box>

                                    <Typography variant="body2" pt={1}
                                        color="text.primary" textAlign={'center'}
                                        fontSize={{ xs: '15px', sm: '18px' }}
                                    >
                                        Your personal diary is empty
                                    </Typography>
                                    <Typography variant="body2" fontSize={{ xs: '10px', sm: '14px' }} color="text.secondary" textAlign={'center'} >
                                        Start writing your thoughts and feelings, and they will appear here.
                                    </Typography>
                                </Box>
                            }

                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

        </>
    );
}

export default PersonalDiary;