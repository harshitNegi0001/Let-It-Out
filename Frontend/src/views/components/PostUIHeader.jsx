import { Stack, Box, Typography, Avatar} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { timeCount } from "../../utils/formatDateTime";
import { moods } from "../../utils/moods";
import PostOptionsComponent from "./PostOptionsComponent";



function PostUIHeader({ followed = false,userData, postData,setHidePost }) {


    const navigate = useNavigate();
    
    
    
    
    


    return (
        <>
            <Stack direction={'row'} width={'100%'} boxSizing={'border-box'} p={1} justifyContent={'space-between'} bgcolor={'primary.dark'} sx={{borderRadius:2}} alignItems={'center'}>
                <Stack direction={'row'} spacing={1} alignItems={'center'} width={'calc(100% - 40px)'}>
                    <Box width={{ xs: '40px', sm: '55px' }} onClick={() => navigate(`/profile/${userData.username}`)} height={{ xs: '40px', sm: '55px' }} overflow={'hidden'} borderRadius={'30px'} >
                        <Avatar sx={{ width: '100%', height: "100%", bgcolor: '#c2c2c2' }} src={userData?.image}>
                            
                        </Avatar>
                    </Box>

                    <Stack spacing={0} >
                        <Typography variant="body2" component={'span'} fontWeight={'bold'} fontSize={{ xs: 12, sm: 16 }} textOverflow={'ellipsis'} noWrap color="text.primary">{userData?.fake_name || userData?.name}</Typography>

                        {postData?.created_at && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                            {timeCount(postData?.created_at)}
                        </Typography>}


                        {postData?.mood_tag && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                            feeling {moods.find(m => m.value == postData?.mood_tag).label}
                        </Typography>}
                    </Stack>

                </Stack>
                <PostOptionsComponent setHidePost={setHidePost} followed={followed} postData={postData} userData={userData}/>
            </Stack>
            
        </>
    )
}
export default PostUIHeader;