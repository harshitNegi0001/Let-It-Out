import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";



function PageNotFound() {

    return (
        <>
            <Stack width={'100vw'} height={'100vh'} spacing={1} sx={{ justifyContent: "center", alignItems: "center", p: 1 }}>
                <Box width={'100%'} maxWidth={{ xs: '300px', sm: '450px' }}>
                    <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1768114434/nbbj6vdpb8rahvsejoiz.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />
                </Box>
                <Box width={'100%'} >
                    <Typography fontSize={{ xs: "25px", sm: '36px' }} fontWeight={'bold'} width={'100%'} color="#7f769e" textAlign={'center'}>
                        Page Not Found
                    </Typography>
                    <Typography fontSize={{ xs: "12px", sm: '16px' }} fontWeight={400} width={'100%'} color="#58526d" textAlign={'center'}>
                        Sorry, The page you're looking for doesn't exists.
                    </Typography>
                </Box>
                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography fontSize={{ xs: "12px", sm: '16px' }} fontWeight={400} width={'100%'} color="#b8b7bb" textAlign={'center'}>
                        Go back <Link  to={'/'}>Home</Link>
                    </Typography>

                </Box>
            </Stack>
        </>
    )
}

export default PageNotFound;