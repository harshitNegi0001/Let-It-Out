import { Alert, Snackbar } from "@mui/material";

import { useDispatch, useSelector } from 'react-redux';
import { setState } from "../../store/authReducer/authReducer";



function Toaster() {
    const { success, error } = useSelector(state => state.auth);
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(setState({ success: null, error: null }));
    };
    const isOpen = Boolean(success || error);

    return (
        <>
            {(error || success) && <Snackbar
                open={isOpen}
                autoHideDuration={4000}
                onClose={handleClose}
                sx={{zIndex:'9999'}}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                {(error || success) && <Alert
                    severity={success ? "success" : error ? 'error' : undefined}
                    onClose={handleClose}

                >
                    {success || error}
                </Alert>}
            </Snackbar>}

        </>
    )
}

export default Toaster;