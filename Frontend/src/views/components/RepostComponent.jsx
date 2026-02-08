import { Avatar, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import CloseButton from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { timeCount } from "../../utils/formatDateTime";
import { moods } from "../../utils/moods";
import ImageGrid from "./ImageGrid";
import { useEffect } from "react";
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";


function RepostComponent({ closeRepost, postData, userData }) {
    const { userInfo } = useSelector(state => state.auth);
    const [text, setText] = useState('');
    const [mood, setMood] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;


    const submitPost = async () => {
        try {
            setIsLoading(true);
            const content = text.trim();
            const result = await axios.post(
                `${backend_url}/api/repost-post`,
                {
                    parent_id: postData?.id,
                    content: content,
                    mood: mood
                },
                {
                    withCredentials: true
                }
            );

            setIsLoading(false);
            closeRepostComponent();
        } catch (err) {
            dispatch(setState({ error: err?.response?.data?.error || 'Something Went Wrong!' }));
            console.log(err);
            setIsLoading(false);
        }
    }

    const closeRepostComponent = () => {
        setText("");
        setMood('');
        closeRepost();
    }

    return (
        <>
            <Box width={'100%'}
                onClick={(e) => e.stopPropagation()}
                borderRadius={3}
                maxHeight={'90vh'}
                maxWidth={{ xs: '320px', sm: '550px' }}
                p={2}

                bgcolor="primary.dark"
                sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontSize={{ xs: '14px', sm: '18px' }} fontWeight={'bold'}>
                        Repost
                    </Typography>
                    <IconButton size="small" onClick={closeRepostComponent} >
                        <CloseButton sx={{ fontSize: { xs: '18px', sm: '25px' }, color: '#fff' }} />
                    </IconButton>
                </Box>

                <Box width={'100%'}
                    height={'90%'}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    overflow={'scroll'}>



                    <Stack direction="row" spacing={1}>
                        <Avatar src={userInfo?.image} />
                        <TextField
                            multiline
                            minRows={1}
                            maxRows={3}
                            variant="standard"
                            placeholder="What you think about it?"
                            fullWidth
                            value={text}
                            error={text.length > 3000}
                            helperText={`${text.length}/3000 `}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 3000
                                }
                            }}
                            onChange={(e) => setText(e.target.value)}
                            sx={{
                                '& input': {
                                    fontSize: { xs: '14px', sm: '18px' }
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: { xs: '8px', sm: '10px' },
                                    lineHeight: 1,
                                    marginTop: '4px',
                                    textAlign: 'end'
                                }
                            }}
                        />
                    </Stack>
                    <Box width={'100%'}
                        height={'fit-content'}
                        sx={{ display: 'flex', borderRadius: 3, border: 1, borderColor: 'divider', flexDirection: 'column', bgcolor: 'primary.main' }}>
                        <Stack direction={'row'} width={'100%'} boxSizing={'border-box'} p={1} justifyContent={'space-between'} borderRadius={3} bgcolor={'primary.dark'} alignItems={'center'}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'} width={'calc(100% - 40px)'}>
                                <Box width={{ xs: '30px', sm: '45px' }} height={{ xs: '30px', sm: '45px' }} overflow={'hidden'} borderRadius={'30px'} >
                                    <Avatar sx={{ width: '100%', height: "100%", bgcolor: '#c2c2c2' }} src={userData?.image} />
                                </Box>

                                <Stack spacing={0} >
                                    <Typography variant="body2" component={'span'} fontWeight={'bold'} fontSize={{ xs: 12, sm: 16 }} textOverflow={'ellipsis'} noWrap color="text.primary">{userData?.fake_name || userData?.name}</Typography>

                                    {postData?.created_at && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                                        {timeCount(postData?.created_at)}
                                    </Typography>}


                                    {postData?.mood_tag && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                                        feeling {moods.find(m => m.value == postData?.mood_tag).label}
                                    </Typography>}
                                </Stack>

                            </Stack>
                        </Stack>
                        <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }}>

                            {postData.content && <Typography mb={2}
                                sx={{
                                    whiteSpace: 'pre-wrap', display: '-webkit-box',
                                    WebkitLineClamp: 10,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }} fontSize={{ xs: 12, sm: 16 }}>
                                {postData.content}
                            </Typography>}
                            {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} />}

                        </Box>
                    </Box>
                </Box>
                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box width={'140px'}>
                        <FormControl fullWidth>
                            <InputLabel size="small" color="secondary" id="mood-select-label" >Mood</InputLabel>
                            <Select size="small" color='secondary' MenuProps={{ disablePortal: true }} value={mood} onChange={(e) => setMood(e.target.value)} labelId="mood-select-label" id="mood-select" label="mood">
                                {moods?.map((m) => <MenuItem key={m.id} value={m.value}>{m.label}</MenuItem>)}

                            </Select>
                        </FormControl>
                    </Box>
                    <Button loading={isLoading} variant="contained" sx={{ borderRadius: '20px', width: '80px' }} color="secondary" onClick={submitPost}>
                        Post
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default RepostComponent;