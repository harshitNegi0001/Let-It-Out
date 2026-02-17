import { Box, Typography } from "@mui/material";


function ImageGrid({ images = [], setImages }) {
    const countImg = images?.length || 0;
    const handleImageClick = (e) => {
        e.stopPropagation();
        if (setImages) {
            setImages(images);

        }
    }

    if (countImg == 0) {
        return null;
    }

    if (countImg == 1) {
        return (
            <Box onClick={handleImageClick} sx={{ maxHeight: { xs: '280px', sm: '400px' }, overflow: "hidden", borderRadius: 1 }}>
                <img
                    src={images[0]}
                    alt=""
                    style={{
                        width: "100%",
                        height: '100%',
                        objectFit: "cover",
                        objectPosition: "center",
                        
                    }}
                />
            </Box>
        )
    }

    if (countImg == 2) {
        return (
            <Box display="flex" gap={0.5} height={{ xs: '200px', sm: '400px' }} borderRadius={2} overflow="hidden" onClick={handleImageClick}>
                {images.map((img, i) => (
                    <Box key={i} flex={1} height={'100%'}>
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
            <Box display="flex" flexDirection="column" gap={0.5} borderRadius={2} overflow={'hidden'} onClick={handleImageClick}>
                <Box height={{ xs: '140px', sm: '250px' }} overflow="hidden">
                    <img
                        src={images[0]}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </Box>
                <Box display="flex" gap={0.5}>
                    {images.slice(1).map((img, i) => (
                        <Box key={i} flex={1} height={{ xs: '140px', sm: '250px' }} overflow="hidden">
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
                gridAutoRows={{ xs: '130px', sm: '200px' }}
                gap={0.5}
                onClick={handleImageClick}
                overflow={'hidden'}
                borderRadius={2}
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
                                zIndex={0}
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


export default ImageGrid;