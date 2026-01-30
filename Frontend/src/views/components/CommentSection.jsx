import { Box, Divider, Stack, Typography,Avatar,TextField, Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";


function CommentSection() {

    const [myComment,setMyComment] = useState('');
    const {userInfo} = useSelector(state=>state.auth);
    return (
        <>
            <Stack width={'100%'} p={1} direction={'column'} spacing={2}>
                <Divider sx={{ width: '100%' }} />
                <Box width={'100%'} px={1}>
                    <Typography variant="body1" fontSize={{ xs: '18px', sm: '24px' }} color="#fff" fontWeight={600}>
                        Comments
                    </Typography>

                </Box>
                <Divider sx={{ width: '100%' }} />
                <Stack direction="row" alignItems={'center'} spacing={1}>
                    <Avatar src={userInfo?.image} />
                    <TextField
                        variant="standard"
                        placeholder="Share your support..."
                        fullWidth
                        color="secondary"
                        value={myComment}
                        onChange={(e) => setMyComment(e.target.value)}
                        sx={{
                            '& input':{
                                fontSize:{xs:'14px',sm:'18px'}
                            }
                        }}
                    />
                    <Button color="secondary" variant="contained" sx={{textTransform:'none',borderRadius:"20px"}}>
                        Share
                    </Button>
                    
                </Stack>
                <Divider x={{ width: '100%' }}/>
            </Stack>
        </>
    )
}
export default CommentSection;