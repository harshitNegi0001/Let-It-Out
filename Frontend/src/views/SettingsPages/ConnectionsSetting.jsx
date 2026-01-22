import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HeartBrokenIcon from '@mui/icons-material/HeartBrokenOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverOutlined';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const settingOption = [
    {
        id: 1,
        name: "Blocked Accounts",
        desc: "Manage the accounts you've blocked",
        icon: <BlockIcon />,
        path: '/settings/connections/blocked'

    },
    {
        id: 2,
        name: "Account visitors",
        desc: "See who’s viewing your profile",
        icon: <VisibilityIcon />,
        path: '/settings/connections/account-visitors'

    },
    {
        id: 4,
        name: "Recent searches",
        desc: "Searches you’ve made recently",
        icon: <HistoryIcon />,
        path: "/settings/connections/recent-searches"
    }
    
];

function ConnectionsSetting() {


    const navigate = useNavigate();


    return (
        <>
            <Stack width={'100%'} height={"100%"} p={{xs:1,sm:2}}>
                <Stack width={'100%'} height={'100%'} pb={{ xs: '50px', sm: '10px' }} spacing={3} overflow={'scroll'}>
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start' }}>

                        <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton onClick={() => navigate('/settings')} size="small">
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" component={'div'} color="text.main" fontWeight={'600'}>
                                Connections & Visibility
                            </Typography>
                        </Box>
                        <Typography variant="body2" component={'div'} fontSize={{ xs: '11px', sm: '14px' }} color="text.secondary" >
                            See who's viewing your profile and manage who can interact with or find you.
                        </Typography>
                    </Box>
                    <Stack width={'100%'} spacing={1}>
                        {
                            settingOption.map(opt => <Button onClick={() => navigate(opt.path)} key={opt.id} fullWidth color="secondary" sx={{ height: '65px' }}>
                                <Box width={'100%'} height={'100%'} sx={{ display: 'flex', color: '#fff', alignItems: 'center', p: 1, justifyContent: 'space-between' }}>
                                    {opt.icon}
                                    <Box width={"calc(100% - 100px)"} sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'start', justifyContent: 'center' }}>
                                        <Typography variant="body1" textAlign={'start'} width={'100%'} textOverflow={'ellipsis'} noWrap fontSize={{ xs: '13px', sm: '17px' }}>
                                            {opt.name}
                                        </Typography>
                                        <Typography variant="body2" textAlign={'start'} color="text.secondary" textOverflow={'ellipsis'} width={'100%'} noWrap fontSize={{ xs: '10px', sm: '13px' }}>
                                            {opt.desc}
                                        </Typography>

                                    </Box>
                                    <ArrowForwardIosOutlinedIcon />
                                </Box>
                            </Button>)
                        }
                    </Stack>
                </Stack>

            </Stack>

        </>
    )
}

export default ConnectionsSetting;