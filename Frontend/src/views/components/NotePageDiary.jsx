import { Box, Divider, Stack, Typography, IconButton, Button, Select, FormControl, InputLabel, MenuItem, TextField, Backdrop } from "@mui/material";
import { emojis } from "../../utils/emoji";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setState } from "../../store/authReducer/authReducer";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { formatDate } from "../../utils/formatDateTime";
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';



export default function NotePageDiary() {
    const [date, setDate] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(emojis[0].key);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!state?.noteData) {
            navigate('/personal-diary');
            return;
        }
        const { noteData } = state;
        setDate(noteData.creation_date);
        setNoteContent(noteData.content);
        setNoteTitle(noteData.title);
        setSelectedEmoji(noteData.emoji_key);
    }, [state])

    const closeConfirm = () => {
        document.activeElement?.blur();
        setOpenConfirm(false);
    }

    const EditNote = async () => {
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
                `${backend_url}/diary/edit-note`,
                {
                    id: state.noteData.id,
                    title: noteTitle.trim(),
                    content: noteContent.trim(),
                    emoji_key: selectedEmoji,
                    date: date
                },
                {
                    withCredentials: true,
                }
            )
            setIsLoading(false);
            dispatch(setState({
                success: 'Note edited successfully!'
            }));
            navigate('/personal-diary')
        } catch (err) {
            setIsLoading(false);
            dispatch(
                setState({
                    error: err?.response?.data?.error || 'Failed to edit note. Please try again.'
                })
            );
            console.log(err);
        }
    }

    const DeleteNote = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post(
                `${backend_url}/diary/delete-note`,
                {
                    id: state?.noteData?.id,
                },
                {
                    withCredentials: true
                }
            )

            setIsLoading(false);
            dispatch(setState({
                success: 'Note deleted successfully!'
            }));

            navigate('/personal-diary');

        } catch (err) {
            setIsLoading(false);
            dispatch(
                setState({
                    error: err?.response?.data?.error || 'Failed to delete note. Please try again.'
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
            <Backdrop
                open={openConfirm}
                onClick={closeConfirm}
                sx={{
                    zIndex: 9999
                }}>
                <Box width={'280px'}
                    onClick={(e) => e.stopPropagation()}
                    bgcolor={'primary.light'}
                    borderRadius={2}
                    display={'flex'}
                    flexDirection={'column'}
                    gap={2}
                    p={2}>
                    <Box width={'100%'} >
                        <Typography variant="body1" component={'div'}>Do you really want to delete this note</Typography>
                    </Box>
                    <Box width={'100%'} display={'flex'} gap={2} justifyContent={'end'}>

                        {!isLoading && <Button variant="text" sx={{ color: '#fff' }} onClick={closeConfirm}><ClearIcon /></Button>}
                        <Button variant="contained" color="error" loading={isLoading} onClick={DeleteNote}><DoneIcon /></Button>
                    </Box>
                </Box>

            </Backdrop>
            <Stack width={'100%'}
                direction={'column'}
                spacing={{ xs: 1, sm: 2 }}>
                <Box width={'100%'} sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }} p={1}  >
                    <IconButton onClick={() => navigate('/personal-diary')} size="small" title="Go back" >
                        <ArrowBackIcon />
                    </IconButton>
                    {/* {<Button variant="contained"
                        onClick={saveNote}
                        loading={isLoading}
                        color="secondary" size="small">
                        Save
                    </Button>} */}

                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center'
                    }} >
                        {
                            !editMode &&
                            <IconButton onClick={() => setEditMode(true)}
                                size="small" title="Edit Note" >
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            editMode ?

                                <Button variant="contained"
                                    onClick={EditNote}
                                    loading={isLoading}
                                    color="secondary" size="small">
                                    Save
                                </Button>
                                :
                                <IconButton onClick={() => setOpenConfirm(true)}
                                    loading={isLoading}
                                    size="small" title="Delete Note" >
                                    <DeleteForeverOutlinedIcon color="error" />
                                </IconButton>
                        }

                    </Box>


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
                        {
                            editMode ?
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker value={date ? dayjs(date, "YYYY-MM-DD") : null} onChange={(newValue) => setDate(newValue ? newValue.format("YYYY-MM-DD") : null)} name="not-date"
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
                                </LocalizationProvider> :
                                <Typography variant="body1" borderBottom={1} borderColor={'divider'}
                                    fontSize={{ xs: '16px', sm: '20px' }} color="#fff"
                                    pb={0.5}
                                    fontWeight={'bold'}
                                    noWrap textOverflow={'ellipsis'} >
                                    {formatDate(date)}
                                </Typography>}
                        < Box width={'70px'}>
                            {editMode ?
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
                                </FormControl> :
                                <img src={emojis.find(e => e.key === selectedEmoji)?.value} alt=""
                                    style={{
                                        width: '35px',
                                        objectFit: 'contain'
                                    }} />
                            }
                        </Box>
                    </Box>
                    {editMode ?
                        <TextField fullWidth
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            variant="standard"
                            color="secondary"
                            label="Title">

                        </TextField> :
                        <Typography variant="body1"
                            fontSize={{ xs: '14px', sm: '18px' }}
                            component={'span'} color="text.primary"
                            fontWeight={'500'}
                            borderBottom={1} borderColor={'divider'} pb={0.5}>
                            {noteTitle}
                        </Typography>
                    }
                    {editMode ?
                        <TextField fullWidth
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            variant="standard"
                            multiline
                            color="secondary"
                            label="Content"
                            placeholder="Write your thoughts here...">

                        </TextField> :
                        <Typography variant="body2"
                            fontSize={{ xs: '12px', sm: '16px' }}
                            component={'span'}
                            sx={{
                                whiteSpace: 'pre-line'
                            }}
                            color="text.secondary">
                            {noteContent}
                        </Typography>
                    }
                </Box>
            </Stack>
        </Stack>
    );
}