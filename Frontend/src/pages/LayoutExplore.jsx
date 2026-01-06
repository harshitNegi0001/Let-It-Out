import { Box, Button, Divider, IconButton, InputBase, Stack, TextField, Typography } from "@mui/material";
import SearchButtonIcon from '@mui/icons-material/Search';


function LayoutExplore() {

    return (

        <>
            <Stack direction={'column'} width={'100%'} spacing={2} p={2}>
                <Box width={'100%'} >
                    <Typography variant='body1' color="text.primary" component={'div'}>Search People</Typography>
                </Box>
                <Stack direction={'column'}minHeight={'100px'}  width={'100%'} spacing={2}>


                    <form action="">
                        <Box width={'100%'} p={1} height={'45px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderRadius: 1 }} bgcolor={'primary.light'}>


                            <InputBase variant='outlined' size="small" sx={{ width: '250px' }} placeholder="Search user..." />
                            <Divider orientation='vertical' />
                            <IconButton size="small">
                                <SearchButtonIcon />
                            </IconButton>
                        </Box>
                    </form>
                    <Stack direction={'column'} sx={{ overflowY: 'scroll' }}  maxHeight={'400px'} spacing={1}>
                        {/* {[1, 2, 3, 4,5,6,7,8].map(i => <Button key={i} color="secondary" fullWidth sx={{ p: 0, m: 0 }}>


                            <Box width={'100%'} p={1} height={'55px'} gap={1} sx={{ display: 'flex', alignItems: 'center' }} >
                                <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1757039196/q0zlysytj3lkcieki5mh.png" style={{ height: '100%', aspectRatio: '1', borderRadius: '25px' }} alt="" />
                                <Box width={'calc(100% - 60px)'} height={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                                    <Typography variant="body1" textAlign={'start'} noWrap textOverflow={'ellipsis'} width={'100%'} component={'div'} >
                                        MEGATRON
                                    </Typography>
                                    <Typography variant="body2" fontSize={10} color="text.secondary" textAlign={'start'} noWrap textOverflow={'ellipsis'} width={'100%'} component={'div'} >
                                        megatron@001
                                    </Typography>
                                </Box>

                            </Box>
                        </Button>)} */}
                    </Stack>
                </Stack>
                <Divider />
                <Box width={'100%'} >
                    <Typography variant='body1' color="text.primary" component={'div'}>Top trending</Typography>
                </Box>
            </Stack>
        </>
    )
}

export default LayoutExplore;