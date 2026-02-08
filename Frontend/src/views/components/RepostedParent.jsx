import { Avatar, Box, Stack, Typography } from "@mui/material";
import ImageGrid from "./ImageGrid";
import { useNavigate } from "react-router-dom";
import { timeCount } from "../../utils/formatDateTime";
import { moods } from "../../utils/moods";




function RepostedParent({ postData, userData }) {

    const navigate = useNavigate();
    return (

        <Box width={'100%'}
            height={'fit-content'}
            onClick={(e) => { e.stopPropagation(); navigate(`/p/${postData?.id}`) }}
            sx={{ display: 'flex', borderRadius: 3, border: 1, borderColor: 'divider', position: 'relative', flexDirection: 'column', bgcolor: 'primary.main' }}>
            <Box width={'100%'} height={'100%'} borderRadius={3} sx={{ position: 'absolute', zIndex: 9, '&:hover': { bgcolor: '#6c75ac2a' } }}></Box>
            <Stack direction={'row'} width={'100%'} boxSizing={'border-box'} p={1} justifyContent={'space-between'} borderRadius={3} bgcolor={'primary.dark'} alignItems={'center'}>
                <Stack direction={'row'} spacing={1} alignItems={'center'} width={'100%'}>
                    <Box width={{ xs: '30px', sm: '45px' }} height={{ xs: '30px', sm: '45px' }} overflow={'hidden'} borderRadius={'30px'} >
                        <Avatar sx={{ width: '100%', height: "100%", bgcolor: '#c2c2c2' }} src={userData?.image} />
                    </Box>

                    <Stack spacing={0} >
                        <Typography width={'100%'} variant="body2" component={'span'} fontWeight={'bold'} fontSize={{ xs: 12, sm: 16 }} textOverflow={'ellipsis'} noWrap color="text.primary">{userData?.fake_name || userData?.name}</Typography>

                        {postData?.created_at && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                            {timeCount(postData?.created_at)}
                        </Typography>}


                        {postData?.mood_tag && <Typography variant="body2" fontSize={{ xs: 10, sm: 14 }}>
                            feeling {moods.find(m => m.value == postData?.mood_tag).label}
                        </Typography>}
                    </Stack>

                </Stack>
            </Stack>
            <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }}>

                {postData.content && <Typography mb={2}
                    sx={{
                        whiteSpace: 'pre-wrap', display: '-webkit-box',
                        WebkitLineClamp: 20,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }} fontSize={{ xs: 12, sm: 16 }}>
                    {postData.content}
                </Typography>}
                {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} />}

            </Box>
        </Box>
    )
}

export default RepostedParent;