import { Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import OptionIcon from '@mui/icons-material/MoreVert';
import LikeEmptyButton from '@mui/icons-material/FavoriteBorder';
import LikeFilledButton from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentsIcon from '@mui/icons-material/Forum';
import RepostIcon from '@mui/icons-material/Repeat';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from "react";
const images = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREbC_Ek5BEeK3Ii8c9Vb7EashQ-BRusAAIPw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREbC_Ek5BEeK3Ii8c9Vb7EashQ-BRusAAIPw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREbC_Ek5BEeK3Ii8c9Vb7EashQ-BRusAAIPw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREbC_Ek5BEeK3Ii8c9Vb7EashQ-BRusAAIPw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREbC_Ek5BEeK3Ii8c9Vb7EashQ-BRusAAIPw&s',
]

export function ImageGrid({ images = [] }) {
    const countImg = images.length;

    if (countImg == 0) {
        return null;
    }

    if (countImg == 1) {
        return (
            <Box sx={{ maxHeight: 280, overflow: "hidden", borderRadius: 1 }}>
                <img
                    src={images[0]}
                    alt=""
                    style={{
                        width: "100%",
                        maxHeight: 280,
                        objectFit: "contain",
                    }}
                />
            </Box>
        )
    }

    if (countImg == 2) {
        return (
            <Box display="flex" gap={0.5}>
                {images.map((img, i) => (
                    <Box key={i} flex={1} height={200} overflow="hidden">
                        <img
                            src={img}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </Box>
                ))}
            </Box>
        )
    }
    if (countImg == 3) {
        return (
            <Box display="flex" flexDirection="column" gap={0.5}>
                <Box height={200} overflow="hidden">
                    <img
                        src={images[0]}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </Box>
                <Box display="flex" gap={0.5}>
                    {images.slice(1).map((img, i) => (
                        <Box key={i} flex={1} height={140} overflow="hidden">
                            <img
                                src={img}
                                alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        )
    }

    else {
        return (
            <Box
                display="grid"
                gridTemplateColumns="1fr 1fr"
                gridAutoRows="160px"
                gap={0.5}
            >
                {images.slice(0, 4).map((img, i) => (
                    <Box
                        key={i}
                        position="relative"
                        width="100%"
                        height="100%"
                        overflow="hidden"
                    >
                        <img
                            src={img}
                            alt=""
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />

                        {/* +N Overlay */}
                        {i === 3 && countImg > 4 && (
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                bgcolor="rgba(0,0,0,0.6)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                zIndex={2}
                            >
                                <Typography variant="body1" fontSize={{ xs: 14, sm: 18 }} color="white" fontWeight="600">
                                    +{countImg - 4}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        )
    }
}



function PostUI({ followed, liked = false, bookmarked = false }) {
    const [isLiked, setIsLiked] = useState(liked);
    const [isSaved, setIsSaved] = useState(bookmarked);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isImage = true;
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleBookmark = () => {
        setIsSaved(prev => !prev);
        handleClose();
    }
    return (

        <>
            <Stack width={'100%'} borderRadius={2} overflow={'hidden'} border={1} borderColor={'primary.dark'}>
                <Stack direction={'row'} width={'100%'} boxSizing={'border-box'} p={1} justifyContent={'space-between'} bgcolor={'primary.dark'} alignItems={'center'}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'} width={'calc(100% - 40px)'}>
                        <Box width={{ xs: '40px', sm: '55px' }} height={{ xs: '40px', sm: '55px' }} overflow={'hidden'} borderRadius={'30px'} >
                            <img src="https://res.cloudinary.com/dns5lxuvy/image/upload/v1757039196/q0zlysytj3lkcieki5mh.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </Box>


                        <Stack spacing={0}><Typography variant="body2" component={'span'} fontWeight={'bold'} fontSize={{ xs: 12, sm: 16 }} textOverflow={'ellipsis'} noWrap color="text.primary">Harshit Singh negi</Typography>
                            {
                                !followed && <Button variant='text' endIcon={<AddIcon />} color="secondary" size="small" sx={{ width: '85px', mx: 2 }}>Follow</Button>
                            }</Stack>

                    </Stack>
                    <IconButton onClick={handleClick} size="large" id="post-options-btn" aria-haspopup='true' aria-expanded={open ? 'true' : undefined} aria-controls={open ? 'post-option-menu' : undefined}><OptionIcon /></IconButton>
                </Stack>
                <Menu id="post-option-menu" anchorEl={anchorEl} open={open} slotProps={{ list: { 'aria-labelledby': 'post-options-btn' } }} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <DeleteForeverIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <BlockIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Block</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <ReportIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Report</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleBookmark}>
                        <ListItemIcon>
                            {
                                isSaved ? <BookmarkIcon fontSize="small" color="secondary" /> : <BookmarkBorderIcon fontSize="small" />
                            }

                        </ListItemIcon>
                        <ListItemText>{isSaved ? 'Remove boookmark' : 'Bookmark'}</ListItemText>
                    </MenuItem>
                </Menu>
                <Box width={'100%'} p={1}>
                    
                    <ImageGrid images={images} />
                    <Typography mt={2} fontSize={{ xs: 12, sm: 16 }}>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. A quae aliquam architecto repudiandae mollitia quo dolorum reiciendis, nisi ex, aut labore dolores illum consequuntur officia nesciunt. Quas consequuntur cum aperiam?
                    </Typography>
                </Box>
                <Stack direction={'row'} justifyContent={'space-evenly'}>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} >
                        <IconButton onClick={() => setIsLiked(prev => !prev)} title="Likes">
                            {
                                isLiked ? <LikeFilledButton color="secondary" /> : <LikeEmptyButton />
                            }

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>7k</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton title="comments">
                            <CommentsIcon />

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>7k</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton title="shares">
                            <ShareIcon />

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>7k</Typography>
                    </Box>
                    {/* <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton onClick={() => setIsSaved(prev => !prev)} title="bookmarks">
                            {
                                isSaved ? <BookmarkIcon color="secondary" /> : <BookmarkBorderIcon />
                            }

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>7k</Typography>
                    </Box> */}
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton title="repost">
                            <RepostIcon />

                        </IconButton><Typography variant="body2" fontSize={12} component={'span'}>7k</Typography>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}

export default PostUI;




