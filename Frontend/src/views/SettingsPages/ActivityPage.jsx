import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import HistoryIcon from '@mui/icons-material/History';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const settingOption = [
    {
        id: 1,
        name: "Liked posts",
        desc: "Posts you’ve liked",
        icon: <FavoriteBorderIcon />,
        path: "/settings/my-activity/liked-posts"
    },
    {
        id: 2,
        name: "Interacted posts",
        desc: "Posts you’ve commented on or reacted to",
        icon: <ChatBubbleOutlineIcon />,
        path: "/settings/my-activity/interacted-posts"
    },
    {
        id: 3,
        name: "Saved posts",
        desc: "Posts you’ve saved for later",
        icon: <BookmarksOutlinedIcon />,
        path: "/settings/my-activity/saved-posts"
    },
    {
        id: 4,
        name: "Shared posts",
        desc: "Posts you’ve shared with others",
        icon: <RepeatIcon />,
        path: "/settings/my-activity/shared-posts"
    },
    {
        id: 5,
        name: "Reported posts",
        desc: "Posts you’ve reported",
        icon: <ReportOutlinedIcon />,
        path: "/settings/my-activity/reported-posts"
    },
    {
        id: 6,
        name: "Not interested posts",
        desc: "Posts you’ve hidden or marked as not interested",
        icon: <ThumbDownOffAltIcon />,
        path: "/settings/my-activity/not-interested-posts"
    }
]

function ActivityPage (){
    
    const navigate = useNavigate();


    return(
        <>
            <Stack width={'100%'} height={"100%"}  p={{xs:1,sm:2}} pb={{xs:'60px',sm:'16px'}}  spacing={3} overflow={'scroll'}>
                
                    <Box width={'100%'} sx={{display:'flex',flexDirection:'column',gap:1,alignItems:'start'}}>
                        
                        <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton onClick={() => navigate('/settings')} size="small">
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" component={'div'} color="text.main" fontWeight={'600'}>
                                Your Activity
                            </Typography>
                        </Box>
                        <Typography variant="body2" component={'div'} fontSize={{xs:'11px',sm:'14px'}} color="text.secondary" >
                            Track and manage your activity across the platform, including interactions, history, and usage.
                        </Typography>
                    </Box>
                    <Stack width={'100%'} spacing={1}>
                        {
                            settingOption.map(opt=><Button onClick={()=>navigate(opt.path)} key={opt.id} fullWidth color="secondary" sx={{height:'65px'}}>
                                <Box width={'100%'} height={'100%'} sx={{display:'flex',color:'#fff',alignItems:'center',p:1,justifyContent:'space-between'}}>
                                    {opt.icon}
                                    <Box width={"calc(100% - 100px)"} sx={{display:'flex',flexDirection:'column',gap:'5px',alignItems:'start',justifyContent:'center'}}>
                                        <Typography variant="body1" textAlign={'start'} width={'100%'} textOverflow={'ellipsis'} noWrap fontSize={{xs:'13px',sm:'17px'}}>
                                            {opt.name}
                                        </Typography>
                                        <Typography variant="body2" textAlign={'start'} color="text.secondary" textOverflow={'ellipsis'} width={'100%'} noWrap fontSize={{xs:'10px',sm:'13px'}}>
                                            {opt.desc}
                                        </Typography>

                                    </Box>
                                    <ArrowForwardIosOutlinedIcon/>
                                </Box>
                            </Button>)
                        }
                    </Stack>
                

            </Stack>
        
        </>
    )
}

export default ActivityPage;