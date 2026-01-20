import { useSelector } from 'react-redux';
import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Stack } from '@mui/material';


function ProtectedRoute({ route, children }) {
    const { isLoading, userInfo } = useSelector(state => state.auth);
    const isNewUser = Boolean(userInfo&&!userInfo?.username);
    const isDeactiveAccount = userInfo?.acc_status == 'deactive';
    if (isLoading) {
        return <Stack direction={'row'} justifyContent={'center'} width={'100%'} p={3}><CircularProgress color='secondary' size={'40px'}/></Stack>
    }
    if(isNewUser){
        return <Navigate to={'/new-user-setup'} replace />
    }
    if(isDeactiveAccount){
        return <Navigate to={'/deactive-account'} replace />
    }
    if (userInfo) {
        return <Suspense fallback={null}>{children}</Suspense>
    } else {
        if (route.needAuth) {

            return <Navigate to={'/login'} replace />
        } else {
            
            return <Suspense fallback={null}>{children}</Suspense>
        }
    }

}

export default ProtectedRoute;