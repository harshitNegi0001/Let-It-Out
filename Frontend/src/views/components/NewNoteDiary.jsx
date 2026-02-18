import { Box, Divider, Stack, Typography, IconButton, Button, Select, FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import { emojis } from "../../utils/emoji";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";

export default function NewNoteDiary() {
    const [date, setDate] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(emojis[0].key);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();


    const saveNote = async () => {
        if (!noteTitle.trim() || !noteContent.trim()) {
            dispatch(
                setState({
                    error: 'Title and content cannot be empty!'
                })
            )
            return;
        }
       
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/diary/create-note`,
                {
                    title: noteTitle.trim(),
                    content: noteContent.trim(),
                    emoji_key: selectedEmoji,
                    date: date
                }, {
                withCredentials: true,
            }
            )
            setIsLoading(false);
            dispatch(setState({
                success:'Note created successfully!'
            }));
            navigate('/personal-diary')
        } catch (err) {
            setIsLoading(false);
            dispatch(
                setState({
                    error: err?.response?.data?.error || 'Failed to create note. Please try again.'
                })
            );
            console.log(err);
        }
    }

    return (
        <Stack width={'100%'}
            height={'100%'}
            py={1}
            pb={{ xs: '65px', sm: 1 }}
            overflow={'scroll'}
        >
            <Stack width={'100%'}
                direction={'column'}
                spacing={{ xs: 1, sm: 2 }}>
                <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }} p={1}  >
                    <IconButton onClick={() => navigate('/personal-diary')} size="small" title="Go back" >
                        <ArrowBackIcon />
                    </IconButton>
                    <Button variant="contained"
                        onClick={saveNote}
                        loading={isLoading}
                        color="secondary" size="small">
                        Save
                    </Button>


                </Box>
                <Divider />
                <Box width={'100%'} p={1} px={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                    <Box width={'100%'}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'end',
                        }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker value={date ? dayjs(date, "DD-MM-YYYY") : null} onChange={(newValue) => setDate(newValue ? newValue.format("DD-MM-YYYY") : null)} name="not-date"
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: {
                                        color: 'secondary',
                                        size: 'small',
                                        variant: 'standard',
                                        sx: {
                                            width: '150px',
                                            fontSize: { xs: '14px', sm: '16px' },
                                        }
                                    },

                                }}
                                slots={{
                                    openPickerIcon: KeyboardArrowDownIcon
                                }} />
                        </LocalizationProvider>
                        < Box width={'70px'}>
                            <FormControl fullWidth>

                                <Select size="small"
                                    variant="standard"
                                    color='secondary'
                                    MenuProps={{ disablePortal: true }}
                                    value={selectedEmoji}
                                    onChange={(e) => setSelectedEmoji(e.target.value)} labelId="mood-select-label"
                                    id="mood-select"
                                    sx={{
                                        height: '40px'
                                    }}>
                                    {emojis?.map((e) =>

                                        <MenuItem key={e.id} value={e.key} sx={{ fontSize: '20px' }}>
                                            <img src={e.value} key={e.id} alt=""
                                                style={{
                                                    width: '35px',
                                                    objectFit: 'contain',
                                                    padding: '4px'
                                                }} />
                                        </MenuItem>
                                    )}

                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    <TextField fullWidth
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        variant="standard"
                        color="secondary"
                        label="Title">

                    </TextField>
                    <TextField fullWidth
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        variant="standard"
                        multiline
                        color="secondary"
                        label="Content"
                        placeholder="Write your thoughts here...">

                    </TextField>
                </Box>
            </Stack>
        </Stack>
    )
}