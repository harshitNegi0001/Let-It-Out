import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import CloseButton from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";

import { setState } from "../../store/authReducer/authReducer";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from "axios";

function SharePostComponent({ closeShare, postData, setShareCount }) {

    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const postLink = `${window.location.origin}/p/${postData?.id}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(postLink)}`;

    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postLink)}`;

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`;

    const copyURL = async () => {
        try {
            await navigator.clipboard.writeText(postLink);
            increaseShare();
            dispatch(setState({ success: 'Link copied.' }));
        } catch (err) {
            // console.log(err);
            dispatch(setState({ error: err?.message || 'Something went wrong.' }));
        }
    }
    const nativeShare = async () => {

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check this post',
                    url: postLink
                })
                increaseShare();

            } catch (err) {
                console.log(err);
                dispatch(setState({ error: err?.message || 'Something went wrong.' }));
            }
        }
        else {
            dispatch(setState({ error: 'Native sharing not supported on this device' }));
        }

    }
    const openInNewTab = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
        increaseShare();
    }

    const closeShareComponent = () => {

        closeShare();
    }
    const increaseShare = async () => {
        try {
            
            const result = await axios.post(
                `${backend_url}/api/increase-share-count`,
                {
                    postId: postData?.id
                },
                {
                    withCredentials: true
                }
            );

            setShareCount(result?.data?.shares_count || 0);
        } catch (err) {
            console.log(err);

        }
    }

    return (
        <>
            <Box width={'100%'}
                onClick={(e) => e.stopPropagation()}
                borderRadius={3}
                maxHeight={'90vh'}
                maxWidth={{ xs: '320px', sm: '550px' }}
                p={2}

                bgcolor="primary.dark"
                sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontSize={{ xs: '14px', sm: '18px' }} fontWeight={'bold'}>
                        Share post
                    </Typography>
                    <IconButton size="small" onClick={closeShareComponent} >
                        <CloseButton sx={{ fontSize: { xs: '18px', sm: '25px' }, color: '#fff' }} />
                    </IconButton>
                </Box>

                <Box width={'100%'}
                    height={'90%'}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    overflow={'scroll'}>


                    <Box width={'100%'}
                        border={1}
                        borderColor={'divider'}
                        bgcolor={'primary.main'} borderRadius={3}
                        py={2}
                        px={1}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Box width={'75%'} >
                            <Typography variant="body2"
                                fontSize={{ xs: '13px', sm: '16px' }}
                                fontWeight={'500'} color="#fff"
                                width={'100%'} noWrap textOverflow={'ellipsis'}>
                                {postLink}
                            </Typography>
                        </Box>
                        <Button variant="contained" color="secondary"
                            sx={{ width: 'calc(20% - 8px)', borderRadius: '20px', textTransform: 'none' }}
                            onClick={copyURL}>
                            Copy
                        </Button>
                    </Box>

                    <Divider sx={{ width: '100%' }} />

                    <Stack direction={'row'} spacing={2} width={'100%'} overflow={'scroll'}>
                        <IconButton title="Whatsapp" sx={{
                            '&:hover': {
                                color: '#63e73a'
                            }
                        }}
                            onClick={() => openInNewTab(whatsappUrl)}
                        >
                            <WhatsAppIcon fontSize="large" />
                        </IconButton>
                        <IconButton title="Facebook" sx={{
                            '&:hover': {
                                color: '#0b69f7'
                            }
                        }}
                            onClick={() => openInNewTab(facebookUrl)}
                        >
                            <FacebookIcon fontSize="large" />
                        </IconButton>
                        <IconButton title="X"
                            onClick={() => openInNewTab(twitterUrl)}
                        >
                            <XIcon fontSize="large" />
                        </IconButton>
                        <IconButton title="More options"
                            onClick={nativeShare}
                        >
                            <MoreHorizIcon fontSize="large" />
                        </IconButton>
                    </Stack>

                </Box>
            </Box>
        </>
    )
}

export default SharePostComponent;


