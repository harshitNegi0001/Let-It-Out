



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
                    <img src={'https://res.cloudinary.com/dns5lxuvy/image/upload/v1772522982/ufustlkhuk9g2ps79qo1.png'} alt="App Logo" className="main-logo" />
                    
                </div>
            </div>
        </>
    )
}