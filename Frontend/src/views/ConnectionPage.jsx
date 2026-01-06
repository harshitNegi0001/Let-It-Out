import { Box, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";



function ConnectionPage() {

    const { listType } = useLocation()


    return (
        <>
            <Stack width={'100%'} height={"100%"} p={2}>
                <Stack width={'100%'} height={'100%'} pb={{ xs: '50px', sm: '10px' }} spacing={3} overflow={'scroll'}>
                    <Box width={'100%'} sx={{display:'flex',justifyContent:'center'}}>
                        <Typography variant="h5" >
                            {listType}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

        </>
    )
}

export default ConnectionPage;