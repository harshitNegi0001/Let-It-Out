import { Avatar, Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import ImageGrid from "./ImageGrid.jsx";
import axios from 'axios';
import { setState } from "../../store/authReducer/authReducer.js";


function CreatePost({ setIsOpenCreatePost }) {
    const [isLoading, setIsLoading] = useState(false);
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const MAX_IMAGES = 5;
    const [text, setText] = useState("");
    const [postImages, setPostImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    const addImageRef = useRef();

    const handleAddImg = (files) => {
        const fileArray = Array.from(files);
        const remainingSlots = MAX_IMAGES - imageFiles.length;

        if (remainingSlots <= 0) {
            dispatch(setState({
                error: `You can upload up to ${MAX_IMAGES} images only.`
            }));
            return;
        }

        const selectedFiles = fileArray.slice(0, remainingSlots);

        const previews = selectedFiles.map(file =>
            URL.createObjectURL(file)
        );

        setPostImages(prev => [...prev, ...previews]);
        setImageFiles(prev => [...prev, ...selectedFiles]);

        addImageRef.current.value = "";
    };


    const handleRemoveImages = () => {
        setPostImages([]);
        setImageFiles([]);
    };

    const closePostComponent = () => {
        setText("");
        handleRemoveImages();
        setIsOpenCreatePost(false);
    }
    const isPostDisabled = text.trim() === "" && postImages.length === 0;
    const submitPost = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();

            formData.append("content", text);

            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            const result = await axios.post(
                `${backend_url}/api/create-post`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setIsLoading(false);
            dispatch(setState({ success: "Your post is live." }));
            setText("");
            handleRemoveImages();
            setIsOpenCreatePost(false);

        } catch (err) {
            setIsLoading(false);
            // console.error(err);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong. Please retry." }));
        }
    };


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


                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold">Create Post</Typography>
                    <IconButton size="small" onClick={() => closePostComponent()}>
                        <CloseIcon />
                    </IconButton>
                </Box>


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
                        loading={isLoading}
                        onClick={submitPost}
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
