import { Box, Stack, Typography } from "@mui/material";

import ImageGrid from "./ImageGrid";
import { useState, useRef, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import PostUIHeader from "./PostUIHeader";
import PostUIBottom from "./PostUIBottom";
import FullPageImage from "./FullPageImage";
import RepostedParent from "./RepostedParent";






function PostUI({ postData, userData }) {

    const [hidePost, setHidePost] = useState({
        isHidden: false,
        reason: ''
    });
    const [images, setImages] = useState([]);
    const contentRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (contentRef.current) {
            setIsOverflowing(
                contentRef.current.scrollHeight > contentRef.current.clientHeight
            );
        }
    }, [postData.content]);
    return (

        <>{
            hidePost?.isHidden ?
                <>
                    <Box width={'100%'} p={1} borderRadius={2} border={1} borderColor={'divider'}>
                        <Typography fontSize={{ xs: '10px', sm: '14px' }} color="text.secondary" component={'span'} >
                            {hidePost.reason}
                        </Typography>
                    </Box>
                </> :



                <Stack width={'100%'} height={'fit-content'} borderRadius={2} overflow={'hidden'} sx={{ boxShadow: '1px 1px 2px 1px #0e0e0e5d' }} borderColor={'primary.dark'} bgcolor={'#262231'}>

                    <PostUIHeader setHidePost={setHidePost} userData={userData} postData={postData} />
                    <Box width={'100%'} p={1} sx={{ display: 'flex', flexDirection: 'column' }}
                        onClick={() => navigate(`/p/${postData.id}`, { state: { prevUrl: location.pathname + location.search } })}>

                        {postData.content && <>
                            <Typography
                                ref={contentRef}
                                mb={isOverflowing ? 0 : 2}
                                component={'span'}
                                sx={{
                                    whiteSpace: 'pre-wrap', display: '-webkit-box',
                                    WebkitLineClamp: 20,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }} fontSize={{ xs: 12, sm: 16 }}>
                                {postData.content}
                            </Typography>
                            {isOverflowing && (
                                <Typography
                                    component={'span'}
                                    fontSize={{ xs: 11, sm: 13 }}
                                    color="secondary"
                                    sx={{ cursor: 'pointer', width: 'fit-content' }}
                                    onClick={() =>
                                        navigate(`/p/${postData.id}`, {
                                            state: { prevUrl: location.pathname + location.search },
                                        })
                                    }
                                >
                                    Show more
                                </Typography>
                            )}

                        </>}

                        {postData?.media_url?.length > 0 && <ImageGrid images={postData?.media_url} setImages={setImages} />}
                        {
                            postData?.parent_post_data &&
                            <>
                                <RepostedParent userData={postData?.parent_post_data?.user_data} postData={postData?.parent_post_data?.post_data} />
                            </>
                        }
                    </Box>
                    <PostUIBottom postData={postData} userData={userData} />

                    {images.length > 0 && <FullPageImage images={images} setImages={setImages} />}

                </Stack>
        }
        </>
    )
}

export default PostUI;




