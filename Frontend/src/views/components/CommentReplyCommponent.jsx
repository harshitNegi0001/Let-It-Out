import { Avatar, Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import axios from 'axios';
import { setState } from "../../store/authReducer/authReducer.js";
import { useNavigate } from "react-router-dom";



function CommentReplyCommponent({ setOpenCommentReply, replyingCmntData,setReplyCmntData }) {

    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const closeReply = () => {
        setText('');
        setOpenCommentReply(false);
        setReplyCmntData({});
    }

    const isPostDisabled = text.trim() === "";
    const submitPost = async () => {
        try {
            setIsLoading(true);
            const parent_id = replyingCmntData?.comment_id

            const result = await axios.post(
                `${backend_url}/cmnt/add-comment`,
                {
                    content: text.trim(),
                    parentId: parent_id,
                    replying_to:replyingCmntData?.replying_to,
                    postId: replyingCmntData?.postId
                },
                {
                    withCredentials: true
                }
            );

            setIsLoading(false);
            replyingCmntData?.settingList(prev=>{
                return prev.map(c=>
                (c.id==parent_id)?{...c,comments_count:parseInt(c.comments_count)+1}:c
                )
            });
            dispatch(setState({ success: "Replied to a comment" }));
            closeReply();


        } catch (err) {
            setIsLoading(false);
            // console.error(err);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong. Please retry." }));
        }
    };

    return (
        <Box
            onClick={(e) => e.stopPropagation()}
            width="100%"
            maxWidth="450px"
            borderRadius={3}
            p={2}
            bgcolor="primary.dark"
        >
            <Stack spacing={1.5}>


                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold">Reply comment</Typography>
                    <IconButton size="small" onClick={closeReply}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box width={'100%'} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontSize={{ xs: '10px', sm: '15px' }} color=" text.primary" variant="body2">
                        Replying to
                    </Typography>
                    <Typography onClick={() => navigate(`/profile/${replyingCmntData?.replying_to}`)} fontSize={{ xs: '10px', sm: '15px' }}  sx={{ '&:hover': { textDecoration: 'underline', color: 'secondary.main' }, color: 'text.secondary', cursor: 'pointer' }} variant="body2">
                        @{replyingCmntData?.replying_to}
                    </Typography>
                </Box>



                <Stack direction="row" spacing={1}>
                    <Avatar src={userInfo?.image} />
                    <TextField
                        multiline
                        minRows={1}
                        maxRows={3}
                        variant="standard"
                        placeholder="How you feeling today?"
                        fullWidth
                        value={text}
                        error={text.length > 2000}
                        helperText={`${text.length}/2000 `}
                        slotProps={{
                            htmlInput: {
                                maxLength: 2000
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




                <Divider />


                <Box display="flex" justifyContent="end" alignItems="center">


                    <Button
                        loading={isLoading}
                        onClick={submitPost}
                        variant="contained"
                        color="secondary"
                        size="small"
                        disabled={isPostDisabled}
                        sx={{ borderRadius: "20px", px: 3, textTransform: 'none' }}
                    >
                        Share
                    </Button>
                </Box>
            </Stack>
        </Box>
    )
}

export default CommentReplyCommponent;