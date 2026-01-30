import { Backdrop, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import OptionIcon from '@mui/icons-material/MoreVert';
import getPostActions from "../../utils/postActions";
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";
import { savePost, undoSavedPost } from "../../utils/postOperations";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';


function PostOptionsComponent({ userData, setHidePost, postData}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const [postAction, setPostAction] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const openMenu = Boolean(anchorEl);
    const [actionData, setActionData] = useState({
        backdropOpen: false,
        label: '',
        type: '',
        payload: ''
    });
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector(state => state.auth);
    useEffect(() => {
        if (userData?.id && userInfo?.id) {
            setPostAction([...getPostActions(userData.id, userInfo.id, postData.id)]);
        }
    }, [userData]);
    useEffect(() => {
        if (postData) {
            setIsSaved(postData?.is_saved);

        }
    }, [postData]);

    const handleMenuBtnClick = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleCloseMenu = () => {
        document.activeElement?.blur();
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

        handleCloseMenu();
    }

    const cancleAction = () => {
        document.activeElement?.blur();

        setActionData({
            backdropOpen: false,
            label: '',
            type: '',
            payload: ''
        });
    }
    const performAction = () => {
        switch (actionData?.type) {
            case 'DELETE_POST':
                deletePost();
                break;
            case 'BLOCK_USER':
                blockUser();
                break;
            case 'REPORT_POST':
                reportPost()
        }
    }

    const deletePost = async () => {

        try {
            setIsLoading(true);

            const result = await axios.post(`${backend_url}/api/delete-post`,
                {
                    postId: actionData.payload
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            );

            setIsLoading(false);
            cancleAction();
            setHidePost({
                isHidden: true,
                reason: 'Post has been deleted.'
            })
            dispatch(setState({ success: 'Post has been deleted.' }));

        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
            // console.log(err);
        }

    }

    const reportPost = async () => {
        try {

            const postId = actionData.payload;
            setIsLoading(true);
            // api call

           
            setIsLoading(false);
            cancleAction();
            setHidePost({
                isHidden: true,
                reason: 'Post has been reported.'
            });
            dispatch(setState({ success: 'Post has been Reported.\nWe will take action.' }));

        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Internal Server Error!' }));
        }
    }
    const blockUser = async () => {
        try {
           
            setIsLoading(true);

            const result = await axios.post(`${backend_url}/api/block-user`,
                {
                    blocked_id: actionData.payload,
                    operation: 'block'
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            );
            
            setIsLoading(false);
            cancleAction();
            setHidePost({
                isHidden: true,
                reason: 'Post has been Blocked.'
            });

            dispatch(setState({ success: 'User has been blocked. \nYou will not see the posts from this user.' }));
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));
            // console.log(err);
        }
    }

    const handleAction = (data) => {
        setActionData({
            backdropOpen: true,
            label: data.label,
            type: data.type,
            payload: data.payload
        });
        handleCloseMenu();

    }




    return (
        <>
            <IconButton size="small" onClick={handleMenuBtnClick} id="post-options-btn" aria-haspopup='true' aria-expanded={openMenu ? 'true' : undefined} aria-controls={openMenu ? 'post-option-menu' : undefined}>
                <OptionIcon />
            </IconButton>

            <Menu id="post-option-menu" anchorEl={anchorEl} open={openMenu} slotProps={{ list: { 'aria-labelledby': 'post-options-btn' } }} onClose={handleCloseMenu}>
                {postAction.map((o, i) => <MenuItem key={i} onClick={() => { handleAction({ label: o.label, type: o.type, payload: o.payload }) }}>
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
                {(userInfo.id != userData.id) && <MenuItem >
                    <ListItemIcon>
                        {
                            !userData?.following_status ? <PersonAddAlt1Icon fontSize="small" /> : (userData?.following_status == 'accepted') ? <PersonRemoveIcon fontSize="small" /> : <CancelOutlinedIcon fontSize="small" />
                        }
                    </ListItemIcon>
                    <ListItemText>{!userData?.following_status ? `Follow ${userData.name}` : (userData?.following_status == 'accepted') ? `Unfollow ${userData.name}` : 'Cancle follow request'}</ListItemText>
                </MenuItem>}
            </Menu>


            {actionData?.backdropOpen && <Backdrop open={actionData?.backdropOpen} onClick={cancleAction} sx={{ zIndex: 9999 }}>
                <Box width={'280px'} onClick={(e) => e.stopPropagation()} bgcolor={'primary.light'} borderRadius={2} display={'flex'} flexDirection={'column'} gap={2} p={2}>
                    <Box width={'100%'} >
                        <Typography variant="body1" component={'div'}>{actionData?.label}</Typography>
                    </Box>
                    <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>

                        {!isLoading && <Button variant="text" sx={{ color: '#fff' }} onClick={cancleAction}><ClearIcon /></Button>}
                        <Button variant="contained" color="error" loading={isLoading} onClick={performAction}><DoneIcon /></Button>
                    </Box>
                </Box>
            </Backdrop>}
        </>
    )
}

export default PostOptionsComponent;