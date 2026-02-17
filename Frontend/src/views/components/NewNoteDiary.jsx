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

export default function NewNoteDiary() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedEmoji, setSelectedEmoji] = useState(emojis[0].key);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

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
                            {/* <DemoContainer components={['DatePicker']}> */}
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
                            {/* </DemoContainer> */}
                            {/* mood */}
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