import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack, Box, Skeleton, IconButton, Button, Divider, Avatar, Typography, Chip, Menu, MenuItem, ListItemIcon, ListItemText, Backdrop } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setState } from '../../store/authReducer/authReducer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';



function BlockedUsers() {
    const [usersList, setUsersList] = useState([]);
    const [loadingBtn, setLoadinBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionData, setActionData] = useState({
        backdropOpen: false,
        label: '',
        payload: ''
    });

    const open = Boolean(anchorEl);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        getUserList();

    }, []);

    const getUserList = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(
                `${backend_url}/api/get-my-blocked-acc`,
                { withCredentials: true }
            );

            setIsLoading(false);
            setUsersList(result?.data?.usersList);
        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something Went Wrong!' }));
        }
    }

    const unblockUser = async () => {
        try {
            setLoadinBtn(true);
            const result = await axios.post(
                `${backend_url}/api/block-user`,
                {
                    blocked_id: actionData?.payload,
                    operation: 'unblock'
                },
                { withCredentials: true }
            );
            const filterList = usersList.filter(u => u.user_id != actionData.payload);
            setUsersList(filterList)
            setLoadinBtn(false);
            cancleAction();
        } catch (err) {
            setLoadinBtn(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something Went Wrong!' }));
        }
    }

    const handleMenuChange = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleCloseMenu = () => {
        document.activeElement?.blur();
        setAnchorEl(null);

    }
    const handleAction = (data) => {
        setActionData({
            backdropOpen: true,
            label: data.label,
            payload: data.payload
        });
        handleCloseMenu();

    }
    const cancleAction = () => {
        document.activeElement?.blur();

        setActionData({
            backdropOpen: false,
            label: '',
            payload: ''
        });
    }
    return (
        <>

            <Stack width={'100%'} height={'100%'} overflow={'scroll'} p={{ xs: 1, sm: 2 }} pb={{ xs: '60px', sm: '10px' }} spacing={2} >
                <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start' }}>
                    <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton onClick={() => navigate(`/settings/connections/`)} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Box width={'calc(100% - 70px)'} sx={{ display: 'flex', flexDirection: 'column' }}>

                            <Typography variant="body1" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '16px', sm: '22px' }} fontWeight={'500'} color="#fff" >
                                Blocked Accounts
                            </Typography>
                            <Typography variant="body2" width={'100%'} noWrap textOverflow={'ellipsis'} fontSize={{ xs: '12px', sm: '15px' }} color="text.secondary" >
                                Manage the accounts you've blocked.
                            </Typography>
                        </Box>

                    </Box>
                    <Divider sx={{ width: '100%' }} />

                    {isLoading && [1, 2, 3, 4, 5].map((i) => <Box width={'97%'} key={i} p={1} sx={{ display: 'flex', gap: 1 }}>
                        <Box width={'50px'} height={'50px'}>
                            <Skeleton variant='circular' width={'100%'} animation="wave" height={'100%'} />
                        </Box>
                        <Box width={'calc(100% - 120px)'} maxWidth={'450px'} sx={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                            <Skeleton width={'100%'} animation="wave" height={'24px'} />
                            <Skeleton width={'80%'} animation="wave" height={'15px'} />

                        </Box>

                    </Box>)}


                </Box>

                {
                    usersList.map((u) =>
                        <Box key={u.id} width={'100%'} p={'4px'} height={{ xs: '60px', sm: '70px' }} onClick={() => navigate(`/profile/${u?.username}`)} sx={{ display: 'flex', gap: 1, alignItems: 'center', '&:hover': { bgcolor: '#10151f38' }, '&:active': { bgcolor: '#1f2c4938' }, borderRadius: 3 }} >
                            <Box height={'100%'} sx={{ aspectRatio: 1 }} >
                                <Avatar sx={{ width: '100%', height: '100%' }}>
                                    {u?.image && <img src={u?.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />}
                                </Avatar>

                            </Box>
                            <Box width={{ xs: 'calc(100% - 100px)', sm: 'calc(100% - 120px)' }} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body1" width={'100%'} textAlign={'start'} noWrap color="#fff" textOverflow={'ellipsis'} fontSize={{ xs: '14px', sm: '18px' }} >
                                    {u?.name}
                                </Typography>
                                <Typography variant="body1" width={'100%'} textAlign={'start'} color="text.secondary" noWrap textOverflow={'ellipsis'} fontSize={{ xs: '10px', sm: '14px' }} >
                                    @{u?.username}
                                </Typography>

                            </Box>
                            <Box width={'40px'} height={'40px'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                                <IconButton size='small' onClick={handleMenuChange} id="unblock-menu-btn" aria-haspopup='true' aria-expanded={open ? 'true' : undefined} aria-controls={open ? 'unblock-menu' : undefined}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu id="unblock-menu" anchorEl={anchorEl} open={open} onClose={handleCloseMenu} slotProps={{ list: { 'aria-labelledby': 'unblock-menu-btn' } }}>
                                    <MenuItem onClick={() => handleAction({ label: 'Are you sure to unblock user', payload: u.user_id })} >
                                        <ListItemIcon>
                                            <BlockIcon fontSize='small' />
                                        </ListItemIcon>
                                        <ListItemText primary={<Typography variant='body2' fontSize={{ xs: "14px", sm: '16px' }} color='#fff'>Unblock</Typography>} />
                                    </MenuItem>
                                </Menu>
                            </Box>


                        </Box>


                    )
                }
                {
                    !isLoading && usersList.length == 0 &&
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box width={'90%'} maxWidth={{ xs: '280px', sm: '380px' }}>
                            <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1770032853/vrofirmyd8kdtpkgbx8y.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                        </Box>
                        <Typography width={'100%'} textAlign={'center'} variant="body1" color="#fff" fontSize={{ xs: '18px', sm: '24px' }} fontWeight={'500'}>
                            No blocked user
                        </Typography>
                        <Typography width={'100%'} textAlign={'center'} variant="body2" color="text.secondary" fontSize={{ xs: '10px', sm: '14px' }} fontWeight={'300'}>
                            Your blocked users list is empty.
                        </Typography>

                    </Box>

                }
                {actionData?.backdropOpen && <Backdrop open={actionData?.backdropOpen} onClick={cancleAction} sx={{ zIndex: 9999 }}>
                    <Box width={'280px'} onClick={(e) => e.stopPropagation()} bgcolor={'primary.light'} borderRadius={2} display={'flex'} flexDirection={'column'} gap={2} p={2}>
                        <Box width={'100%'} >
                            <Typography variant="body1" component={'div'}>{actionData?.label}</Typography>
                        </Box>
                        <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>

                            <Button variant="text" sx={{ color: '#fff' }} disabled={loadingBtn} onClick={cancleAction}><ClearIcon /></Button>
                            <Button variant="contained" color="error" loading={loadingBtn} onClick={unblockUser}><DoneIcon /></Button>
                        </Box>
                    </Box>
                </Backdrop>}

            </Stack>

        </>
    )
}

export default BlockedUsers;