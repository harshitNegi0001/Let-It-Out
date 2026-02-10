import { Box, Divider, Stack, Typography, Avatar, TextField, Button, Backdrop } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import { setState } from "../../store/authReducer/authReducer";
import LoadingComment from "./LoadingComment";
import CommentReplyCommponent from "./CommentReplyCommponent";


function CommentSection({ postId }) {

    const [myComment, setMyComment] = useState('');
    const [shareBtnLoading, setShareBtnLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [commentList, setCommentList] = useState([]);
    const [openCommentReply, setOpenCommentReply] = useState(false);
    const [replyingCmntData, setReplyCmntData] = useState({});
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (postId) {
            getComments();
        }
    }, [postId]);

    const getComments = async () => {
        try {
            setIsLoading(true);
            const lastCommentId = commentList.length == 0 ? null : commentList[commentList.length - 1]?.id;
            const url = lastCommentId ?
                `${backend_url}/cmnt/get-comments?post_id=${postId}&&limit=${10}&&lastCommentId=${lastCommentId}` :
                `${backend_url}/cmnt/get-comments?post_id=${postId}&&limit=${10}`;
            const result = await axios.get(
                url,
                {
                    withCredentials: true
                }
            );
            if (result?.data?.commentsList?.length < 10) {
                setHasMore(false);
            }
            setCommentList(prev => ([...prev, ...result?.data?.commentsList]));
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            // console.log(err);
            dispatch(setState({ error: err.response?.data?.error || 'Something went wrong!' }));
        }
    }

    const submitComment = async () => {

        if (!myComment.trim()) {
            return;
        }

        try {
            setShareBtnLoading(true);
            const result = await axios.post(
                `${backend_url}/cmnt/add-comment`,
                {
                    content: myComment.trim(),
                    parentId: null,
                    postId: postId
                },
                {
                    withCredentials: true
                }
            );
            setMyComment('');
            setCommentList(prev => ([result?.data?.commentData, ...prev]));
            setShareBtnLoading(false);
        } catch (err) {
            setShareBtnLoading(false);
            // console.log(err);
            dispatch(setState({ error: err.response?.data?.error || 'Something went wrong!' }));
        }
    }
    return (
        <>
            <Backdrop sx={{ zIndex: 9999, bgcolor: '#ffffff18', position: 'fixed', top: 0, left: 0, }} open={openCommentReply} onClick={() => setOpenCommentReply(false)}>
                <CommentReplyCommponent setOpenCommentReply={setOpenCommentReply} replyingCmntData={replyingCmntData} setReplyCmntData={setReplyCmntData} />
            </Backdrop>
            <Stack width={'100%'} p={1} direction={'column'} spacing={2}>
                <Divider sx={{ width: '100%' }} />
                <Stack direction="row" alignItems={'center'} spacing={1}>
                    <Avatar src={userInfo?.image} />
                    <TextField
                        variant="standard"
                        multiline
                        minRows={1}
                        maxRows={3}
                        placeholder="Share your support..."
                        fullWidth
                        color="secondary"
                        value={myComment}
                        error={myComment.length > 2000}
                        helperText={`${myComment.length}/2000 `}
                        slotProps={{
                            htmlInput: {
                                maxLength: 2000
                            }
                        }}
                        onChange={(e) => setMyComment(e.target.value)}
                        sx={{
                            '& textarea': {
                                fontSize: { xs: '14px', sm: '18px' },

                            },
                            '& .MuiFormHelperText-root': {
                                fontSize: { xs: '8px', sm: '10px' },
                                lineHeight: 1,
                                marginTop: '4px',
                                textAlign: 'end'
                            }
                        }}
                    />
                    <Button loading={shareBtnLoading} color="secondary" onClick={submitComment} variant="contained" sx={{ textTransform: 'none', borderRadius: "20px" }}>
                        Share
                    </Button>

                </Stack>
                <Divider sx={{ width: '100%' }} />

                <Box width={'100%'} px={1}>
                    <Typography variant="body1" fontSize={{ xs: '18px', sm: '24px' }} color="#fff" fontWeight={600}>
                        Comments
                    </Typography>

                </Box>

                <Divider x={{ width: '100%' }} />
                <Stack width={'100%'} spacing={{ xs: 1, sm: 2 }}>

                    {commentList.map(c =>
                        <CommentItem key={c.id} commentData={c} level={1} setOpenCommentReply={setOpenCommentReply} setReplyCmntData={setReplyCmntData} setCommentList={setCommentList} />
                    )}
                    {
                        !isLoading && commentList.length != 0 &&
                        <>
                            {
                                hasMore ? <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    `<Button size="small" sx={{ color: 'text.secondary' }} onClick={getComments}>
                                        See More...
                                    </Button>
                                </Box> :
                                    <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Typography variant="body2" color="text.secondary" component={'span'} fontSize={{ xs: '8px', sm: '11px' }}>
                                            ( ︶︵︶ ) No more comments. ( ︶︵︶ )
                                        </Typography>
                                    </Box>
                            }
                        </>
                    }
                    {isLoading && [1, 2, 3].map(i => <LoadingComment key={i} />)}
                    {!isLoading && commentList.length == 0 &&
                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box width={'100%'} maxWidth={{ xs: '250px', sm: '380px' }} >
                                <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768276563/uof3wqwlmc9tojb6yfk9.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                            </Box>
                            <Typography width={'100%'} textAlign={'center'} variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                                No comments yet
                            </Typography>
                            <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                This space is open for support and understanding.
                            </Typography>

                            <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                                Your words might mean more than you think.
                            </Typography>
                        </Box>
                    }



                </Stack>
            </Stack>
        </>
    )
}
export default CommentSection;