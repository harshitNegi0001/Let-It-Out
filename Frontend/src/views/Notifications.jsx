import { Stack, Box, Typography, Divider, Button } from "@mui/material";




function Notifications() {
    return (
        <>
            <Stack direction={'column'} width={'100%'} p={2} height={'100%'} spacing={1} pb={'60px'}>
                <Typography variant="h6" component={'div'} width={'100%'} textAlign={'center'}>
                    Notifications
                </Typography>
                <Divider />
                <Stack width={'100%'} spacing={1} sx={{ overflowY: 'scroll' }} height={'calc(100% - 45px)'} >
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Typography variant="body2" fontSize={11} component={'span'} color="text.secondary">
                            This week
                        </Typography>
                        <Button fullWidth sx={{ p: 0, m: 0 }} color="secondary">
                            <Box width={'100%'} minHeight={'75px'} sx={{ display: 'flex', gap: 1, p: 1, alignItems: 'center' }}>
                                {true && <img src="" style={{ width: '50px', height: '50px', borderRadius: '25px' }}></img>}
                                <Box width={'calc(100% - 60px)'} height={'100%'} sx={{display:'flex'}} >
                                     <Typography variant="body1"  component={'div'} color="text.primary"><span style={{fontWeight:'bold'}}>Megatron</span> started following you.</Typography>
                                    
                                </Box>

                            </Box>
                        </Button>
                        <Button fullWidth sx={{ p: 0, m: 0 }} color="secondary">
                            <Box width={'100%'} minHeight={'75px'} sx={{ display: 'flex', gap: 1, p: 1, alignItems: 'center' }}>
                                {true && <img src="" style={{ width: '50px', height: '50px', borderRadius: '25px' }}></img>}
                                <Box width={'calc(100% - 60px)'} height={'100%'} sx={{display:'flex'}} >
                                     <Typography variant="body1"  component={'div'} color="text.primary"><span style={{fontWeight:'bold'}}>Megatron</span> started following you.</Typography>
                                    
                                </Box>

                            </Box>
                        </Button>
                        <Button fullWidth sx={{ p: 0, m: 0 }} color="secondary">
                            <Box width={'100%'} minHeight={'75px'} sx={{ display: 'flex', gap: 1, p: 1, alignItems: 'center' }}>
                                {true && <img src="" style={{ width: '50px', height: '50px', borderRadius: '25px' }}></img>}
                                <Box width={'calc(100% - 60px)'} height={'100%'} sx={{display:'flex'}} >
                                     <Typography variant="body1"  component={'div'} color="text.primary"><span style={{fontWeight:'bold'}}>Megatron</span> started following you.</Typography>
                                    
                                </Box>

                            </Box>
                        </Button>

                    </Box>
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Typography variant="body2" fontSize={11} component={'span'} color="text.secondary">
                            This week
                        </Typography>
                        <Button fullWidth sx={{ p: 0, m: 0 }} color="secondary">
                            <Box width={'100%'} minHeight={'75px'} sx={{ display: 'flex', gap: 1, p: 1, alignItems: 'center' }}>
                                {true && <img src="" style={{ width: '50px', height: '50px', borderRadius: '25px' }}></img>}
                                <Box width={'calc(100% - 60px)'} height={'100%'} sx={{display:'flex'}} >
                                     <Typography variant="body1"  component={'div'} color="text.primary"><span style={{fontWeight:'bold'}}>Megatron</span> started following you.</Typography>
                                    
                                </Box>

                            </Box>
                        </Button>
                        <Button fullWidth sx={{ p: 0, m: 0 }} color="secondary">
                            <Box width={'100%'} minHeight={'75px'} sx={{ display: 'flex', gap: 1, p: 1, alignItems: 'center' }}>
                                {true && <img src="" style={{ width: '50px', height: '50px', borderRadius: '25px' }}></img>}
                                <Box width={'calc(100% - 60px)'} height={'100%'} sx={{display:'flex'}} >
                                     <Typography variant="body1"  component={'div'} color="text.primary"><span style={{fontWeight:'bold'}}>Megatron</span> started following you.</Typography>
                                    
                                </Box>

                            </Box>
                        </Button>
                        <Button fullWidth sx={{ p: 0, m: 0 }} color="secondary">
                            <Box width={'100%'} minHeight={'75px'} sx={{ display: 'flex', gap: 1, p: 1, alignItems: 'center' }}>
                                {true && <img src="" style={{ width: '50px', height: '50px', borderRadius: '25px' }}></img>}
                                <Box width={'calc(100% - 60px)'} height={'100%'} sx={{display:'flex'}} >
                                     <Typography variant="body1"  component={'div'} color="text.primary"><span style={{fontWeight:'bold'}}>Megatron</span> started following you.</Typography>
                                    
                                </Box>

                            </Box>
                        </Button>

                    </Box>
                </Stack>
            </Stack>
        </>
    )
}
export default Notifications;