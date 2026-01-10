import { Avatar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import OptionIcon from '@mui/icons-material/MoreVert';
import LikeEmptyButton from '@mui/icons-material/FavoriteBorder';
import LikeFilledButton from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentsIcon from '@mui/icons-material/Forum';
import RepostIcon from '@mui/icons-material/Repeat';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import getPostActions from "../../utils/postActions";
import ImageGrid from "./ImageGrid";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { requiredAction } from "../../store/authReducer/authReducer";






function PostUI({ followed, liked = false, bookmarked = false, postData, userData }) {

    const { userInfo } = useSelector(state => state.auth);
    const [isLiked, setIsLiked] = useState(liked);
    const [isSaved, setIsSaved] = useState(bookmarked);
    const [anchorEl, setAnchorEl] = useState(null);
    const [postAction, setPostAction] = useState([]);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData?.id && userInfo?.id) {
            setPostAction([...getPostActions(userData.id, userInfo.id, postData.id)]);
        }
    }, [userData]);


    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleBookmark = () => {
        setIsSaved(prev => !prev);
        handleClose();
    }
    return (

        <>


            <Stack width={'100%'} borderRadius={2} overflow={'hidden'} border={1} borderColor={'primary.dark'}>
                <Stack direction={'row'} width={'100%'} boxSizing={'border-box'} p={1} justifyContent={'space-between'} bgcolor={'primary.dark'} alignItems={'center'}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'} width={'calc(100% - 40px)'}>
                        <Box width={{ xs: '40px', sm: '55px' }} height={{ xs: '40px', sm: '55px' }} overflow={'hidden'} borderRadius={'30px'} >
                            <Avatar sx={{ width: '100%', height: "100%", bgcolor: '#c2c2c2' }}>
                                {userData?.image && <img src={userData?.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                            </Avatar>
                        </Box>

                        <Stack spacing={0}><Typography variant="body2" component={'span'} fontWeight={'bold'} fontSize={{ xs: 12, sm: 16 }} textOverflow={'ellipsis'} noWrap color="text.primary">{userData?.fake_name || userData?.name}</Typography>
                            {
                                !followed && <Button variant='text' endIcon={<AddIcon />} color="secondary" size="small" sx={{ width: '85px', mx: 2 }}>Follow</Button>
                            }</Stack>

                    </Stack>
                    <IconButton onClick={handleClick} size="large" id="post-options-btn" aria-haspopup='true' aria-expanded={open ? 'true' : undefined} aria-controls={open ? 'post-option-menu' : undefined}><OptionIcon /></IconButton>
                </Stack>
                <Menu id="post-option-menu" anchorEl={anchorEl} open={open} slotProps={{ list: { 'aria-labelledby': 'post-options-btn' } }} onClose={handleClose}>
                    {postAction.map((o, i) => <MenuItem key={i} onClick={() => { handleClose(); dispatch(requiredAction({ label: o.label, type: o.type, payload: o.payload})) }}>
                        <ListItemIcon>
                            {o.icon}
                        </ListItemIcon>
                        <ListItemText>{o.content}</ListItemText>
                    </MenuItem>)}

                    <MenuItem onClick={handleBookmark}>
                        <ListItemIcon>
                            {
                                isSaved ? <BookmarkIcon fontSize="small" color="secondary" /> : <BookmarkBorderIcon fontSize="small" />
                            }

                        </ListItemIcon>
                        <ListItemText>{isSaved ? 'Remove boookmark' : 'Bookmark'}</ListItemText>
                    </MenuItem>
                </Menu>
                <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }}>

                    <Typography mb={2} fontSize={{ xs: 12, sm: 16 }}>
                        {postData.content}
                    </Typography>
                    {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} />}

                </Box>
                <Stack direction={'row'} justifyContent={'space-evenly'} borderTop={1} mx={1} borderColor={'divider'}>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} >
                        <IconButton onClick={() => setIsLiked(prev => !prev)} title="Likes">
                            {
                                isLiked ? <LikeFilledButton color="secondary" /> : <LikeEmptyButton />
                            }

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{postData.likes_count}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton title="comments">
                            <CommentsIcon />

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{postData.comments_count}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton title="shares">
                            <ShareIcon />

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{postData.shares_count}</Typography>
                    </Box>
                    {/* <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton onClick={() => setIsSaved(prev => !prev)} title="bookmarks">
                            {
                                isSaved ? <BookmarkIcon color="secondary" /> : <BookmarkBorderIcon />
                            }

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>7k</Typography>
                    </Box> */}
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton title="repost">
                            <RepostIcon />

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>7k</Typography>
                    </Box>
                </Stack>

            </Stack>
        </>
    )
}

export default PostUI;




