import { Box, Skeleton, Stack } from "@mui/material";



function LoadingComment() {
    return (
        <Box width={'100%'} p={1} sx={{ display: 'flex', gap: 1 }} border={1} borderColor={'divider'} borderRadius={2}>
            <Skeleton variant="circular" sx={{ width: { xs: '35px', sm: '45px' }, height: { xs: '35px', sm: '45px' } }} animation="wave" />
            <Box width={{ xs: 'calc(100% - 50px)', sm: 'calc(100% - 60px)' }} sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Skeleton variant="text" animation="wave" sx={{width:{xs:'120px',sm:'150px',md:'200px'}}}/>
                <Skeleton variant="text" animation="wave" height={'16px'} sx={{width:{xs:'100px',sm:'120px'}}}/>
                <Skeleton variant="text" animation="wave" height={'16px'} width={'90%'} sx={{mt:2}}/>
                <Skeleton variant="text" animation="wave" height={'16px'} width={'90%'}/>
                <Skeleton variant="text" animation="wave" height={'16px'} width={'20%'}/>
            </Box>
        </Box>
    )
}

export default LoadingComment;