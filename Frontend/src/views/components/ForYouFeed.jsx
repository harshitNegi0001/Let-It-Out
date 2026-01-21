import { Box, Stack } from "@mui/material";
import { useState } from "react";
import LoadingPost from "./LoadingPosts";
import { useEffect } from "react";
import { setState } from "../../store/authReducer/authReducer";
import { useDispatch } from "react-redux";
import axios from "axios";
import PostUI from "./PostUI";
import ConfirmBox from "./ConfirmBox";




function ForYouFeed() {
    const [isLoading, setIsLoading] = useState(false);
    const [postList, setPostList] = useState([]);

    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {

        getPosts();
    }, [])
    const getPosts = async (reqMood) => {
        setIsLoading(true);
        try {
            const result = await axios.get(
                `${backend_url}/api/get-posts?currPage=${1}&&limit=${10}`,
                { withCredentials: true }
            );

            setPostList(prev => ([...prev, ...result?.data?.postsList]));

            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);

            dispatch(setState({ error: err?.response?.data?.error || "Something Went wrong!" }));
            // console.log(err);
        }
    }

    return (
        <Stack width={'100%'} height={'100%'} spacing={1} overflow={'scroll'} sx={{ scrollbarWidth: 'none' }} p={1} pb={{xs:'110px',sm:'55px'}} alignItems={'center'} boxSizing={'border-box'}>
            {
                isLoading ?
                    <Box width={'100%'}>

                        <LoadingPost />
                        <LoadingPost />

                    </Box>
                    : <Stack width={'100%'} px={1} spacing={1} height={'fit-content'}>
                        <Box width={'100%'} position={'absolute'} top={0} >
                            <ConfirmBox setUserPost={setPostList} userPost={postList} />
                        </Box>
                        {postList.map(p => {

                            return (<PostUI key={p.post_data.id} followed={true} postData={p.post_data} userData={p.user_data} />)
                        }
                        )}
                    </Stack>
            }
        </Stack>
    )
}

export default ForYouFeed;