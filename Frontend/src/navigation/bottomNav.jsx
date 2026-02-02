import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatFilledIcon from '@mui/icons-material/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ExploreFilledIcon from '@mui/icons-material/Explore';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SettingOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SettingFilledIcon from '@mui/icons-material/Settings';



export const BottomNavs = [
    {
        id:1,
        name:'Home',
        path:'/',
        activeIcon:<HomeFilledIcon/>,
        inactiveIcon:<HomeOutlinedIcon/>,
        badgeStyle:'dot',
        badgeColor:'info',
        key:'home'
        
    },
    {
        id:2,
        name:'Explore',
        path:'/explore',
        activeIcon:<ExploreFilledIcon/>,
        inactiveIcon:<ExploreOutlinedIcon/>,
        badgeStyle:'standard',
        badgeColor:'secondary',
        key:'explore'
        
    },
    
    {
        id:3,
        name:'Messages',
        path:'/chats',
        activeIcon:<ChatFilledIcon/>,
        inactiveIcon:<ChatOutlinedIcon/>,
        badgeStyle:'standard',
        badgeColor:'secondary',
        key:'chat'
        
        
    },
    {
        id:4,
        name:'Settings',
        path:'/settings',
        activeIcon:<SettingFilledIcon/>,
        inactiveIcon:<SettingOutlinedIcon/>,
        badgeStyle:'dot',
        badgeColor:'info',
        key:'setting'
        
    }
]