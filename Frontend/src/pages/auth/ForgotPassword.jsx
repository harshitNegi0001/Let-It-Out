import { Stack } from "@mui/material";
import { useState } from "react";
import EnterEmailComponent from "./EnterEmailComponent";
import VarifyOtpComponent from "./VarifyOtpComponent";
import { useEffect } from "react";
import ResetPassComponent from "./ResetPassComponent";



function ForgotPassword() {

    const [page, setPage] = useState('');
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        setPage('ENTER_EMAIL');
    }, []);

    return (
        <Stack width={'100vw'} height={'100vh'} overflow={'scroll'} sx={{ justifyContent: 'center', position: 'relative', alignItems: 'center', p: 2 }} >

            {
                page == 'ENTER_EMAIL' ?
                    <EnterEmailComponent setPage={setPage} saveEmail={setEmail} />
                    :
                    page == 'VERIFY_OTP' ?
                        <VarifyOtpComponent setPage={setPage} saveOtp={setOtp} email={email} />
                        :
                        page == 'RESET_PASSWORD' ?
                            <>
                                <ResetPassComponent otp={otp} email={email} />
                            </>
                            : null
            }
        </Stack>
    )
}

export default ForgotPassword;