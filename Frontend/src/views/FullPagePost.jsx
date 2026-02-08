import { Stack, Box, Typography, Divider, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import CommentSection from "./components/CommentSection";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";
import LoadingPost from "./components/LoadingPosts";
import PostUIHeader from "./components/PostUIHeader";
import PostUIBottom from "./components/PostUIBottom";
import ImageGrid from "./components/ImageGrid";
import FullPageImage from "./components/FullPageImage";
import RepostedParent from "./components/RepostedParent";


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
    const [images, setImages] = useState([]);


    const { postId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
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
            if (result?.data?.restrictions) {
                setRestriction(result.data.restrictions);
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

            <Stack width={'100%'} height={'100%'} p={{ xs: 1, sm: 2 }} spacing={{ xs: 1, sm: 2 }} pb={{ xs: '60px', sm: '10px' }} direction={'column'} overflow={'scroll'} >
                <Box width={'100%'} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <IconButton onClick={() => navigate(location.state?.prevUrl || `/`)}>
                        <ArrowBackIcon sx={{ fontSize: { xs: '18px', sm: '24px' } }} />
                    </IconButton>
                    <Typography variant="body1" fontSize={{ sx: '18px', sm: '24px' }} component={'div'} color="text.main" fontWeight={'600'}>
                        Post
                    </Typography>
                </Box>
                <Divider />
                {
                    isLoading ? <LoadingPost /> :

                        restriction?.is_restricted ?
                            <>

                                <Box width={'100%'} py={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                    <Box width={'90%'} maxWidth={{ xs: "200px", sm: '330px' }} >
                                        <img src={restriction?.image} style={{ width: '100%', objectFit: 'contain' }} alt="" />

                                    </Box>
                                    <Typography variant="body1" fontSize={{ xs: '18px', sm: '26px' }} fontWeight={600} color="#fff" textAlign={'center'} >
                                        {restriction?.title}
                                    </Typography>
                                    <Typography variant="body2" fontSize={{ xs: '13px', sm: '16px' }} color="text.primary" textAlign={'center'}>
                                        {restriction?.message}
                                    </Typography>

                                </Box>
                            </> :
                            <>{
                                hidePost?.isHidden ?
                                    <>
                                        <Box width={'100%'} p={1} borderRadius={2} border={1} borderColor={'divider'}>
                                            <Typography fontSize={{ xs: '10px', sm: '14px' }} color="text.secondary" component={'span'} >
                                                {hidePost.reason}
                                            </Typography>
                                        </Box>
                                    </> :

                                    <Stack width={'100%'} borderRadius={2} height={'fit-content'} >
                                        <PostUIHeader setHidePost={setHidePost} userData={userData} postData={postData} />
                                        {/* post contentSection */}
                                        <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }}>

                                            {postData?.content && <Typography mb={2} sx={{ whiteSpace: 'pre-wrap' }} fontSize={{ xs: 12, sm: 16 }}>
                                                {postData.content}
                                            </Typography>}
                                            {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} setImages={setImages} />}
                                            {
                                                postData?.parent_post_data &&
                                                <>
                                                    <RepostedParent userData={postData?.parent_post_data?.user_data} postData={postData?.parent_post_data?.post_data} />
                                                </>
                                            }
                                        </Box>
                                        <PostUIBottom postData={postData} userData={userData}/>
                                        {images.length > 0 && <FullPageImage images={images} setImages={setImages} />}
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