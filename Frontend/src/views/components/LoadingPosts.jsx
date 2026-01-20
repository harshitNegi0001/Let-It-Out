import { Box, Skeleton, Stack } from "@mui/material"



function LoadingPost() {

    return (
        <>
            <Box width={'100%'} mt={2} borderRadius={3} overflow={'hidden'} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Stack direction={'row'} width={'100%'} spacing={2} boxSizing={'border-box'} p={1} justifyContent={'start'} bgcolor={'#42424250'} alignItems={'center'}>
                    <Box width={{ xs: '40px', sm: '55px' }} height={{ xs: '40px', sm: '55px' }} overflow={'hidden'} borderRadius={'30px'} >
                        <Skeleton animation="wave" variant="circular" width={'100%'} height={'100%'} />


                    </Box>
                    <Stack spacing={'4px'} width={'calc(100% - 70px)'} >
                        <Skeleton animation="wave" variant="text" width={'40%'} sx={{ minWidth: '60px', maxWidth: '150px' }} />
                        <Skeleton animation="wave" variant="text" width={'30%'} sx={{ minWidth: '40px', maxWidth: '120px' }} />

                    </Stack>
                </Stack>
                <Box width={'100%'} pt={'4px'} sx={{ display: 'flex', flexDirection: 'column', aspectRatio: '2' }}>
                    <Skeleton animation="wave" variant="rectangle" width={'100%'} height={'100%'} />
                </Box>
            </Box>
        </>
    )
}

export default LoadingPost