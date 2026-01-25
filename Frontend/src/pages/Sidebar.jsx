import { Avatar, Backdrop, Badge, Box, Button, Divider, Drawer, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from "@mui/material";
import appLogo from '../assets/letitout_logo.png';
import { sidebarNavs } from "../navigation/sidebarNav";
import { useLocation, useNavigate } from "react-router-dom";
import OptionIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import AddAccountIcon from '@mui/icons-material/PersonAdd';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authReducer/authReducer";

function Sidebar() {
    const { pathname } = useLocation();
    const {userInfo,isLoading} =useSelector(state=>state.auth);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openBackdrop,setOpenBackdrop] =useState(false);
    const openMenu = Boolean(anchorEl);
    const dispatch = useDispatch();
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleCloseMenu = () => {
        setAnchorEl(null);
    }
    const handleLogout = async()=>{
        setAnchorEl(null);
        setOpenBackdrop(true);
    }
    const handleCloseBackdrop =()=>{
        document.activeElement?.blur();
        setOpenBackdrop(false);
    }
    return (
        <Drawer variant='permanent' open sx={{ width: 240, height: '100vh' }}>

            <Stack bgcolor={'primary.main'} gap={2} height={'100%'} alignItems={'center'} width={240} position={'relative'} >
                <Box width={'100%'} height={100} alignItems={'center'} display={'flex'} marginTop={'8px'} flexDirection={'column'} justifyContent={'center'}>
                    <img src={appLogo} alt="" style={{ width: '60px' }} />
                    <Typography variant="h6" component={'div'} color="text.primary" fontFamily={'Winky Rough'} textTransform={'uppercase'}>Let It Out</Typography>
                </Box>
                <Divider orientation='horizontal' sx={{ width: '100%' }} />
                <Stack width={'100%'} height={'calc(100% - 210px)'} sx={{ overflowY: 'auto', scrollbarWidth: 'none' }} p={3} spacing={1}>

                    {
                        sidebarNavs.map((nav) => <Button key={nav.id} onClick={() => navigate(nav.path)} color={`${pathname === nav.path ? 'secondary' : 'text.primary'}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', fontSize: '16px' }} startIcon={<Badge variant={nav.badgeStyle} color={nav.badgeColor} badgeContent={nav.path != pathname ? 0 : 0}>{nav.activeIcon}</Badge>}  >{nav.name}</Button>)
                    }
                </Stack>
                <Box display={'flex'} gap={1} zIndex={1} width={'100%'} height={60} flexDirection={'row'} justifyContent={'center'} alignItems={"center"} position={'absolute'} bottom={0} p={'0px 15px'} bgcolor={'primary.main'}>
                    <Avatar sx={{ width: '35px', height: '35px', bgcolor: 'secondary.light' }}>
                        {userInfo?.image?<img src={userInfo?.image} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="" />:null}
                    </Avatar>
                    <Stack height={'45px'} width={'calc(100% - 65px)'} >
                        <Typography variant="body1" color="text.primary" component={'span'} textOverflow={'ellipsis'} overflow={"hidden"} noWrap>{userInfo?.name}</Typography>
                        <Typography variant="body2" color="text.secondary" component={'span'} textOverflow={'ellipsis'} overflow={"hidden"} noWrap>{userInfo?.email}</Typography>

                    </Stack>
                    <IconButton size="small" onClick={handleOpenMenu} id="">
                        <OptionIcon />
                    </IconButton>

                </Box>
                <Menu open={openMenu} anchorEl={anchorEl} onClose={handleCloseMenu}>
                    <MenuList dense>
                        <MenuItem onClick={handleLogout} >

                            
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText>Log out</ListItemText>
                            

                        </MenuItem>
                        {/* <MenuItem onClick={handleCloseMenu} >
                            <ListItem >
                                <ListItemIcon>
                                    <AddAccountIcon />
                                </ListItemIcon>
                                <ListItemText>Add Another Account</ListItemText>
                            </ListItem>

                        </MenuItem> */}
                    </MenuList>
                </Menu>
            </Stack>
            <Backdrop sx={{zIndex:99}} open={openBackdrop} onClick={()=>setOpenBackdrop(false)}>
                    <Box width={'280px'} onClick={(e)=>e.stopPropagation()}  bgcolor={'primary.light'}  borderRadius={2} display={'flex'} flexDirection={'column'} gap={2} p={2}>
                            <Box width={'100%'} >
                                <Typography variant="body1" component={'div'}>Are you sure to logout</Typography>
                            </Box>
                            <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>
                               
                                <Button variant="text" color="secondary" onClick={handleCloseBackdrop}>Cancle</Button> 
                                <Button variant="contained" color="error" loading={isLoading} onClick={ ()=> dispatch(logout())}>Confirm</Button>
                            </Box>
                    </Box>
            </Backdrop>

        </Drawer>
    )
}

export default Sidebar;