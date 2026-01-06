import { Stack, Typography } from "@mui/material";
import PostUI from "./PostUI";



export default function Posts() {

return(
    <>
        <Stack width={'100%'} spacing={2} mb={'60px'} mt={2}>
            {[1,2,3,4,5].map(i=><PostUI key={i}followed={true}/>)}

        </Stack>

        

        
    </>
)
}