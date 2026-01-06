import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationFilledIcon from '@mui/icons-material/Notifications';
import NotificationOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ChatFilledIcon from '@mui/icons-material/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ExploreFilledIcon from '@mui/icons-material/Explore';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SettingOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SettingFilledIcon from '@mui/icons-material/Settings';
import ProfileFilledIcon from '@mui/icons-material/Person';
import ProfileOutlinedIcon from '@mui/icons-material/PersonOutline';



export const sidebarNavs = [
    {
        id:1,
        name:'Home',
        path:'/',
        activeIcon:<HomeFilledIcon/>,
        inactiveIcon:<HomeOutlinedIcon/>,
        badgeStyle:'dot',
        badgeColor:'info'
        
    },
    {
        id:2,
        name:'Messages',
        path:'/chats',
        activeIcon:<ChatFilledIcon/>,
        inactiveIcon:<ChatOutlinedIcon/>,
        badgeStyle:'standard',
        badgeColor:'secondary'
        
    },
    {
        id:3,
        name:'Explore',
        path:'/explore',
        activeIcon:<ExploreFilledIcon/>,
        inactiveIcon:<ExploreOutlinedIcon/>,
        badgeStyle:'standard',
        badgeColor:'secondary'
        
    },
    {
        id:4,
        name:'Notification',
        path:'/notification',
        activeIcon:<NotificationFilledIcon/>,
        inactiveIcon:<NotificationOutlinedIcon/>,
        badgeStyle:'standard',
        badgeColor:'secondary'
        
    },
    {
        id:5,
        name:'Profile',
        path:'/profile',
        activeIcon:<ProfileFilledIcon/>,
        inactiveIcon:<ProfileOutlinedIcon/>,
        badgeStyle:'standard',
        badgeColor:'secondary'
        
        
    },
    {
        id:6,
        name:'Settings',
        path:'/settings',
        activeIcon:<SettingFilledIcon/>,
        inactiveIcon:<SettingOutlinedIcon/>,
        badgeStyle:'dot',
        badgeColor:'info'
        
    }
]