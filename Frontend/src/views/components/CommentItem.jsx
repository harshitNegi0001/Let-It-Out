import { Avatar, Stack, Box, Divider, IconButton, Typography, Button } from "@mui/material";
import { timeCount } from "../../utils/formatDateTime";
import OptionIcon from '@mui/icons-material/MoreVert';
import LikeEmptyButton from '@mui/icons-material/FavoriteBorder';
import LikeFilledButton from '@mui/icons-material/Favorite';
import CommentsIcon from '@mui/icons-material/Forum';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteLikeTarget, likeTarget } from "../../utils/postOperations";
import CommentActionBtn from "./CommentActionsBtn";
import LoadingComment from "./LoadingComment";
import axios from "axios";
import { setState } from "../../store/authReducer/authReducer";


function CommentItem({ commentData, level, setCommentList, setOpenCommentReply, setReplyCmntData }) {
    const [openComment, setOpenComment] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [childComment, setChildComment] = useState([]);
    const [likeCount, setLikeCount] = useState({
        is_liked: false,
        count: 0
    });

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleReplyComment = () => {
        setOpenCommentReply(true);
        setReplyCmntData({
            replying_to: commentData?.user_data?.username,
            comment_id: commentData?.id,
            settingList: setCommentList,
            postId: commentData?.post_id
        });
    }

    useEffect(() => {
        if (commentData) {
            setLikeCount(
                {
                    is_liked: commentData?.is_liked,
                    count: parseInt(commentData?.likes_count) || 0
                }
            )
        }
    }, [commentData]);
    useEffect(() => {
        if (openComment && childComment.length == 0) {
            getChildComments();
        }
    }, [openComment]);

    const getChildComments = async () => {
        try {
            setIsLoading(true);

            const result = await axios.get(
                `${backend_url}/cmnt/get-comments?parent_id=${commentData.id}`,
                {
                    withCredentials: true
                }
            );

            setChildComment(prev => ([...prev, ...result?.data?.commentsList]));
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            // console.log(err);
            dispatch(setState({ error: err.response?.data?.error || 'Something went wrong!' }));
        }
    }

    const handleLikeBtn = () => {
        if (likeCount.is_liked) {
            deleteLikeTarget('comment', commentData.id, dispatch);
            setLikeCount(prev => ({ count: prev.count - 1, is_liked: false }));
            return;
        }
        else {
            likeTarget('comment', commentData.id, dispatch);
            setLikeCount(prev => ({ count: prev.count + 1, is_liked: true }));

            return;
        }
    }
    return (
        <>

            <Box width={'100%'} p={1} sx={{ display: 'flex', gap: 1 }} position={'relative'} border={1} borderColor={'divider'} borderRadius={2}>
                <Box width={{ xs: '35px', sm: '45px' }} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'column' }} >
                    <Avatar sx={{ width: { xs: '35px', sm: '45px' }, height: { xs: '35px', sm: '45px' } }} onClick={() => navigate(`/profile/${commentData?.user_data?.username}`)} src={commentData?.user_data.image} />
                    {(childComment.length > 0 || level == 3) && <Box width={0} height={'100%'} mb={2} borderLeft={1} borderColor={'divider'} />}
                </Box>
                {level == 2 && <Box width={{ xs: '27px', sm: '32px' }} position={'absolute'} left={{ xs: '-27px', sm: '-32px' }} top={'50%'} borderBottom={1} borderColor={'divider'} />}
                <Box width={{ xs: 'calc(100% - 50px)', sm: 'calc(100% - 60px)' }} sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }} width={'calc(100% - 40px)'}>

                            <Typography variant="body1" color="#fff" fontSize={{ xs: '11px', sm: '15px' }} maxWidth={'100%'} noWrap textOverflow={'ellipsis'} fontWeight={600} >
                                {commentData?.user_data?.name}


                            </Typography>
                            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }} width={'100%'} >
                                <Typography variant="body2" color="text.secondary" onClick={() => navigate(`/profile/${commentData?.user_data?.username}`)} sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }} maxWidth={{ xs: '60px', sm: '130px', md: '160px' }} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '9px', sm: '12px' }} fontWeight={400} >
                                    @{commentData?.user_data?.username}
                                </Typography>
                                <Typography fontSize={{ xs: '7px', sm: '12px' }} color="text.secondary" fontWeight={'200'}>
                                    · {timeCount(commentData.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <CommentActionBtn comment_poster_data={commentData?.user_data} commentId={commentData?.id} setCommentList={setCommentList} />
                        </Box>

                    </Box>
                    <Box width={'100%'} >
                        {commentData?.replying_to && <Typography sx={{ display: 'flex', gap: '3px', alignItems: 'center' }} fontSize={{ xs: '7px', sm: '12px' }} component={'span'} color="text.secondary" fontWeight={'200'}>
                            · replying to <Typography onClick={() => navigate(`/profile/${commentData?.replying_to}`)} sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer', }} fontSize={{ xs: '7px', sm: '12px' }} component={'span'} color="text.secondary" fontWeight={'200'} >@{commentData?.replying_to}</Typography>
                        </Typography>}
                        <Typography variant="body1" fontSize={{ xs: '11px', sm: '15px' }} sx={{ whiteSpace: 'pre-wrap' }} color="text.primary" fontWeight={400}>
                            {commentData?.content}
                        </Typography>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Stack direction={'row'} justifyContent={'start'} spacing={3} px={{ xs: 1, sm: 2 }}  >
                        <Box display={'flex'} width={'120px'} justifyContent={'start'} alignItems={'center'} >
                            <IconButton size="small" onClick={() => handleLikeBtn()} title="Likes">
                                {
                                    likeCount?.is_liked ? <LikeFilledButton color="secondary" sx={{ fontSize: { xs: '14px', sm: '20px' } }} /> : <LikeEmptyButton sx={{ fontSize: { xs: '14px', sm: '20px' } }} />
                                }

                            </IconButton><Typography variant="body2" fontSize={12} component={'span'}>{likeCount.count || 0}</Typography>
                        </Box>
                        <Box display={'flex'} width={'120px'} justifyContent={'start'} alignItems={'center'}>
                            <IconButton size="small" title="comments" onClick={handleReplyComment}>
                                <CommentsIcon sx={{ fontSize: { xs: '14px', sm: '20px' } }} />

                            </IconButton>
                            <Typography variant="body2" fontSize={12} component={'span'}>{commentData?.comments_count || 0}</Typography>
                        </Box>


                    </Stack>
                    {(commentData?.comments_count > 0) && level == 1 && <>

                        {openComment &&
                            <>
                                {childComment.map(c =>
                                    <CommentItem key={c.id} commentData={c} level={2} setOpenCommentReply={setOpenCommentReply} setReplyCmntData={setReplyCmntData} setCommentList={setChildComment} />
                                )}

                                {
                                    isLoading && [1, 2, 3].map(i => <LoadingComment key={i} />)
                                }
                            </>


                        }
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'start' }}>
                            <Button variant="text" size="small" onClick={() => setOpenComment(prev => !prev)} color="secondary">
                                <Typography variant="body2" color="text.secondary" fontSize={{ xs: '12px', sm: '15px' }}>
                                    {openComment ? 'Hide' : commentData?.comments_count} replies
                                </Typography>
                            </Button>
                        </Box>
                    </>

                    }
                </Box>

            </Box>
            {(commentData?.comments_count > 0) && level > 1 && <>

                {openComment &&
                    <>
                        {childComment.map(c =>
                            <CommentItem key={c.id} commentData={c} level={3} setOpenCommentReply={setOpenCommentReply} setReplyCmntData={setReplyCmntData} setCommentList={setChildComment} />
                        )}
                        {
                            isLoading && [1, 2, 3].map(i => <LoadingComment key={i} />)
                        }
                    </>
                }
                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'start', px: '50px' }}>
                    <Button variant="text" size="small" onClick={() => setOpenComment(prev => !prev)} color="secondary">
                        <Typography variant="body2" color="text.secondary" fontSize={{ xs: '12px', sm: '15px' }}>
                            {openComment ? 'Hide' : commentData?.comments_count} replies
                        </Typography>
                    </Button>
                </Box>
            </>

            }
        </>
    )
}

export default CommentItem;