import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import PostUI from "./PostUI";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setState } from "../../store/authReducer/authReducer";
import { useState } from "react";
import axios from "axios";
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
    ACCOUNT_BLOCKED: {
        image: 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767880329/ffaril9idaw7ln5xqsyg.png',
        headingMsg: 'Profile not available',
        detailMsg: 'You can’t view posts from this account at the moment.'
    }
}

export default function Posts({ userData, scrollRef }) {
    const [userPost, setUserPost] = useState([]);
    const [postRestriction, setPostRestriction] = useState({
        show_posts: true,
        reason: "",
        message: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const [hasmore, setHasmore] = useState(true);


    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {

        const el = scrollRef?.current;
        if (!el) {
            return;
        }
        el.addEventListener('scroll', handleScroll);

        return () => {
            el.removeEventListener("scroll", handleScroll);
        }

    }, [isLoading]);

    useEffect(() => {
        if (userData.id) {
            getPosts();
        }
    }, [userData.id]);

    const handleScroll = () => {
        if (!hasmore) {
            return;
        }

        if (isLoading) {
            return;
        }
        const el = scrollRef?.current;

        if (el.scrollTop + el.clientHeight + 1 >= el.scrollHeight) {
            getPosts();
        }
    }
    const getPosts = async () => {

        try {
            setIsLoading(true);
            const lastFeedId = userPost.length == 0 ? null : userPost[userPost.length - 1]?.id;
            const url = (lastFeedId) ?
                `${backend_url}/api/post/profile?userId=${userData.id}&&limit=${10}&&lastFeedId=${lastFeedId}`
                :
                `${backend_url}/api/post/profile?userId=${userData.id}&&limit=${10}`

            const result = await axios.get(
                url,
                {
                    withCredentials: true
                });
            setIsLoading(false);

            if (result.data?.restrictions) {
                setPostRestriction(result.data.restrictions);
                setHasmore(false);
            }

            else {
                if (result.data.posts?.length < 10) {
                    setHasmore(false);
                }
                setUserPost(prev => ([...prev, ...result.data.posts]));


            }
            // setUserPost(result)
        } catch (err) {
            setIsLoading(false);

            dispatch(setState({ error: err?.response?.data?.error || "Something Went Wrong!" }));
        }
    }
    return (
        <>
            <Stack width={'100%'} spacing={2} position={'relative'}  mt={2}>

                {userPost.map((p) =>

                    <PostUI key={p.id} followed={userData.followingStatus} postData={p} userData={userData} />

                )}

                {(isLoading) &&
                    <Stack width={'100%'} spacing={2} >
                        <LoadingPost />
                        <LoadingPost />
                    </Stack>
                }

                {
                    postRestriction.show_posts && !hasmore && userPost.length != 0 &&
                    <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary" component={'span'} fontSize={{ xs: '10px', sm: '13px' }}>
                            ( ︶︵︶ ) No more posts ( ︶︵︶ )
                        </Typography>
                    </Box>
                }



                {userPost.length == 0 && postRestriction.show_posts && !isLoading &&
                    <Box width={'100%'} py={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>

                        <Box width={'90%'} maxWidth={{ xs: "200px", sm: '330px' }} >
                            <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1767880326/rnand3ixnpmb5unpe3zx.png" style={{ width: '100%', objectFit: 'contain' }} alt="" />

                        </Box>

                        <Typography variant="body1" fontSize={{ xs: '18px', sm: '26px' }} fontWeight={600} color="#fff" textAlign={'center'} >
                            No posts yet.
                        </Typography>
                        <Typography variant="body2" fontSize={{ xs: '13px', sm: '16px' }} color="text.primary" textAlign={'center'}>
                            There are no posts from this profile yet.

                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: "column", gap: 1 }} >
                            <Divider sx={{ width: '100%' }} />
                            <Typography variant="body2" fontSize={{ xs: '10px', sm: '12px' }} color="text.secondary" textAlign={'center'}>
                                When posts are shared, they’ll appear here.
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

            </Stack>





        </>
    )
}