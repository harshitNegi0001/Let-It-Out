import { Stack, Box, Divider, Button, IconButton, Backdrop, Typography, TextField, LinearProgress, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/EditOutlined';
import AddPictureIcon from '@mui/icons-material/AddPhotoAlternate';
import { useEffect, useRef, useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { setState } from "../store/authReducer/authReducer";
import { useNavigate } from "react-router-dom";

function EditProfile() {
    const { userInfo } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const coverImgInput = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profileImgInput = useRef(null);
    const [coverImage, setCoverImage] = useState(userInfo?.cover_image || "");
    const [profileImage, setProfileImage] = useState(userInfo?.image || "");
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [progressUpload, setProgressUpload] = useState(0);
    const [userBasicDetail, setUserBasicDetail] = useState({
        fake_name: userInfo?.fake_name ?? userInfo?.name,
        bio: userInfo?.bio ?? "",
        dob: userInfo?.dob ?? ""
    });


    const handleUserInfoChange = async (event) => {
        setUserBasicDetail(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }
    const handleImageChange = async (file, type) => {

        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);

        try {
            setProgressUpload(40);
            setIsLoading(true);
            const result = await axios.post(`${backend_url}/api/upload/image`, formData, {

                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    const precent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgressUpload(precent);
                }
            });
            setIsLoading(false);
            setProgressUpload(100);
            if (type == 'cover') {
                setCoverImage(result.data.imageUrl);
            }
            if (type == 'profile') {
                setProfileImage(result.data.imageUrl);
            }
        }
        catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || 'Something Went Wrong, please try again.' }));
            console.log(err?.response?.data?.error);
        }
    }

    const handleSubmit = async () => {
        //validation and error handling here....

        try {
            setIsLoading(true);

            const result = await axios.post(`${backend_url}/api/update/my-profile`, { coverImage, profileImage, userBasicDetail }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });

            setIsLoading(false);

            dispatch(setState({ userInfo: result.data.userInfo, success: "Profile updated." }));
            navigate('/settings');


        }
        catch (err) {
            setIsLoading(false);
            dispatch(setState({ error: err?.response?.data?.error || "Something went wrong!" }));
            console.log(err?.response?.data?.error);
        }
    }
    return (
        <>
            <Stack width={'100%'} height={{ sm: '100%', xs: 'calc(100% - 110px)' }}>
                {(progressUpload > 0 && progressUpload < 100) && <LinearProgress color="info" variant='determinate' value={progressUpload}></LinearProgress>}
                <Stack width={'100%'} height={'100%'} overflow={'scroll'} p={2} pb={{ xs: '55px', sm: '10px' }}>

                    <Box position={'relative'} width={'100%'} sx={{ aspectRatio: '3/1' }}>
                        {Boolean(coverImage) ? <img src={coverImage} style={{ width: '100%', aspectRatio: '3/1', objectFit: 'cover' }} alt="" /> : <Box width={'100%'} sx={{ aspectRatio: '3/1' }}></Box>}
                        {!Boolean(coverImage) && <Divider />}
                        <input type="file" ref={coverImgInput} name="" id="change-cover-img" hidden accept='image/*' onChange={(e) => handleImageChange(e.target.files[0], "cover")} />

                        <IconButton sx={{ position: 'absolute', top: '0', right: '0', width: '45px', height: '45px', bgcolor: '#221c387e', '&:hover': { bgcolor: '#221c389f' } }} title="Add image" onClick={() => coverImgInput.current.click()}> <EditIcon fontSize="small" /> </IconButton>
                        <Box sx={{ width: { sm: '150px', xs: '70px' }, height: { sm: '150px', xs: '70px' }, bottom: { sm: '-60px', xs: '-30px' }, borderRadius: '90px', position: 'absolute', zIndex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', left: '20px', border: '3px solid #1E1B29' }}>
                            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                {Boolean(profileImage) ? <img src={profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '90px' }} alt="" /> : <Avatar sx={{ width: '100%', height: '100%' }}></Avatar>}
                                <IconButton onClick={() => profileImgInput.current.click()} sx={{ position: 'absolute', top: "0", width: '100%', height: '100%', left: '0', bgcolor: '#221c387e' }}><AddPictureIcon /></IconButton>
                                <input type="file" name="" id="change-profile-img" ref={profileImgInput} accept="image/*" hidden onChange={(e) => handleImageChange(e.target.files[0], "profile")} />
                            </Box>
                        </Box>
                        {/* <Button color="secondary" sx={{ position: 'absolute', left: { sm: '48px', xs: '10px' }, bottom: { sm: '-95px', xs: '-70px' } }} variant="contained" size="small">Add image</Button> */}
                    </Box>

                    <Stack width={'100%'} mt={{ xs: '45px', sm: '100px' }} pb={4} direction={'column'} alignItems={'center'} spacing={3}>

                        <Typography variant="body1" width={'100%'} component={'div'}>Basic profile details<Divider /></Typography>
                        <Box width={'100%'} maxWidth={'520px'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 3 }}>
                            <Box width={'100%'} maxWidth={'520px'} minWidth={'250px'}>
                                <TextField label=" Name" name="fake_name" onChange={handleUserInfoChange} value={userBasicDetail?.fake_name} helperText="a fake name that other user will see" fullWidth size="small" color="secondary"></TextField>
                            </Box>
                            <Box width={'100%'} maxWidth={'520px'} minWidth={'250px'}>
                                <TextField multiline value={userBasicDetail?.bio} name="bio" onChange={handleUserInfoChange} minRows={1} maxRows={3} label="bio" slotProps={{ input: { inputProps: { maxLength: 250 } } }} fullWidth color="secondary"></TextField>
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        value={userBasicDetail?.dob ? dayjs(userBasicDetail.dob, "YYYY-MM-DD") : null}
                                        onChange={(newValue) => setUserBasicDetail(prev => ({ ...prev, dob: newValue ? newValue.format("YYYY-MM-DD") : null }))}
                                        name="dob"
                                        format="DD/MM/YYYY"

                                        slotProps={{ textField: { color: 'secondary', fullWidth: true, helperText: 'Enter your date of birth' } }}
                                        label="Date of Birth" />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>

                        <Button onClick={handleSubmit} loading={isLoading} variant="contained" size='large' color="secondary" sx={{ width: '100%', maxWidth: '320px' }}>Save</Button>

                    </Stack>

                </Stack>
            </Stack>
        </>
    )
}

export default EditProfile;