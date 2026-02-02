import { Stack, Box, IconButton, Typography } from "@mui/material";
import { deleteLikeTarget, likeTarget } from "../../utils/postOperations";
import LikeEmptyButton from '@mui/icons-material/FavoriteBorder';
import LikeFilledButton from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentsIcon from '@mui/icons-material/Forum';
import RepostIcon from '@mui/icons-material/Repeat';
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


function PostUIBottom({ postData }) {
    const [likeCount, setLikeCount] = useState({
        is_liked: false,
        count: 0
    });

    const dispatch = useDispatch();

    useEffect(() => {

        if (postData) {
            setLikeCount({ count: parseInt(postData?.likes_count), is_liked: postData?.is_liked });
        }


    }, [postData]);
    const navigate = useNavigate();


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
                    <IconButton title="comments" onClick={()=>navigate(`/p/${postData?.id}`)}>
                        <CommentsIcon />

                    </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{postData?.comments_count || 0}</Typography>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton title="shares">
                        <ShareIcon />

                    </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{postData?.shares_count || 0}</Typography>
                </Box>
                
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <IconButton title="repost">
                        <RepostIcon />

                    </IconButton>
                    <Typography variant="body2" fontSize={12} component={'span'}>0</Typography>
                </Box>
            </Stack>
        </>
    )
}
export default PostUIBottom;