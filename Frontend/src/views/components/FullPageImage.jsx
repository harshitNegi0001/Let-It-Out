import { Backdrop, Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function FullPageImage({ images = [], setImages }) {

    const [currentImg, setCurrentImg] = useState(0);

    const closeImgWindow = () => {
        setImages([]);
        setCurrentImg(0);
    }



    return (
        <>
            <Backdrop open={images?.length > 0} onClick={closeImgWindow} sx={{ position: 'fixed', top: 0, zIndex: 9999,backdropFilter:'blur(2px)' }}>
                <Box width={'100%'} height={'100%'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} position={'relative'} >
                    <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'absolute', right: '0', top: '0', zIndex: 99, }}>
                        <IconButton onClick={closeImgWindow}>
                            <CloseIcon sx={{ fontSize: { xs: '24px', sm: '28px', md: '35px' } }} />
                        </IconButton>
                    </Box>
                    {
                        currentImg != 0 &&
                        <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'absolute', left: '0', my: 'auto', zIndex: 99, }}>
                            <IconButton sx={{ bgcolor: '#00000079', '&:hover': { bgcolor: '#00000079' } }} onClick={() => setCurrentImg(prev => prev - 1)} >
                                <ChevronLeftIcon sx={{ fontSize: { xs: '24px', sm: '28px', md: '35px' } }} />
                            </IconButton>
                        </Box>
                    }
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '90%', maxHeight: '90%', aspectRatio: 1 }} onClick={(e) => e.stopPropagation()}>

                        <img src={images?.[currentImg]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>
                    {
                        currentImg < images?.length - 1 &&
                        <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'absolute', right: '0', my: 'auto', zIndex: 99, }}>
                            <IconButton sx={{ bgcolor: '#00000079', '&:hover': { bgcolor: '#00000079' } }} onClick={() => setCurrentImg(prev => prev + 1)} >
                                <ChevronRightIcon sx={{ fontSize: { xs: '24px', sm: '28px', md: '35px' } }} />
                            </IconButton>
                        </Box>
                    }
                </Box>
            </Backdrop>
        </>
    )
}

export default FullPageImage;