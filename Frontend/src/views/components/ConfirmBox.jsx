import { Backdrop, Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { requiredAction, setState } from "../../store/authReducer/authReducer";
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";
import { useState } from "react";


function ConfirmBox({ setUserPost, userPost }) {
    const { confirmComponent } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const displayConfirmBox = Boolean(confirmComponent);
    const handleCancleConfirmation = () => {
        document.activeElement?.blur();

        dispatch(requiredAction(null));
    }
    const perfomAction = async () => {
        if (!confirmComponent) {
            return;
        }

        switch (confirmComponent?.type) {
            case 'DELETE_POST':
                deletePost();
                break;
            case 'BLOCK_USER':
                blockUser();
                break;
            case 'REPORT_POST':
                reportPost()
        }



    }

    const deletePost = async () => {

        try {
            setIsLoading(true);

            const result = await axios.post(`${backend_url}/api/delete-post`,
                {
                    postId: confirmComponent.payload
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            );

            setIsLoading(false);
            handleCancleConfirmation();
            const filteredPost = userPost.filter(p => p.id != confirmComponent.payload);
            setUserPost([...filteredPost]);
            dispatch(setState({ success: 'Post has been deleted.' }));

        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something went wrong!' }));
            console.log(err);
        }

    }
    const reportPost = async()=>{
        try {

            const postId = confirmComponent.payload;
            setIsLoading(true);
            // api call

            const filteredPost = userPost.filter(p => p.id != confirmComponent.payload);
            setUserPost([...filteredPost]);
            setIsLoading(false);
            handleCancleConfirmation();
            dispatch(setState({ success: 'Post has been Reported.\nWe will take action.' }));

        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            dispatch(setState({error:err?.response?.data?.error|| 'Internal Server Error!'}));
        }
    }
    const blockUser = async () => {
        try {
            const userId = confirmComponent.payload;
            setIsLoading(true);

            // Api call

            setIsLoading(false);
            handleCancleConfirmation();
            
            dispatch(setState({ success: 'User has been blocked. \nYou will not see the posts.' }));
        } catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Internal Server Error!" }));
            // console.log(err);
        }
    }

    return (
        <>
            {displayConfirmBox && <Backdrop open={displayConfirmBox} onClick={handleCancleConfirmation} sx={{ zIndex: 9999 }}>
                <Box width={'280px'} onClick={(e) => e.stopPropagation()} bgcolor={'primary.light'} borderRadius={2} display={'flex'} flexDirection={'column'} gap={2} p={2}>
                    <Box width={'100%'} >
                        <Typography variant="body1" component={'div'}>{confirmComponent?.label}</Typography>
                    </Box>
                    <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>

                        {!isLoading && <Button variant="text" sx={{ color: '#fff' }} onClick={handleCancleConfirmation}><ClearIcon /></Button>}
                        <Button variant="contained" color="error" loading={isLoading} onClick={perfomAction}><DoneIcon /></Button>
                    </Box>
                </Box>
            </Backdrop>}
        </>
    )
}

export default ConfirmBox;