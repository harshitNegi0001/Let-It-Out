import { Box, Typography } from "@mui/material";


function ImageGrid({ images = [] }) {
    const countImg = images?.length||0;

    if (countImg == 0) {
        return null;
    }

    if (countImg == 1) {
        return (
            <Box sx={{ maxHeight: 280, overflow: "hidden", borderRadius: 1 }}>
                <img
                    src={images[0]}
                    alt=""
                    style={{
                        width: "100%",
                        maxHeight: 280,
                        objectFit: "contain",
                    }}
                />
            </Box>
        )
    }

    if (countImg == 2) {
        return (
            <Box display="flex" gap={0.5}>
                {images.map((img, i) => (
                    <Box key={i} flex={1} height={200} overflow="hidden">
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
            <Box display="flex" flexDirection="column" gap={0.5}>
                <Box height={200} overflow="hidden">
                    <img
                        src={images[0]}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </Box>
                <Box display="flex" gap={0.5}>
                    {images.slice(1).map((img, i) => (
                        <Box key={i} flex={1} height={140} overflow="hidden">
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
                gridAutoRows="160px"
                gap={0.5}
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
                                zIndex={2}
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