import { Avatar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from "@mui/material";
import OptionIcon from '@mui/icons-material/MoreVert';
import LikeEmptyButton from '@mui/icons-material/FavoriteBorder';
import LikeFilledButton from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentsIcon from '@mui/icons-material/Forum';
import RepostIcon from '@mui/icons-material/Repeat';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import getPostActions from "../../utils/postActions";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ImageGrid from "./ImageGrid";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { requiredAction } from "../../store/authReducer/authReducer";
import { useNavigate } from "react-router-dom";
import { moods } from "../../utils/moods";
import { deleteLikeTarget, likeTarget, savePost, undoSavedPost } from "../../utils/postOperations";






function PostUI({ followed = false, postData, userData }) {

    const { userInfo } = useSelector(state => state.auth);
    const [likeCount, setLikeCount] = useState({
        is_liked: false,
        count: 0
    });
    const [isSaved, setIsSaved] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [postAction, setPostAction] = useState([]);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (userData?.id && userInfo?.id) {
            setPostAction([...getPostActions(userData.id, userInfo.id, postData.id)]);
        }
    }, [userData]);
    useEffect(() => {

        if (postData) {
            setLikeCount({ count: parseInt(postData?.likes_count), is_liked: postData?.is_liked });
            setIsSaved(postData?.is_saved);
        }


    }, [postData])

    function formatPostTime(createdAt) {
        // Remove microseconds if present
        
        const cleaned = createdAt.split(".")[0] + "Z"; // force UTC

        const postDate = new Date(cleaned);
        const now = new Date();

        const diffMs = now - postDate;

        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        // Same local day
        if (postDate.toDateString() === now.toDateString()) {
            return `today at ${postDate
                .toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
                .toLowerCase()}`;
        }

        if (diffYears >= 1) return `${diffYears}yr ago`;
        if (diffMonths >= 1) return `${diffMonths}mon ago`;
        if (diffDays >= 1) return `${diffDays}d ago`;
        if (diffHours >= 1) return `${diffHours}h ago`;
        if (diffMinutes >= 1) return `${diffMinutes}m ago`;

        return "just now";
    }


    const handleLikeBtn = () => {
        if (likeCount.is_liked) {
            deleteLikeTarget('post', postData?.id, dispatch);
            setLikeCount(prev => ({ count: prev.count - 1, is_liked: false }));
            return;
        }
        else {
            likeTarget('post', postData?.id, dispatch);
            setLikeCount(prev => ({ count: prev.count + 1, is_liked: true }));

            return;
        }
    }
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleBookmark = async () => {
        if (isSaved) {
            undoSavedPost(postData.id);
        }
        else {
            savePost(postData.id);
        }
        setIsSaved(prev => !prev);

        handleClose();
    }
    return (

        <>


            <Stack width={'100%'} borderRadius={2} overflow={'hidden'} border={1} borderColor={'primary.dark'}>
                <Stack direction={'row'} width={'100%'} boxSizing={'border-box'} p={1} justifyContent={'space-between'} bgcolor={'primary.dark'} alignItems={'center'}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'} width={'calc(100% - 40px)'}>
                        <Box width={{ xs: '40px', sm: '55px' }} onClick={() => navigate(`/profile/${userData.username}`)} height={{ xs: '40px', sm: '55px' }} overflow={'hidden'} borderRadius={'30px'} >
                            <Avatar sx={{ width: '100%', height: "100%", bgcolor: '#c2c2c2' }}>
                                {userData?.image && <img src={userData?.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                            </Avatar>
                        </Box>

                        <Stack spacing={0}>
                            <Typography variant="body2" component={'span'} fontWeight={'bold'} fontSize={{ xs: 12, sm: 16 }} textOverflow={'ellipsis'} noWrap color="text.primary">{userData?.fake_name || userData?.name}</Typography>

                            {postData?.created_at && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                                {formatPostTime(postData?.created_at)}
                            </Typography>}


                            {postData?.mood_tag && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                                feeling {moods.find(m => m.value == postData?.mood_tag).label}
                            </Typography>}
                        </Stack>

                    </Stack>
                    <IconButton onClick={handleClick} size="large" id="post-options-btn" aria-haspopup='true' aria-expanded={open ? 'true' : undefined} aria-controls={open ? 'post-option-menu' : undefined}><OptionIcon /></IconButton>
                </Stack>
                <Menu id="post-option-menu" anchorEl={anchorEl} open={open} slotProps={{ list: { 'aria-labelledby': 'post-options-btn' } }} onClose={handleClose}>
                    {postAction.map((o, i) => <MenuItem key={i} onClick={() => { handleClose(); dispatch(requiredAction({ label: o.label, type: o.type, payload: o.payload })) }}>
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
                    {(userInfo.id!=userData.id)&&<MenuItem >
                        <ListItemIcon>
                            {
                                !followed?<PersonAddAlt1Icon fontSize="small"/>:(followed=='accepted')?<PersonRemoveIcon fontSize="small"/>:<CancelOutlinedIcon fontSize="small"/>
                            }
                        </ListItemIcon>
                        <ListItemText>{!followed?`Follow ${userData.name}`:(followed=='accepted')?`Unfollow ${userData.name}`:'Cancle follow request'}</ListItemText>
                    </MenuItem>}
                </Menu>
                <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }}>

                    <Typography mb={2} sx={{ whiteSpace: 'pre-wrap' }} fontSize={{ xs: 12, sm: 16 }}>
                        {postData.content}
                    </Typography>
                    {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} />}

                </Box>
                <Stack direction={'row'} justifyContent={'space-evenly'} borderTop={1} mx={1} borderColor={'divider'}>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} >
                        <IconButton onClick={() => handleLikeBtn()} title="Likes">
                            {
                                likeCount.is_liked ? <LikeFilledButton color="secondary" /> : <LikeEmptyButton />
                            }

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{likeCount.count}</Typography>
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




