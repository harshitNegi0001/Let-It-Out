import { CircularProgress, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";




export default function LoadingAppComponent() {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const dotsTimer = setInterval(() => {
            setDots(prev=>{
                if(prev.length>=6){
                    return '';
                }
                else{
                    return prev + ' .';
                }
            })
        }, [500]);

        return () => clearInterval(dotsTimer);
    }, [])
    return (
        <>
            <div className="loading-container">
                <div className="logo-wrapper">
                    {/* Ripple effects background mein */}
                    {/* <div className="ripple"></div>
                    <div className="ripple"></div>
                    <div className="ripple"></div> */}

                    {/* Main Logo jo beat karega */}
                    <img src={'https://res.cloudinary.com/dns5lxuvy/image/upload/v1772522982/ufustlkhuk9g2ps79qo1.png'} alt="App Logo" className="main-logo" />


                </div>
                <div
                    style={{
                        width: '190px',
                        marginTop:'40px',
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center',
                        fontSize:'20px',
                        fontWeight:'6000',
                        color: 'white',
                        fontFamily:'Poppins'
                    }}>
                    <CircularProgress color="secondary" size={'35px'} />
                    <span>Connection{dots}</span>
                </div>

            </div>

        </>
    )
}