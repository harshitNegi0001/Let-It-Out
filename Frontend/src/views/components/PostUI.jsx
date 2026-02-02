import { Avatar, Backdrop, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from "@mui/material";

import ImageGrid from "./ImageGrid";
import { useState } from "react";

import { requiredAction } from "../../store/authReducer/authReducer";
import { useLocation, useNavigate } from "react-router-dom";
import { moods } from "../../utils/moods";
import { deleteLikeTarget, likeTarget, savePost, undoSavedPost } from "../../utils/postOperations";
import { timeCount } from "../../utils/formatDateTime";
import PostUIHeader from "./PostUIHeader";
import PostUIBottom from "./PostUIBottom";
import FullPageImage from "./FullPageImage";






function PostUI({ followed = false, postData, userData }) {

    const [hidePost, setHidePost] = useState({
        isHidden: false,
        reason: ''
    });
    const [images, setImages] = useState([]);

    const navigate = useNavigate();
    const location =useLocation();

    return (

        <>{
            hidePost?.isHidden ?
                <>  
                    <Box width={'100%'} p={1} borderRadius={2} border={1} borderColor={'divider'}>
                        <Typography fontSize={{xs:'10px',sm:'14px'}} color="text.secondary" component={'span'} >
                            {hidePost.reason}
                        </Typography>
                    </Box>
                </> :



                <Stack width={'100%'} height={'fit-content'} borderRadius={2} overflow={'hidden'} sx={{ boxShadow: '1px 1px 2px 1px #0e0e0e5d' }} borderColor={'primary.dark'} bgcolor={'#221f2b'}>

                    <PostUIHeader setHidePost={setHidePost} userData={userData} postData={postData} />
                    <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }} 
                    onClick={() => navigate(`/p/${postData.id}`,{state:{prevUrl:location.pathname + location.search}})}>

                        {postData.content &&<Typography mb={2} sx={{ whiteSpace: 'pre-wrap' }} fontSize={{ xs: 12, sm: 16 }}>
                            {postData.content}
                        </Typography>}
                        {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} setImages={setImages} />}

                    </Box>
                    <PostUIBottom postData={postData} />
                    
                        {images.length>0&&<FullPageImage images={images} setImages={setImages} />}
                    
                </Stack>
        }
        </>
    )
}

export default PostUI;




