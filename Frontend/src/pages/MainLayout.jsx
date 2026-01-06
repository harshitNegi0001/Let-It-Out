import { Badge, BottomNavigation, BottomNavigationAction, Box, Divider, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavs } from "../navigation/bottomNav";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import MuiAppbar from "./MuiAppbar";
import LayoutExplore from "./LayoutExplore";
function MainLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(pathname);
    const handleTabs = (_, newValue) => {
        setActiveTab(newValue);
    }
    return (
        <>
            <Stack direction={'row'} spacing={0}>

                <Box display={{ xs: 'none', sm: 'block' }}><Sidebar /></Box>


                <Stack width={{ xl: 'calc(100vw - 680px)', lg: 'calc(100vw - 590px)', md: 'calc( 100vw - 530px)', xs: '100vw' }} height={'100vh'} position={'relative'}>
                    <MuiAppbar />
                    <Outlet />
                    <BottomNavigation sx={{ display: { xs: 'flex', sm: 'none' }, bgcolor: 'primary.dark', position: 'absolute', bottom: 0, width: '100%', '& .MuiBottomNavigationAction-root.Mui-selected': { color: 'secondary.main' } }} showLabels value={activeTab} onChange={handleTabs}>
                        {BottomNavs.map((nav) => <BottomNavigationAction key={nav.id} label={nav.name} value={nav.path} icon={<Badge variant={nav.badgeStyle} color={nav.badgeColor} badgeContent={(activeTab == nav.path) ? 0 : 2}>{nav.activeIcon}</Badge>} onClick={() => navigate(nav.path)} />)}

                    </BottomNavigation>
                </Stack>
                <Divider orientation="vertical" sx={{ height: '100vh', display: { xs: 'none', md: 'flex' } }} />
                <Stack width={{ xl: '440px', lg: '350px', md: '280px' }} height={'100vh'} display={{ xs: 'none', md: 'flex' }}>
                    <LayoutExplore />
                </Stack>
            </Stack>
        </>
    )
}

export default MainLayout;