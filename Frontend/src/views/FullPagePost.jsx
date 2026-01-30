import { Stack, Box, Typography, Divider, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostUI from "./components/PostUI";
import { useEffect, useState } from "react";
import CommentSection from "./components/CommentSection";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";
import LoadingPost from "./components/LoadingPosts";
import PostUIHeader from "./components/PostUIHeader";
import PostUIBottom from "./components/PostUIBottom";
import ImageGrid from "./components/ImageGrid";


function FullPagePost() {

    const [postData, setPostData] = useState({});

    const [isLoading, setIsloading] = useState(false);
    const [userData, setUserData] = useState({})
    const [restriction, setRestriction] = useState({
        is_restricted: false,
        reason: '',
        message: '',
        title: '',
        image: ''
    });
    const [hidePost, setHidePost] = useState({
        isHidden: false,
        reason: ''
    });

    const { postId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (postId) {
            getPostInfo();
        }
    }, [postId]);

    const getPostInfo = async () => {
        try {
            setIsloading(true);
            const result = await axios.get(
                `${backend_url}/api/get-post-info?post_id=${postId}`,
                {
                    withCredentials: true
                }
            );
            if (result.data.restrictions) {

            }
            setPostData(result?.data?.postData);
            setUserData(result?.data?.userData);

            setIsloading(false);
        } catch (err) {
            // console.log(err);
            setIsloading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something Went Wrong.' }));

        }
    }

    return (
        <>

            <Stack width={'100%'} height={'100%'} p={{ xs: 1, sm: 2 }} spacing={{xs:1,sm:2}} pb={{ xs: '60px', sm: '10px' }}  direction={'column'} overflow={'scroll'} >
                <Box width={'100%'} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <IconButton onClick={() => navigate(`/`)}>
                        <ArrowBackIcon sx={{fontSize:{xs:'18px',sm:'24px'}}} />
                    </IconButton>
                    <Typography variant="body1" fontSize={{sx:'18px',sm:'24px'}} component={'div'} color="text.main" fontWeight={'600'}>
                        Post
                    </Typography>
                </Box>
                <Divider/>
                {
                    isLoading ? <LoadingPost /> :

                        restriction?.is_restricted ?
                            <>
                                {/* Restricted area */}
                            </> :
                            <>{
                                hidePost?.isHidden ?
                                    <>
                                    </> :

                                    <Stack width={'100%'} borderRadius={2}  height={'fit-content'} >
                                        <PostUIHeader setHidePost={setHidePost} userData={userData} postData={postData} />
                                        {/* post contentSection */}
                                        <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }}>

                                            <Typography mb={2} sx={{ whiteSpace: 'pre-wrap' }} fontSize={{ xs: 12, sm: 16 }}>
                                                {postData.content}
                                            </Typography>
                                            {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} />}

                                        </Box>
                                        <PostUIBottom postData={postData} />
                                        
                                        <CommentSection postId={postId} />
                                    </Stack>
                            }

                            </>



                }
            </Stack>
        </>
    )
}
export default FullPagePost;