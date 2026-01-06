;import { lazy } from "react";

const Login = lazy(()=>import('../../pages/auth/Login.jsx'));
const NewUserSetup = lazy(()=>import('../../pages/auth/NewUserSetup.jsx'));
const DeactiveAccount = lazy(()=>import('../../pages/auth/DeactiveAccount.jsx'));



export const publicRoutes = [
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/new-user-setup',
        element:<NewUserSetup/>
    },
    {
        path:'/deactive-account',
        element:<DeactiveAccount/>
    },
]