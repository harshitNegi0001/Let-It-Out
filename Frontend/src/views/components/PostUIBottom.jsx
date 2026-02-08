import { Stack, Box, IconButton, Typography, Backdrop } from "@mui/material";
import { deleteLikeTarget, likeTarget } from "../../utils/postOperations";
import LikeEmptyButton from '@mui/icons-material/FavoriteBorder';
import LikeFilledButton from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentsIcon from '@mui/icons-material/Forum';
import RepostIcon from '@mui/icons-material/Repeat';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import RepostComponent from "./RepostComponent";


function PostUIBottom({ postData,userData }) {
    const [likeCount, setLikeCount] = useState({
        is_liked: false,
        count: 0
    });
    const [openRepost,setOpenRepost] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {

        if (postData) {
            setLikeCount({ count: parseInt(postData?.likes_count), is_liked: postData?.is_liked });
        }


    }, [postData]);
    const navigate = useNavigate();
    const location = useLocation();

    const closeRepost = ()=>{
        document.activeElement?.blur();
        setOpenRepost(false);
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
    return (
        <>
            <Stack direction={'row'} justifyContent={'space-evenly'} borderTop={1} mx={1} borderColor={'divider'}>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} >
                    <IconButton onClick={() => handleLikeBtn()} title="Likes">
                        {
                            likeCount.is_liked ? <LikeFilledButton color="secondary" /> : <LikeEmptyButton />
                        }

                    </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{likeCount.count || 0}</Typography>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton title="comments" onClick={() => navigate(`/p/${postData.id}`, { state: { prevUrl: location.pathname + location.search } })}>
                        <CommentsIcon />

                    </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{postData?.comments_count || 0}</Typography>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton title="shares">
                        <ShareIcon />

                    </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{postData?.shares_count || 0}</Typography>
                </Box>

                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton title="repost" disabled={postData?.parent_post_data} onClick={()=>setOpenRepost(true)}>
                        <RepostIcon />

                    </IconButton>
                    <Typography variant="body2" fontSize={12} component={'span'}>{postData?.reposts_count||0}</Typography>
                </Box>
                <Backdrop open={openRepost} 
                onClick={closeRepost} 
                sx={{ zIndex: 9999, bgcolor: '#ffffff25',backdropFilter:'blur(2px)', position: 'fixed', top: 0, left: 0  }} >
                    <RepostComponent closeRepost={closeRepost} postData={postData} userData={userData}/>
                </Backdrop>
            </Stack>
        </>
    )
}
export default PostUIBottom;