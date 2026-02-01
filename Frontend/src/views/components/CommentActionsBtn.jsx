import { Backdrop, Box, Button, IconButton, ListItemIcon, FormLabel, FormControlLabel, Radio, RadioGroup, FormControl, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import axios from "axios";
import { setState } from "../../store/authReducer/authReducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import BlockIcon from '@mui/icons-material/Block';
import { reportOptions } from '../../utils/reportOptions';


function CommentActionBtn({ comment_poster_data, setCommentList, commentId }) {


    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openReportBox, setOpenReportBox] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const openMenu = Boolean(anchorEl);
    const [actionData, setActionData] = useState({
        backdropOpen: false,
        label: '',
        type: '',
        payload: ''
    });

    const { userInfo } = useSelector(state => state.auth);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMenuBtnClick = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleCloseMenu = () => {
        document.activeElement?.blur();
        setAnchorEl(null);

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
    const performAction = async () => {


        switch (actionData?.type) {
            case 'DELETE_COMMENT':
                await deletePost();
                break;
            case 'BLOCK_USER':
                await blockUser();
                break;
            case 'CANCEL_FOLLOW':
                await handleFollow('cancel');

                break;
            case 'ADD_FOLLOW':
                await handleFollow('add');
                break;
        }
        cancleAction();

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
            // const result = await axios.post(
            //     ``,
            //     {
            //         reason: reportReason,
            //         target_type: 'comment',
            //         userId: comment_poster_data?.id,
            //         target_id:commentId
            //     },
            //     {
            //         withCredentials:true
            //     }
            // )

            setIsLoading(false);
            cancleReport();
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));

        }
    }

    const deletePost = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/cmnt/del-comment`,
                {
                    commentId: commentId
                },
                {
                    withCredentials:true
                }
            );
            setCommentList(prev => {
                return prev.filter(c => c.id != commentId)
            });
            setIsLoading(false);
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
            setCommentList(prev => {
                return prev.map(c => {
                    return { ...c, user_data: { ...c.user_data, following_status: (result.data.followingStatus == "not_followed") ? null : result.data.followingStatus } }
                });
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));

        }
    }
    const blockUser = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/api/block-user`,
                {
                    blocked_id: actionData.payload,
                    operation: 'block'
                },
                {
                    withCredentials: true
                }
            );
            setCommentList(prev => {
                return prev.filter(c => c.id != commentId);
            });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));

        }
    }
    return (
        <>
            <IconButton size='small'
                onClick={handleMenuBtnClick}
                id="comment-options-btn"
                aria-haspopup='true'
                aria-expanded={openMenu ? 'true' : undefined}
                aria-controls={openMenu ? 'comment-option-menu' : undefined} >

                <MoreVertIcon sx={{ fontSize: { xs: '12px', sm: '16px' } }} />

            </IconButton>

            <Menu id="comment-option-menu"
                anchorEl={anchorEl}
                open={openMenu}
                slotProps={{ list: { 'aria-labelledby': 'comment-options-btn' } }}
                onClose={handleCloseMenu}>


                {(userInfo.id != comment_poster_data?.id) &&

                    <MenuItem onClick={() =>
                        handleAction({
                            label: `Do you want to ${!comment_poster_data?.following_status ? 'follow this user' :
                                (comment_poster_data?.following_status == 'accepted') ? 'unfollow this user' : 'cancel your follow req'}?`
                            , type: `${!comment_poster_data?.following_status ? 'ADD_FOLLOW' : 'CANCEL_FOLLOW'}`,
                            payload: comment_poster_data?.id
                        })}>
                        <ListItemIcon>
                            {
                                !comment_poster_data?.following_status ?
                                    <PersonAddAlt1Icon fontSize="small" /> :
                                    (comment_poster_data?.following_status == 'accepted') ?
                                        <PersonRemoveIcon fontSize="small" /> :
                                        <CancelOutlinedIcon fontSize="small" />
                            }
                        </ListItemIcon>
                        <ListItemText>
                            {!comment_poster_data?.following_status ?
                                `Follow ${comment_poster_data.name}` :
                                (comment_poster_data?.following_status == 'accepted') ?
                                    `Unfollow ${comment_poster_data.name}` : 'Cancle follow request'}
                        </ListItemText>
                    </MenuItem>
                }
                {(userInfo.id != comment_poster_data?.id) &&
                    <MenuItem onClick={handleReportAction}>
                        <ListItemIcon>
                            <ReportGmailerrorredIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText>Report</ListItemText>
                    </MenuItem>
                }
                {(userInfo.id != comment_poster_data?.id) &&
                    <MenuItem onClick={() => { handleAction({ label: "Do you really want to block this user?", type: "BLOCK_USER", payload: comment_poster_data?.id }) }}>
                        <ListItemIcon>
                            <BlockIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText>Block</ListItemText>
                    </MenuItem>
                }
                {(userInfo.id == comment_poster_data?.id) &&
                    <MenuItem onClick={() => { handleAction({ label: "Do you want to delete your comment.", type: 'DELETE_COMMENT', payload: commentId }) }}>
                        <ListItemIcon>
                            <DeleteForeverIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>


                }
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

export default CommentActionBtn;