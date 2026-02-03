import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import PostUI from "./PostUI";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setState } from "../../store/authReducer/authReducer";
import { useState } from "react";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import ConfirmBox from "./ConfirmBox";
import LoadingPost from "./LoadingPosts";

const RestrectedPostHandler = {
    PRIVATE_ACCOUNT: {
        image: 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767880329/ffaril9idaw7ln5xqsyg.png',
        headingMsg: 'This account is Private',
        detailMsg: 'Follow this account to see their posts.',

    },
    ACCOUNT_DEACTIVATED: {
        image: 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767884508/nd3lir2au0iijzpxv4wk.png',
        headingMsg: 'This account has been Temporarily Deactivated',
        detailMsg: 'This account has been temporarily deactivated by the user, it will restored when the user logs back in.',

    },
    ACCOUNT_SUSPENDED: {
        image: 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767883872/ugawmofhb7scnu4mozws.png',
        headingMsg: 'This account has been Suspended',
        detailMsg: 'This account has been Suspended. this could due to violation of our Community Guildlines or other Policies.',

    },
    ACCOUNT_BLOCKED:{
        image:'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767880329/ffaril9idaw7ln5xqsyg.png',
        headingMsg:'Profile not available',
        detailMsg:'You can’t view posts from this account at the moment.'
    }
}
export default function Replies({ userData }) {
    const [userPost, setUserPost] = useState([]);
    const [postRestriction, setPostRestriction] = useState({
        show_posts: true,
        reason: "",
        message: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [currPage, setCurrPage] = useState(1);
    // const [hasmore,setHasmore] = useState(true);

    useEffect(() => {
        if (userData.id) {
            getPosts();
        }
    }, [userData.id]);


    const getPosts = async () => {

        try {
            setIsLoading(true);
            const result = await axios.get(`${backend_url}/api/post/profile?userId=${userData.id}&&limit=${10}&&currPage=${currPage}&&reqType=${'replied_post'}`,
                {
                    withCredentials: true
                });
            setIsLoading(false);

            if (result.data?.restrictions) {
                setPostRestriction(result.data.restrictions);
                // hasMore = false;
            }
            else {
                if (result?.data?.posts?.length > 0) {
                    setUserPost(prev => ([...prev, ...result.data.posts]));
                }
                else {
                    // hasMore False
                }

            }
            // setUserPost(result)
        } catch (err) {
            setIsLoading(false);
            // hasMore = false.
            // console.log(err);
            dispatch(setState({ error: err?.response?.data?.error || "Something Went Wrong!" }));
        }
    }
    return (
        <>
            {(isLoading) ?
                <Stack width={'100%'} spacing={2} p={1} mb={'60px'} mt={2}>
                    <LoadingPost />
                    <LoadingPost />
                </Stack>
                : <Stack width={'100%'} spacing={2} position={'relative'} mb={'60px'} mt={2}>
                    <Box width={'100%'} position={'absolute'} top={0} >
                        <ConfirmBox setUserPost={setUserPost} userPost={userPost} />
                    </Box>

                    {userPost.map((p) =>

                        <PostUI key={p?.post_data?.id} followed={true} postData={p.post_data} userData={p.user_data} />

                    )}



                    {userPost.length == 0 && postRestriction.show_posts &&
                        <Box width={'100%'} py={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>

                            <Box width={'90%'} maxWidth={{ xs: "200px", sm: '330px' }} >
                                <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1767880326/rnand3ixnpmb5unpe3zx.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />

                            </Box>

                            <Typography variant="body1" fontSize={{ xs: '18px', sm: '26px' }} fontWeight={600} color="#fff" textAlign={'center'} >
                                No posts yet.
                            </Typography>
                            <Typography variant="body2" fontSize={{ xs: '13px', sm: '16px' }} color="text.primary" textAlign={'center'}>
                                This profile hasn’t commented on any posts yet.

                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: "column", gap: 1 }} >
                                <Divider sx={{ width: '100%' }} />
                                <Typography variant="body2" fontSize={{ xs: '10px', sm: '12px' }} color="text.secondary" textAlign={'center'}>
                                    When this profile comments on posts, they’ll appear here.
                                </Typography>
                            </Box>

                        </Box>}
                    {!postRestriction?.show_posts &&
                        <Box width={'100%'} py={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                            <Box width={'90%'} maxWidth={{ xs: "200px", sm: '330px' }} >
                                <img src={RestrectedPostHandler[postRestriction.reason]?.image} style={{ width: '100%', objectFit: 'contain' }} alt="" />

                            </Box>
                            <Typography variant="body1" fontSize={{ xs: '18px', sm: '26px' }} fontWeight={600} color="#fff" textAlign={'center'} >
                                {RestrectedPostHandler[postRestriction.reason]?.headingMsg}
                            </Typography>
                            <Typography variant="body2" fontSize={{ xs: '13px', sm: '16px' }} color="text.primary" textAlign={'center'}>
                                {RestrectedPostHandler[postRestriction.reason].detailMsg}
                            </Typography>

                        </Box>}

                </Stack>}




        </>
    )

}