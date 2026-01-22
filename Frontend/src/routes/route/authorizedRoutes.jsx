import { lazy } from "react";


const Home = lazy(()=>import('../../views/Home.jsx'));
const Messages = lazy(()=>import('../../views/Messages.jsx'));
const Explore = lazy(()=>import('../../views/Explore.jsx'));
const Notifications = lazy(()=>import('../../views/Notifications.jsx'));
const Profile = lazy(()=>import('../../views/Profile.jsx'));
const Settings = lazy(()=>import('../../views/Settings.jsx'));
const EditProfile = lazy(()=>import('../../views/EditProfile.jsx'));
const AccountSetting = lazy(()=>import('../../views/SettingsPages/AccountSetting.jsx'));
const ConnectionsSetting = lazy(()=>import('../../views/SettingsPages/ConnectionsSetting.jsx'));
const PrivacySetting = lazy(()=>import('../../views/SettingsPages/PrivacySetting.jsx'));
const ActivityPage = lazy(()=>import('../../views/SettingsPages/ActivityPage.jsx'));
const AccInfo = lazy(()=>import('../../views/SettingsPages/AccInfo.jsx'));
const ChangePass = lazy(()=>import('../../views/SettingsPages/ChangePass.jsx'));
const DeleteAccount = lazy(()=>import('../../views/SettingsPages/DeleteAccount.jsx'));
const DeactivateAccount = lazy(()=>import('../../views/SettingsPages/DeactivateAccount.jsx'));
const VisitProfile = lazy(()=>import('../../views/VisitProfile.jsx'));
const SearchPage = lazy(()=>import('../../views/SearchPage.jsx'));
const PostsActivityPage = lazy(()=>import('../../views/SettingsPages/PostsActivityPage.jsx'));





export const authorizedRoutes=[
    {
        path:'/',
        element:<Home/>,
        needAuth:true
    },
    {
        path:'/chats',
        element:<Messages/>,
        needAuth:true
    },
    {
        path:'/chats/:username',
        element:<Messages/>,
        needAuth:true
    },
    {
        path:'/explore',
        element:<Explore/>,
        needAuth:true
    },
    {
        path:'/search/:query',
        element:<SearchPage/>,
        needAuth:true
    },
    {
        path:'/search',
        element:<SearchPage/>,
        needAuth:true
    },
    {
        path:'/notification',
        element:<Notifications/>,
        needAuth:true
    },
    {
        path:'/profile',
        element:<Profile/>,
        needAuth:true
    },
    {
        path:'/profile/:username',
        element:<VisitProfile/>,
        needAuth:true
    },
    {
        path:'/settings',
        element:<Settings/>,
        needAuth:true
    },
    {
        path:'/edit-profile',
        element:<EditProfile/>,
        needAuth:true
    },
    {
        path:'/settings/privacy_and_safety',
        element:<PrivacySetting/>,
        needAuth:true
    },
    {
        path:'/settings/connections',
        element:<ConnectionsSetting/>,
        needAuth:true
    },
    {
        path:'/settings/account',
        element:<AccountSetting/>,
        needAuth:true
    },
    {
        path:'/settings/my-activity',
        element:<ActivityPage/>,
        needAuth:true
    },
    {
        path:'/settings/my-activity/:required_type',
        element:<PostsActivityPage/>,
        needAuth:true
    },
    {
        path:'/settings/account/info',
        element:<AccInfo/>,
        needAuth:true
    },
    {
        path:'/settings/change-password',
        element:<ChangePass/>,
        needAuth:true
    },
    {
        path:'/settings/deactivate-acc',
        element:<DeactivateAccount/>,
        needAuth:true
    },
    {
        path:'/settings/account/delete-permanent',
        element:<DeleteAccount/>,
        needAuth:true
    }
    
];