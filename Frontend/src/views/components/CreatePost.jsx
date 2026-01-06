import {Avatar,Box,Button,Divider,IconButton,Stack,TextField,Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { ImageGrid } from "./PostUI.jsx";
import axios from 'axios';

function CreatePost({ setIsOpenCreatePost }) {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const { userInfo } = useSelector((state) => state.auth);

    const [text, setText] = useState("");
    const [postImages, setPostImages] = useState([]);
    const addImageRef = useRef();

    const handleAddImg = (files) => {
        const newImages = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        setPostImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImages = () => {
        setPostImages([]);
    };

    const isPostDisabled = text.trim() === "" && postImages.length === 0;

    const submitPost = async()=>{

        
        try {
            const result = await axios.post(`${backend_url}/api/create-post`,{},{
                withCredentials:true,
                headers:{'Content-Type':'application/json'}
            })
        } catch (err) {
            
        }
    }

    return (
        <Box
            onClick={(e) => e.stopPropagation()}
            width="100%"
            maxWidth="450px"
            borderRadius={3}
            p={2}
            bgcolor="primary.dark"
        >
            <Stack spacing={1.5}>

                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold">Create Post</Typography>
                    <IconButton size="small" onClick={() => setIsOpenCreatePost(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* User + Text */}
                <Stack direction="row" spacing={1}>
                    <Avatar src={userInfo?.image} />
                    <TextField
                        multiline
                        minRows={1}
                        maxRows={6}
                        variant="standard"
                        placeholder="How you feeling today?"
                        fullWidth
                        value={text}
                        onChange={(e) => setText(e.target.value)}

                    />
                </Stack>

                {/* Image Preview */}
                {postImages.length > 0 && (
                    <Box position="relative">
                        <ImageGrid images={postImages} />

                        <IconButton
                            size="small"
                            onClick={handleRemoveImages}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "rgba(0,0,0,0.6)",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}

                <Divider />

                {/* Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <input
                            type="file"
                            multiple
                            hidden
                            ref={addImageRef}
                            onChange={(e) => handleAddImg(e.target.files)}
                        />
                        <IconButton
                            color="secondary"
                            onClick={() => addImageRef.current.click()}
                        >
                            <ImageOutlinedIcon />
                        </IconButton>
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={isPostDisabled}
                        sx={{ borderRadius: "20px", px: 3 }}
                    >
                        POST
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}

export default CreatePost;
