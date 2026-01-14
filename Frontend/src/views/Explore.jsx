import { Box, Divider, IconButton, InputBase, Stack, Typography } from "@mui/material";
import SearchButtonIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import { useState } from "react";




function Explore() {
    const navigate = useNavigate();
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (e)=>{
        e.preventDefault();
        if(!searchValue){
            return;
        }
        navigate(`/search/${searchValue}`);
    }
    return (
        <>
            <Stack width={'100%'} height={'100%'} alignItems={'center'} overflow={'scroll'} p={1} pb={{ xs: '60px', sm: 1 }}>
                <Box width={'100%'} maxWidth={{xs:'450px',sm:'550px'}} >
                    <form onSubmit={handleSearch} style={{width:'100%'}}>
                        <Box width={'100%'} p={1} height={'45px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 1 }} bgcolor={'primary.light'}>


                            <InputBase value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} variant='outlined' size="small" sx={{ width: 'calc(100% - 100px)' }} placeholder="Search user..." />
                            <Divider orientation='vertical' />
                            <IconButton type='submit' size="small">
                                <SearchButtonIcon />
                            </IconButton>
                        </Box>
                    </form>
                </Box>
            </Stack>
        </>
    )
}
export default Explore;