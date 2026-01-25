import { Backdrop, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import DoneIcon from '@mui/icons-material/Done';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getChatsActions } from "../../utils/chatActions";
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";



function ChatOptionsComponent({ userData, getUserData }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatOptions, setChatOptions] = useState([]);
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



    useEffect(() => {
        if (userData) {
            setChatOptions([...getChatsActions(userData?.id, userData?.is_blocked)]);
        }

    }, [userData]);

    const handleMenuChange = (event) => {
        setAnchorEl(event.currentTarget);
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
            case 'BLOCK_USER':
                blockUser();
                break;
            case 'REPORT_USER':
            // reportUser();
        }
    }

    const blockUser = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/api/block-user`,
                {
                    blocked_id: actionData.payload,
                    operation: (userData?.is_blocked) ? 'unblock' : 'block'
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            )

            setIsLoading(false);
            dispatch(setState({ success: result?.data?.message }));
            cancleAction();
            getUserData();



        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something Went Wrong.' }));
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

    const handleCloseMenu = () => {
        document.activeElement?.blur();
        setAnchorEl(null);

    }


    return (
        <>
            <IconButton size="small" onClick={handleMenuChange} id="user-chatting-options-btn" aria-haspopup='true' aria-expanded={openMenu ? 'true' : undefined} aria-controls={openMenu ? 'user-chatting-option-menu' : undefined}> <MoreHorizIcon sx={{ color: 'text.primary' }} /> </IconButton>
            <Menu id="user-chatting-option-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu} slotProps={{ list: { 'aria-labelledby': 'user-chatting-options-btn' } }}>
                {chatOptions.map(o => <MenuItem key={o.id} onClick={() => handleAction({ label: o.label, type: o.type, payload: o.payload })}>
                    <ListItemIcon>
                        {o.icon}
                    </ListItemIcon>
                    <ListItemText>{o.content}</ListItemText>
                </MenuItem>)}
                <MenuItem key={'open-profile'} onClick={() => navigate(`/profile/${userData?.username}`)}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Go to Profile</ListItemText>
                </MenuItem>

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

export default ChatOptionsComponent;