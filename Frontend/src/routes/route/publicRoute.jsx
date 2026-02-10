import { lazy } from "react";

const Login = lazy(() => import('../../pages/auth/Login.jsx'));
const NewUserSetup = lazy(() => import('../../pages/auth/NewUserSetup.jsx'));
const DeactiveAccount = lazy(() => import('../../pages/auth/DeactiveAccount.jsx'));
const PageNotFound = lazy(() => import("../../pages/PageNotFound.jsx"));
const ForgotPassword = lazy(() => import("../../pages/auth/ForgotPassword.jsx"));



export const publicRoutes = [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/new-user-setup',
        element: <NewUserSetup />
    },
    {
        path: '/deactive-account',
        element: <DeactiveAccount />
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '*',
        element: <PageNotFound />
    },
]