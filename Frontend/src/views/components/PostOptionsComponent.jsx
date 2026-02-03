import { Backdrop, Box, Button, Stack, IconButton, ListItemIcon, FormLabel, FormControlLabel, Radio, RadioGroup, FormControl, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
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
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { reportOptions } from "../../utils/reportOptions";


function PostOptionsComponent({ userData, setHidePost, postData }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userFStatus, setUserFStatus] = useState(null)
    const [isSaved, setIsSaved] = useState(false);
    const [openReportBox, setOpenReportBox] = useState(false);
    const [reportReason, setReportReason] = useState('');
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
            setUserFStatus(userData?.following_status);
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
                break;
            case 'CANCEL_FOLLOW':
                handleFollow('cancel');

                break;
            case 'ADD_FOLLOW':
                handleFollow('add');
                break;

            case 'NOT_INTERESTED':
                notInterestedPost();
                break;
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

    const notInterestedPost = async () => {
        try {
            setIsLoading(true);

            const result = await axios.post(`${backend_url}/like/add-dislike-post`,
                {
                    post_id: actionData.payload
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
                reason: 'This content has been hidden based on your preference.'
            })

        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
            // console.log(err);
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
                reason: 'This post has been hidden from your feed.'
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

    const handleReportAction = () => {
        setOpenReportBox(true);
        handleCloseMenu();
    }
    const cancleReport = () => {
        document.activeElement?.blur();
        setReportReason('');
        setOpenReportBox(false);
    }

    const submitReport = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/report/add-report`,
                {
                    reason: reportReason,
                    target_type: 'post',
                    reported_user_id: userData?.id,
                    target_id: postData?.id
                },
                {
                    withCredentials: true
                }
            )

            setIsLoading(false);
            setHidePost({
                isHidden: true,
                reason: 'Thanks for reporting. We’ll review this to help keep the space safe.'
            });
            cancleReport();
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));

        }
    }
    const handleFollow = async (operation) => {
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/api/req-follow`,
                {
                    following_id: actionData.payload,
                    operation: operation
                },
                {
                    withCredentials: true
                }
            );

            setUserFStatus((result.data.followingStatus == "not_followed") ? null : result.data.followingStatus);

            setIsLoading(false);
            cancleAction();
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));

        }
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
                {(userInfo.id != userData?.id) &&
                    <MenuItem onClick={handleReportAction}>
                        <ListItemIcon>
                            <ReportGmailerrorredIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText>Report</ListItemText>
                    </MenuItem>
                }
                {(userInfo.id != userData?.id) && <MenuItem onClick={() =>
                    handleAction({
                        label: `Do you want to ${!userFStatus ? 'follow this user' :
                            (userFStatus == 'accepted') ? 'unfollow this user' : 'cancel your follow req'}?`
                        , type: `${!userFStatus ? 'ADD_FOLLOW' : 'CANCEL_FOLLOW'}`,
                        payload: userData?.id
                    })}>
                    <ListItemIcon>
                        {
                            !userFStatus ?
                                <PersonAddAlt1Icon fontSize="small" /> :
                                (userFStatus == 'accepted') ?
                                    <PersonRemoveIcon fontSize="small" /> :
                                    <CancelOutlinedIcon fontSize="small" />
                        }
                    </ListItemIcon>
                    <ListItemText>
                        {!userFStatus ?
                            `Follow ${userData.name}` :
                            (userFStatus == 'accepted') ?
                                `Unfollow ${userData.name}` : 'Cancle follow request'}
                    </ListItemText>
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
            {
                openReportBox &&
                <Backdrop open={openReportBox}
                    onClick={cancleReport}
                    sx={{ zIndex: 9999 }}>
                    <Box onClick={(e) => e.stopPropagation()}
                        width={'100%'} maxWidth={{ xs: '280px', sm: '360px' }}
                        p={2} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                        bgcolor={'primary.light'}
                        borderRadius={3}>
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Typography fontSize={{ xs: '16px', sm: '20px' }} color='#fff'>Report</Typography>
                            <IconButton size='small' sx={{ fontSize: { xs: '16px', sm: '20px' } }}
                                onClick={() => cancleReport()}>
                                <ClearIcon />
                            </IconButton>
                        </Box>
                        <Stack width={'100%'} maxHeight={{ xs: '310px', sm: '365px' }} overflow={'scroll'} spacing={1}>
                            <Typography fontSize={{ xs: '12px', sm: '16px' }} >What type of issue are you reporting?</Typography>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                >
                                    {reportOptions.map(r =>
                                        <FormControlLabel key={r.id}
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: { xs: '12px', sm: '16px' }, // or 0.875rem
                                                },
                                            }}
                                            value={r.value}
                                            control={< Radio color='secondary' size='small' />}
                                            label={r.label} />
                                    )}

                                </RadioGroup>
                            </FormControl>
                        </Stack>
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={() => submitReport()} disabled={Boolean(!reportReason)} loading={isLoading} variant='contained' color='error'
                                sx={{ borderRadius: '20px', width: '80%', textTransform: 'none' }}>
                                Report
                            </Button>
                        </Box>
                    </Box>
                </Backdrop>
            }
        </>
    )
}

export default PostOptionsComponent;