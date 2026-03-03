// import { Box, keyframes, Stack } from "@mui/material";
import logoImg from '../../assets/letitout_logo.png';



export default function LoadingAppComponent() {

    return (
        <>
            <div className="loading-container">
                <div className="logo-wrapper">
                    {/* Ripple effects background mein */}
                    <div className="ripple"></div>
                    <div className="ripple"></div>
                    <div className="ripple"></div>

                    {/* Main Logo jo beat karega */}
                    <img src={logoImg} alt="App Logo" className="main-logo" />
                </div>
            </div>
        </>
    )
}